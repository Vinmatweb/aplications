(() => {
  "use strict";

  const SHEET_ID = "1QvOa1dYkQKgU7Ejf482OGdSHib7C0KW6J6KIBDv5GTs";
  const SHEET_NAME = "Nápady a priority";
  const SHEET_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
  const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets/";
  const clientId = window.VINMAT_SYNC_CONFIG?.googleClientId?.trim() || "";
  const typeByList = { priorities: "Priorita", ideas: "Nápad" };
  const listByType = { Priorita: "priorities", Nápad: "ideas" };
  const importanceToSheet = { high: "Vysoká", medium: "Střední", low: "Nízká" };
  const importanceFromSheet = { Vysoká: "high", Střední: "medium", Nízká: "low" };
  const fields = ["list", "text", "importance", "project", "source"];
  let accessToken = "";
  let baseline = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function emptyBoard() {
    return { version: 1, priorities: [], ideas: [] };
  }

  function sheetRange(range) {
    const quotedName = "'" + SHEET_NAME.replace(/'/g, "''") + "'!";
    return encodeURIComponent(quotedName + range);
  }

  function apiUrl(path) {
    const separator = path.startsWith(":") || path.startsWith("?") ? "" : "/";
    return SHEETS_API + SHEET_ID + separator + path;
  }

  async function apiRequest(path, options = {}) {
    if (!accessToken) throw new Error("Připoj Google Sheets, aby se změny mohly uložit.");
    const headers = { Authorization: "Bearer " + accessToken };
    const request = { method: options.method || "GET", headers };
    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
      request.body = JSON.stringify(options.body);
    }

    const response = await fetch(apiUrl(path), request);
    const payload = await response.json().catch(() => null);
    if (response.status === 401) {
      accessToken = "";
      baseline = null;
      window.dispatchEvent(new CustomEvent("vinmat-sheets-auth-expired"));
      throw new Error("Přihlášení ke Google Sheets vypršelo. Znovu připoj Google účet.");
    }
    if (!response.ok) {
      const message = payload?.error?.message || "Google Sheets vrátil chybu " + response.status + ".";
      if (response.status === 403) {
        throw new Error("Přihlášený Google účet nemá oprávnění upravovat společný Sheet. " + message);
      }
      throw new Error(message);
    }
    return payload || {};
  }

  function requestAccessToken() {
    if (!clientId) {
      return Promise.reject(new Error("Chybí Google OAuth Client ID v souboru config.js."));
    }
    const oauth = window.google?.accounts?.oauth2;
    if (!oauth) {
      return Promise.reject(new Error("Google přihlášení se ještě nenačetlo. Zkus to prosím za chvíli."));
    }
    return new Promise((resolve, reject) => {
      const tokenClient = oauth.initTokenClient({
        client_id: clientId,
        scope: SHEET_SCOPE,
        include_granted_scopes: true,
        callback: response => {
          if (response.error || !response.access_token) {
            reject(new Error(response.error_description || response.error || "Google přihlášení se nezdařilo."));
            return;
          }
          resolve(response.access_token);
        },
        error_callback: response => reject(new Error(response.message || "Google přihlášení se nezdařilo."))
      });
      tokenClient.requestAccessToken({});
    });
  }

  function stableRowId(type, text, project, source, occurrence) {
    const sourceText = [type, text, project, source, occurrence].join("\u001f");
    let first = 0x811c9dc5;
    let second = 0x9e3779b9;
    for (let index = 0; index < sourceText.length; index += 1) {
      const character = sourceText.charCodeAt(index);
      first = Math.imul(first ^ character, 0x01000193);
      second = Math.imul(second ^ (character + index), 0x85ebca6b);
    }
    return "sheet-" + (first >>> 0).toString(36) + "-" + (second >>> 0).toString(36);
  }

  async function writeCellRanges(data) {
    if (!data.length) return;
    await apiRequest("values:batchUpdate?valueInputOption=RAW", {
      method: "POST",
      body: { valueInputOption: "RAW", data }
    });
  }

  async function readRemoteBoard() {
    const response = await apiRequest(
      "values/" + sheetRange("A5:G") + "?valueRenderOption=UNFORMATTED_VALUE"
    );
    const values = response.values || [];
    const headers = values[0] || [];
    const expected = ["Typ", "Pořadí", "Úkol / nápad", "Důležitost", "Projekt", "Zdroj", "ID"];
    if (expected.some((header, index) => headers[index] !== header)) {
      throw new Error("Záhlaví listu Nápady a priority neodpovídá synchronizační tabulce.");
    }

    const rowsById = new Map();
    const missingIds = [];
    const duplicates = new Set();
    const occurrences = new Map();
    const sortedItems = { priorities: [], ideas: [] };

    for (let index = 1; index < values.length; index += 1) {
      const row = values[index] || [];
      const type = String(row[0] ?? "").trim();
      const text = String(row[2] ?? "").trim();
      if (!type && !text) continue;
      if (!text) continue;
      const list = listByType[type];
      if (!list) {
        throw new Error("Řádek " + (5 + index) + " nemá platný typ „Priorita“ nebo „Nápad“.");
      }

      const project = String(row[4] ?? "").trim();
      const source = String(row[5] ?? "").trim();
      const signature = [type, text, project, source].join("\u001f");
      const occurrence = occurrences.get(signature) || 0;
      occurrences.set(signature, occurrence + 1);
      const rowNumber = 5 + index;
      const id = String(row[6] ?? "").trim() || stableRowId(type, text, project, source, occurrence);
      if (rowsById.has(id)) duplicates.add(id);

      const rankText = String(row[1] ?? "").trim();
      const rank = rankText && Number.isFinite(Number(rankText)) ? Number(rankText) : rowNumber;
      const sheetImportance = String(row[3] ?? "").trim();
      const item = {
        id,
        text,
        project,
        source,
        _sheetRow: rowNumber,
        _sheetOrder: rankText && Number.isFinite(Number(rankText)) ? Number(rankText) : null
      };
      if (list === "priorities") item.importance = importanceFromSheet[sheetImportance] || "medium";
      sortedItems[list].push({ item, rank, rowNumber });
      rowsById.set(id, { item, list, rowNumber });
      if (!String(row[6] ?? "").trim()) missingIds.push({ rowNumber, id });
    }

    if (duplicates.size) {
      throw new Error("V Google Sheetu jsou duplicitní interní ID. Nejdřív je potřeba opravit sloupec ID.");
    }

    for (const list of ["priorities", "ideas"]) {
      sortedItems[list].sort((left, right) => left.rank - right.rank || left.rowNumber - right.rowNumber);
    }

    return {
      board: {
        version: 1,
        priorities: sortedItems.priorities.map(entry => entry.item),
        ideas: sortedItems.ideas.map(entry => entry.item)
      },
      rowsById,
      missingIds
    };
  }

  async function readBoardAndFillIds() {
    let remote = await readRemoteBoard();
    if (remote.missingIds.length) {
      await writeCellRanges(remote.missingIds.map(entry => ({
        range: "'" + SHEET_NAME + "'!G" + entry.rowNumber,
        values: [[entry.id]]
      })));
      remote = await readRemoteBoard();
      if (remote.missingIds.length) {
        throw new Error("Google Sheet nepřijal interní ID. Zkontroluj oprávnění k zápisu.");
      }
    }
    const lastRowNumber = [...remote.rowsById.values()].reduce(
      (maximum, entry) => Math.max(maximum, entry.rowNumber),
      5
    );
    await ensureTableRange(lastRowNumber);
    return remote;
  }

  function flatten(board) {
    const result = new Map();
    for (const list of ["priorities", "ideas"]) {
      (board[list] || []).forEach(item => result.set(item.id, { item, list }));
    }
    return result;
  }

  function fieldValue(record, field) {
    if (!record) return null;
    if (field === "list") return record.list;
    if (field === "importance" && record.list === "ideas") return "";
    return String(record.item[field] ?? "");
  }

  function sameRecord(left, right) {
    return fields.every(field => fieldValue(left, field) === fieldValue(right, field));
  }

  function sameArray(left, right) {
    return left.length === right.length && left.every((id, index) => id === right[index]);
  }

  function displayConflict(id, baseRecord, localRecord, remoteRecord) {
    const record = localRecord || remoteRecord || baseRecord;
    return record ? record.item.text : id;
  }

  function mergeBoards(baseBoard, localBoard, remoteBoard, preference = "remote") {
    const base = flatten(baseBoard || emptyBoard());
    const local = flatten(localBoard || emptyBoard());
    const remote = flatten(remoteBoard || emptyBoard());
    const ids = new Set([...base.keys(), ...local.keys(), ...remote.keys()]);
    const merged = new Map();
    const conflicts = [];
    const preferLocal = preference === "local";

    function noteConflict(label) {
      if (!conflicts.includes(label)) conflicts.push(label);
    }

    for (const id of ids) {
      const before = base.get(id);
      const ours = local.get(id);
      const theirs = remote.get(id);
      if (!before) {
        if (ours && theirs && !sameRecord(ours, theirs)) {
          noteConflict(displayConflict(id, before, ours, theirs));
          merged.set(id, preferLocal ? ours : theirs);
        } else if (ours || theirs) {
          merged.set(id, theirs || ours);
        }
        continue;
      }

      if (!ours && !theirs) continue;
      if (!ours && theirs) {
        if (sameRecord(theirs, before)) continue;
        noteConflict(displayConflict(id, before, ours, theirs));
        if (!preferLocal) merged.set(id, theirs);
        continue;
      }
      if (ours && !theirs) {
        if (sameRecord(ours, before)) continue;
        noteConflict(displayConflict(id, before, ours, theirs));
        if (preferLocal) merged.set(id, ours);
        continue;
      }

      const chosen = { item: { id }, list: "ideas" };
      for (const field of fields) {
        const beforeValue = fieldValue(before, field);
        const ourValue = fieldValue(ours, field);
        const theirValue = fieldValue(theirs, field);
        const oursChanged = ourValue !== beforeValue;
        const theirsChanged = theirValue !== beforeValue;
        let value;
        if (oursChanged && theirsChanged && ourValue !== theirValue) {
          noteConflict(displayConflict(id, before, ours, theirs));
          value = preferLocal ? ourValue : theirValue;
        } else {
          value = oursChanged ? ourValue : theirValue;
        }
        if (field === "list") chosen.list = value;
        else chosen.item[field] = value;
      }
      const rowSource = theirs.item || ours.item || before.item;
      chosen.item._sheetRow = rowSource._sheetRow;
      chosen.item._sheetOrder = rowSource._sheetOrder ?? null;
      if (chosen.list === "priorities") {
        chosen.item.importance = chosen.item.importance || "medium";
      } else {
        delete chosen.item.importance;
      }
      merged.set(id, chosen);
    }

    const output = emptyBoard();
    for (const list of ["priorities", "ideas"]) {
      const remaining = new Set([...merged.entries()]
        .filter(([, record]) => record.list === list)
        .map(([id]) => id));
      const eligibleBase = new Set((baseBoard?.[list] || [])
        .map(item => item.id)
        .filter(id => remaining.has(id) &&
          local.get(id)?.list === list &&
          remote.get(id)?.list === list));
      const baseOrder = (baseBoard?.[list] || []).map(item => item.id).filter(id => eligibleBase.has(id));
      const localOrder = (localBoard?.[list] || []).map(item => item.id).filter(id => eligibleBase.has(id));
      const remoteOrder = (remoteBoard?.[list] || []).map(item => item.id).filter(id => eligibleBase.has(id));
      const localReordered = !sameArray(localOrder, baseOrder);
      const remoteReordered = !sameArray(remoteOrder, baseOrder);
      if (localReordered && remoteReordered && !sameArray(localOrder, remoteOrder)) {
        noteConflict("Pořadí: " + (list === "priorities" ? "priority" : "nápadů"));
      }

      let primaryOrder;
      let secondaryOrder;
      if (localReordered && (!remoteReordered || preferLocal)) {
        primaryOrder = (localBoard?.[list] || []).map(item => item.id);
        secondaryOrder = (remoteBoard?.[list] || []).map(item => item.id);
      } else {
        primaryOrder = (remoteBoard?.[list] || []).map(item => item.id);
        secondaryOrder = (localBoard?.[list] || []).map(item => item.id);
      }
      const ordered = [];
      const included = new Set();
      for (const id of primaryOrder) {
        if (remaining.has(id) && !included.has(id)) {
          ordered.push(id);
          included.add(id);
        }
      }
      const missingFromPrimary = secondaryOrder.filter(id => remaining.has(id) && !included.has(id));
      for (const id of missingFromPrimary) {
        const secondaryIndex = secondaryOrder.indexOf(id);
        let previousAnchor = null;
        for (let index = secondaryIndex - 1; index >= 0; index -= 1) {
          if (included.has(secondaryOrder[index])) {
            previousAnchor = secondaryOrder[index];
            break;
          }
        }
        let nextAnchor = null;
        if (!previousAnchor) {
          for (let index = secondaryIndex + 1; index < secondaryOrder.length; index += 1) {
            if (included.has(secondaryOrder[index])) {
              nextAnchor = secondaryOrder[index];
              break;
            }
          }
        }
        if (previousAnchor) {
          ordered.splice(ordered.indexOf(previousAnchor) + 1, 0, id);
        } else if (nextAnchor) {
          ordered.splice(ordered.indexOf(nextAnchor), 0, id);
        } else {
          ordered.push(id);
        }
        included.add(id);
      }
      for (const [id, record] of merged) {
        if (record.list === list && !included.has(id)) ordered.push(id);
      }
      output[list] = ordered.map(id => merged.get(id).item);
    }
    return { board: output, conflicts };
  }

  function valuesFor(list, item, rank, isNew = false) {
    return [
      typeByList[list],
      rank,
      item.text,
      list === "priorities" ? (importanceToSheet[item.importance] || "Střední") : "",
      item.project ?? (isNew ? "VinMat" : ""),
      item.source ?? (isNew ? "Webová aplikace" : ""),
      item.id
    ];
  }

  async function ensureTableRange(lastRowNumber) {
    const metadata = await apiRequest("?fields=sheets(properties(sheetId,title),tables(tableId,range))");
    const sheet = (metadata.sheets || []).find(entry => entry.properties?.title === SHEET_NAME);
    const table = sheet?.tables?.[0];
    if (!sheet || !table) throw new Error("V Google Sheetu chybí očekávaná nativní tabulka.");
    const endRowIndex = Math.max(table.range.endRowIndex || 0, lastRowNumber || 5);
    if (table.range.endColumnIndex >= 7 && endRowIndex === table.range.endRowIndex) return;
    await apiRequest(":batchUpdate", {
      method: "POST",
      body: {
        requests: [{
          updateTable: {
            table: {
              tableId: table.tableId,
              range: {
                sheetId: sheet.properties.sheetId,
                startRowIndex: table.range.startRowIndex,
                endRowIndex,
                startColumnIndex: table.range.startColumnIndex,
                endColumnIndex: Math.max(table.range.endColumnIndex, 7)
              }
            },
            fields: "range"
          }
        }]
      }
    });
  }

  async function writeBoard(remote, desiredBoard) {
    const current = flatten(remote.board);
    const desired = flatten(desiredBoard);
    const currentPositions = new Map();
    const desiredPositions = new Map();
    for (const list of ["priorities", "ideas"]) {
      remote.board[list].forEach((item, index) => currentPositions.set(item.id, { list, rank: index + 1 }));
      desiredBoard[list].forEach((item, index) => desiredPositions.set(item.id, { list, rank: index + 1 }));
    }

    const updates = [];
    for (const [id, currentRecord] of current) {
      const wanted = desired.get(id);
      const rowNumber = currentRecord.item._sheetRow;
      if (!wanted) {
        updates.push({
          range: "'" + SHEET_NAME + "'!A" + rowNumber + ":G" + rowNumber,
          values: [["", "", "", "", "", "", ""]]
        });
        continue;
      }
      const position = desiredPositions.get(id);
      const currentPosition = currentPositions.get(id);
      const wantedValues = valuesFor(position.list, wanted.item, position.rank);
      const existingValues = [
        typeByList[currentPosition.list],
        currentRecord.item._sheetOrder ?? "",
        currentRecord.item.text,
        currentPosition.list === "priorities"
          ? (importanceToSheet[currentRecord.item.importance] || "Střední")
          : "",
        currentRecord.item.project ?? "",
        currentRecord.item.source ?? "",
        currentRecord.item.id
      ];
      if (wantedValues.some((value, index) => String(value ?? "") !== String(existingValues[index] ?? ""))) {
        updates.push({
          range: "'" + SHEET_NAME + "'!A" + rowNumber + ":G" + rowNumber,
          values: [wantedValues]
        });
      }
    }

    if (updates.length) await writeCellRanges(updates);

    const appended = [];
    for (const list of ["priorities", "ideas"]) {
      desiredBoard[list].forEach((item, index) => {
        if (!item._sheetRow) appended.push(valuesFor(list, item, index + 1, true));
      });
    }
    if (appended.length) {
      const appendPath = "values/" + sheetRange("A:G") +
        ":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS";
      await apiRequest(appendPath, {
        method: "POST",
        body: { majorDimension: "ROWS", values: appended }
      });
    }
  }

  async function connect() {
    accessToken = await requestAccessToken();
    try {
      const remote = await readBoardAndFillIds();
      baseline = clone(remote.board);
      return clone(remote.board);
    } catch (error) {
      disconnect();
      throw error;
    }
  }

  function disconnect() {
    accessToken = "";
    baseline = null;
  }

  async function refresh() {
    if (!accessToken) throw new Error("Připoj Google Sheets, aby se načetly společné změny.");
    const remote = await readBoardAndFillIds();
    baseline = clone(remote.board);
    return clone(remote.board);
  }

  async function save(localBoard, baseBoard = baseline) {
    if (!accessToken || !baseline) throw new Error("Připoj Google Sheets, aby se změny uložily.");
    const remote = await readBoardAndFillIds();
    const mergeBase = baseBoard || baseline;
    let merged = mergeBoards(mergeBase, localBoard, remote.board);
    let keptRemoteConflicts = false;
    if (merged.conflicts.length) {
      const useLocal = window.confirm(
        "Stejné položky nebo jejich pořadí se změnily také v Google Sheetu. " +
        "Chceš v těchto konfliktech použít verzi z aplikace? " +
        "Zrušit ponechá konfliktní hodnoty ze Sheetu; ostatní změny se synchronizují dál."
      );
      merged = mergeBoards(mergeBase, localBoard, remote.board, useLocal ? "local" : "remote");
      keptRemoteConflicts = !useLocal;
    }
    await writeBoard(remote, merged.board);
    const saved = await readBoardAndFillIds();
    baseline = clone(saved.board);
    return { board: clone(saved.board), keptRemoteConflicts };
  }

  function isConnected() {
    return Boolean(accessToken && baseline);
  }

  function isConfigured() {
    return Boolean(clientId);
  }

  window.VinmatSheetSync = { connect, disconnect, refresh, save, isConnected, isConfigured };
})();
