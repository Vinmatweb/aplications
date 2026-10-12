(() => {
  "use strict";

  const THEME_KEY = "vinmat-ideas-and-priorities-theme-v1";
  const MODE_KEY = "vinmat-ideas-and-priorities-mode-v1";
  const DATA_VERSION = 1;
  const THEMES = ["graffiti", "classic", "hybrid"];
  const MODES = ["day", "night"];
  const sheetSync = window.VinmatSheetSync;

  const elements = {
    board: document.querySelector(".app-shell"),
    priorityList: document.getElementById("priority-list"),
    ideaList: document.getElementById("idea-list"),
    priorityForm: document.getElementById("priority-form"),
    ideaForm: document.getElementById("idea-form"),
    priorityInput: document.getElementById("priority-input"),
    ideaInput: document.getElementById("idea-input"),
    priorityEmpty: document.getElementById("priority-empty"),
    ideaEmpty: document.getElementById("idea-empty"),
    priorityCount: document.getElementById("priority-count"),
    ideaCount: document.getElementById("idea-count"),
    summaryText: document.getElementById("summary-text"),
    saveStatus: document.getElementById("save-status"),
    toast: document.getElementById("toast"),
    exportButton: document.getElementById("export-button"),
    importButton: document.getElementById("import-button"),
    importFile: document.getElementById("import-file"),
    syncConnectButton: document.getElementById("sync-connect-button"),
    syncRefreshButton: document.getElementById("sync-refresh-button"),
    syncDot: document.getElementById("sync-dot"),
    themeSelect: document.getElementById("theme-select"),
    modeToggle: document.getElementById("mode-toggle"),
    modeIcon: document.getElementById("mode-icon"),
    modeLabel: document.getElementById("mode-label")
  };

  let state = emptyBoard();
  let lastSavedState = emptyBoard();
  let draggedItem = null;
  let editingItem = null;
  let toastTimer = null;
  let activeRecognition = null;
  let syncPollTimer = null;
  let saveQueue = Promise.resolve();
  let pendingSaves = 0;
  let hasLoadedBoard = false;

  applySavedAppearance();
  render();
  setupVoiceInput();
  setBoardEnabled(false);
  updateSyncControls();
  setupSyncControls();

  function makeId() {
    return globalThis.crypto?.randomUUID?.() || `ukol-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function emptyBoard() {
    return { version: DATA_VERSION, priorities: [], ideas: [] };
  }

  function loadTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return THEMES.includes(saved) ? saved : "classic";
    } catch {
      return "classic";
    }
  }

  function loadMode() {
    try {
      const saved = localStorage.getItem(MODE_KEY);
      return MODES.includes(saved) ? saved : "day";
    } catch {
      return "day";
    }
  }

  function applySavedAppearance() {
    const theme = loadTheme();
    const mode = loadMode();
    document.body.dataset.theme = theme;
    document.body.dataset.mode = mode;
    elements.themeSelect.value = theme;
    updateModeToggle();
  }

  function updateModeToggle() {
    const isNight = document.body.dataset.mode === "night";
    elements.modeIcon.textContent = isNight ? "☾" : "☀";
    elements.modeLabel.textContent = isNight ? "Noc" : "Den";
    elements.modeToggle.setAttribute("aria-pressed", String(isNight));
    elements.modeToggle.setAttribute("aria-label", isNight ? "Přepnout na denní režim" : "Přepnout na noční režim");
    const colors = {
      classic: { day: "#f6f5f0", night: "#111417" },
      graffiti: { day: "#d6d9d7", night: "#0b0d0e" },
      hybrid: { day: "#e8e9e4", night: "#13191a" }
    };
    const themeColor = document.querySelector('meta[name="theme-color"]');
    themeColor?.setAttribute("content", colors[document.body.dataset.theme][isNight ? "night" : "day"]);
  }

  function normalizeBoard(value) {
    if (!value || !Array.isArray(value.priorities) || !Array.isArray(value.ideas)) {
      throw new Error("Tato záloha neobsahuje platnou tabuli.");
    }
    const cleanItems = items => items
      .filter(item => item && typeof item.text === "string" && item.text.trim())
      .map(item => {
        let text = item.text.trim();
        if (item.id === "starter-coloring-pack" && text === "Finish the Halloween coloring pack") text = "Dokončit halloweenský balíček omalovánek";
        if (item.id === "starter-tracing-pack" && text === "Finish the Halloween tracing pages") text = "Dokončit halloweenské obtahovačky";
        return {
          id: typeof item.id === "string" && item.id ? item.id : makeId(),
          text,
          project: typeof item.project === "string" ? item.project : "",
          source: typeof item.source === "string" ? item.source : "",
          ...(Number.isInteger(item._sheetRow) ? { _sheetRow: item._sheetRow } : {}),
          ...(typeof item._sheetOrder === "number" ? { _sheetOrder: item._sheetOrder } : {}),
          ...(items === value.priorities ? { importance: ["high", "medium", "low"].includes(item.importance) ? item.importance : "medium" } : {})
        };
      });
    return {
      version: DATA_VERSION,
      priorities: cleanItems(value.priorities),
      ideas: cleanItems(value.ideas)
    };
  }

  function saveBoard(showSaved = true) {
    if (!sheetSync?.isConnected()) {
      elements.saveStatus.textContent = "Připoj Google Sheets; změna zatím není uložená.";
      return Promise.resolve();
    }
    const snapshot = normalizeBoard(structuredClone(state));
    pendingSaves += 1;
    setBoardEnabled(false);
    elements.saveStatus.textContent = "Ukládám do Google Sheets…";
    updateSyncControls();
    saveQueue = saveQueue.then(async () => {
      const result = await sheetSync.save(snapshot);
      state = normalizeBoard(result.board);
      lastSavedState = normalizeBoard(result.board);
      render();
      hasLoadedBoard = true;
      elements.saveStatus.textContent = "Synchronizováno v " + currentTime();
      if (result.keptRemoteConflicts) {
        showToast("Konfliktní položky zůstaly podle Google Sheetu; ostatní změny jsou uložené.");
      } else if (showSaved) {
        showToast("Změna je uložená v Google Sheets.");
      }
    }).catch(error => {
      elements.saveStatus.textContent = sheetSync?.isConnected()
        ? "Synchronizace se nezdařila"
        : "Přihlášení vypršelo; změna není uložená.";
      showToast(error.message || "Změnu se nepodařilo uložit do Google Sheets.");
      if (!sheetSync?.isConnected()) {
        document.body.dataset.sync = "offline";
        setBoardEnabled(false);
      } else {
        setBoardEnabled(true);
      }
    }).finally(() => {
      pendingSaves = Math.max(0, pendingSaves - 1);
      updateSyncControls();
      if (sheetSync?.isConnected()) setBoardEnabled(true);
    });
    return saveQueue;
  }

  function currentTime() {
    return new Intl.DateTimeFormat("cs-CZ", { hour: "2-digit", minute: "2-digit" }).format(new Date());
  }

  function boardSignature(board) {
    const signatureItems = list => (board[list] || []).map(item => ({
      id: item.id,
      text: item.text,
      importance: list === "priorities" ? item.importance || "medium" : "",
      project: item.project || "",
      source: item.source || ""
    }));
    return JSON.stringify({
      priorities: signatureItems("priorities"),
      ideas: signatureItems("ideas")
    });
  }

  function hasUnsavedChanges() {
    return boardSignature(state) !== boardSignature(lastSavedState);
  }

  function setBoardEnabled(enabled) {
    const ready = Boolean(enabled && pendingSaves === 0 && sheetSync?.isConnected());
    document.body.dataset.sync = ready ? "connected" : "offline";
    [elements.priorityForm, elements.ideaForm].forEach(form => {
      form.querySelectorAll("input, button").forEach(control => { control.disabled = !ready; });
    });
    elements.importButton.disabled = !ready;
    elements.importFile.disabled = !ready;
    elements.exportButton.disabled = !hasLoadedBoard;
    document.querySelectorAll("[data-task-card] input, [data-task-card] button, [data-task-card] select").forEach(control => {
      control.disabled = !ready;
      if (control.classList.contains("drag-handle")) control.draggable = ready;
    });
  }

  function updateSyncControls() {
    const connected = Boolean(sheetSync?.isConnected());
    elements.syncConnectButton.textContent = connected ? "Odpojit Google" : "Připojit Google Sheets";
    elements.syncConnectButton.setAttribute("aria-label", connected ? "Odpojit Google Sheets" : "Připojit Google Sheets");
    elements.syncConnectButton.disabled = pendingSaves > 0;
    elements.syncRefreshButton.hidden = !connected;
    elements.syncRefreshButton.textContent = hasUnsavedChanges() ? "Zkusit uložit" : "Načíst změny";
    elements.syncRefreshButton.disabled = pendingSaves > 0;
    elements.syncDot.classList.toggle("is-connected", connected);
    elements.syncDot.classList.toggle("is-offline", !connected);
  }

  function setupSyncControls() {
    elements.syncConnectButton.addEventListener("click", connectGoogleSheet);
    elements.syncRefreshButton.addEventListener("click", () => {
      if (hasUnsavedChanges()) saveBoard();
      else refreshFromSheet(true);
    });
    window.addEventListener("vinmat-sheets-auth-expired", () => {
      if (syncPollTimer) clearInterval(syncPollTimer);
      syncPollTimer = null;
      setBoardEnabled(false);
      updateSyncControls();
      elements.saveStatus.textContent = "Přihlášení vypršelo. Znovu připoj Google Sheets.";
    });
  }

  async function connectGoogleSheet() {
    if (sheetSync?.isConnected()) {
      sheetSync.disconnect();
      if (syncPollTimer) clearInterval(syncPollTimer);
      syncPollTimer = null;
      setBoardEnabled(false);
      updateSyncControls();
      elements.saveStatus.textContent = "Google Sheets je odpojený; data zůstávají uložená v tabulce.";
      return;
    }
    const pendingBoard = normalizeBoard(structuredClone(state));
    const savedBaseline = normalizeBoard(structuredClone(lastSavedState));
    const hadUnsavedChanges = hasLoadedBoard && hasUnsavedChanges();
    elements.syncConnectButton.disabled = true;
    elements.saveStatus.textContent = "Připojuji Google Sheets…";
    try {
      const remoteBoard = await sheetSync.connect();
      state = normalizeBoard(remoteBoard);
      hasLoadedBoard = true;
      if (hadUnsavedChanges) {
        const result = await sheetSync.save(pendingBoard, savedBaseline);
        state = normalizeBoard(result.board);
        lastSavedState = normalizeBoard(result.board);
      } else {
        lastSavedState = normalizeBoard(remoteBoard);
      }
      render();
      setBoardEnabled(true);
      updateSyncControls();
      elements.saveStatus.textContent = "Načteno z Google Sheets v " + currentTime();
      if (syncPollTimer) clearInterval(syncPollTimer);
      syncPollTimer = setInterval(() => refreshFromSheet(false), 30000);
    } catch (error) {
      setBoardEnabled(false);
      updateSyncControls();
      elements.saveStatus.textContent = "Google Sheets se nepodařilo připojit";
      showToast(error.message || "Google Sheets se nepodařilo připojit.");
    } finally {
      elements.syncConnectButton.disabled = false;
      updateSyncControls();
    }
  }

  async function refreshFromSheet(manual) {
    if (!sheetSync?.isConnected() || pendingSaves || editingItem) return;
    if (hasUnsavedChanges()) {
      if (manual) saveBoard();
      return;
    }
    try {
      const remoteBoard = await sheetSync.refresh();
      state = normalizeBoard(remoteBoard);
      lastSavedState = normalizeBoard(remoteBoard);
      hasLoadedBoard = true;
      render();
      setBoardEnabled(true);
      updateSyncControls();
      elements.saveStatus.textContent = "Načteno z Google Sheets v " + currentTime();
    } catch (error) {
      elements.saveStatus.textContent = "Načtení změn se nezdařilo";
      if (!sheetSync?.isConnected()) setBoardEnabled(false);
      if (manual) showToast(error.message || "Google Sheets se nepodařilo načíst.");
      updateSyncControls();
    }
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function render() {
    elements.priorityList.innerHTML = state.priorities.map((item, index) => renderTask(item, "priorities", index)).join("");
    elements.ideaList.innerHTML = state.ideas.map((item, index) => renderTask(item, "ideas", index)).join("");

    elements.priorityCount.textContent = state.priorities.length;
    elements.ideaCount.textContent = state.ideas.length;
    elements.priorityEmpty.hidden = state.priorities.length > 0;
    elements.ideaEmpty.hidden = state.ideas.length > 0;
    elements.summaryText.textContent = `${state.priorities.length} ${czechCount(state.priorities.length, ["priorita", "priority", "priorit"])} · ${state.ideas.length} ${czechCount(state.ideas.length, ["nápad", "nápady", "nápadů"])}`;
    setBoardEnabled(Boolean(sheetSync?.isConnected() && pendingSaves === 0));
    updateSyncControls();
  }

  function renderTask(item, listName, index) {
    const isPriority = listName === "priorities";
    const editing = editingItem?.id === item.id && editingItem?.list === listName;
    const safeText = escapeHTML(item.text);
    const importance = item.importance || "medium";
    const dragLabel = isPriority ? `Přetáhnout prioritu ${index + 1}` : `Přetáhnout nápad ${index + 1}`;
    const moveLabel = isPriority ? "prioritu" : "nápad";
    const accessibleRank = isPriority ? `Priorita ${index + 1}` : `Nápad ${index + 1}`;

    return `<li class="task-card ${isPriority ? "priority-card" : "idea-card"}" data-task-card data-item-id="${escapeHTML(item.id)}" data-list-name="${listName}">
      <span class="task-rank ${isPriority ? "" : "idea-rank"}" aria-label="${accessibleRank}">${isPriority ? index + 1 : "✳"}</span>
      <button class="drag-handle" type="button" draggable="true" aria-label="${dragLabel}" title="Přetáhnout a přesunout">
        <svg viewBox="0 0 16 20" aria-hidden="true"><circle cx="5" cy="4" r="1.3"/><circle cx="11" cy="4" r="1.3"/><circle cx="5" cy="10" r="1.3"/><circle cx="11" cy="10" r="1.3"/><circle cx="5" cy="16" r="1.3"/><circle cx="11" cy="16" r="1.3"/></svg>
      </button>
      <div class="task-content">
        ${editing ? `<form class="edit-form" data-edit-form data-list="${listName}" data-id="${escapeHTML(item.id)}">
          <label class="sr-only" for="edit-${escapeHTML(item.id)}">Upravit položku</label>
          <input id="edit-${escapeHTML(item.id)}" class="edit-input" name="task" maxlength="180" value="${safeText}" required>
          <button class="text-action save-edit" type="submit">Uložit</button>
          <button class="text-action cancel-edit" type="button" data-action="cancel-edit">Zrušit</button>
        </form>` : `<div class="task-title-row"><span class="task-title">${safeText}</span><button class="text-action edit-action" type="button" data-action="edit" aria-label="Upravit: ${safeText}">Upravit</button>
          ${isPriority ? `<select class="importance-select importance-${importance}" data-action="importance" aria-label="Důležitost: ${safeText}" title="Důležitost">
            <option value="high" ${importance === "high" ? "selected" : ""}>Vysoká</option>
            <option value="medium" ${importance === "medium" ? "selected" : ""}>Střední</option>
            <option value="low" ${importance === "low" ? "selected" : ""}>Nízká</option>
          </select>` : ""}
        </div>`}
      </div>
      <div class="task-actions" aria-label="Akce pro ${isPriority ? "prioritu" : "nápad"}">
        <button class="icon-button move-up" type="button" data-action="move-up" aria-label="Posunout ${moveLabel} výš" title="Posunout výš" ${index === 0 ? "disabled" : ""}>↑</button>
        <button class="icon-button move-down" type="button" data-action="move-down" aria-label="Posunout ${moveLabel} níž" title="Posunout níž" ${index === (isPriority ? state.priorities : state.ideas).length - 1 ? "disabled" : ""}>↓</button>
        ${isPriority
          ? ""
          : `<button class="text-action promote-action" type="button" data-action="promote" title="Zařadit mezi priority"><span aria-hidden="true">↗</span> Zařadit</button>`}
        <button class="icon-button delete-action" type="button" data-action="delete" aria-label="Smazat: ${safeText}" title="Smazat">×</button>
      </div>
    </li>`;
  }

  function czechCount(count, forms) {
    const lastTwo = count % 100;
    const last = count % 10;
    if (count === 1) return forms[0];
    if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return forms[1];
    return forms[2];
  }

  function addTask(listName, text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (listName === "priorities") {
      state.priorities.push({ id: makeId(), text: trimmed, importance: "medium", project: "VinMat", source: "Webová aplikace" });
    } else {
      state.ideas.push({ id: makeId(), text: trimmed, project: "VinMat", source: "Webová aplikace" });
    }
    saveBoard();
    render();
  }

  function findItem(listName, id) {
    return state[listName]?.find(item => item.id === id);
  }

  function handleAction(event) {
    if (!sheetSync?.isConnected() || pendingSaves > 0) return;
    const actionButton = event.target.closest("[data-action]");
    const card = event.target.closest("[data-task-card]");
    if (!actionButton || !card) return;
    if (actionButton.dataset.action === "importance" && event.type !== "change") return;
    const listName = card.dataset.listName;
    const id = card.dataset.itemId;
    const list = state[listName];
    const index = list.findIndex(item => item.id === id);
    const item = list[index];
    if (!item) return;

    switch (actionButton.dataset.action) {
      case "edit":
        editingItem = { id, list: listName };
        render();
        document.getElementById(`edit-${CSS.escape(id)}`)?.focus();
        break;
      case "cancel-edit":
        editingItem = null;
        render();
        break;
      case "delete":
        list.splice(index, 1);
        editingItem = null;
        saveBoard();
        render();
        showToast("Položka byla smazána.");
        break;
      case "move-up":
      case "move-down": {
        const nextIndex = index + (actionButton.dataset.action === "move-up" ? -1 : 1);
        if (nextIndex < 0 || nextIndex >= list.length) return;
        [list[index], list[nextIndex]] = [list[nextIndex], list[index]];
        saveBoard();
        render();
        showToast(`Přesunuto na ${nextIndex + 1}. místo.`);
        break;
      }
      case "promote":
        state.ideas.splice(index, 1);
        state.priorities.push({ ...item, importance: "medium" });
        editingItem = null;
        saveBoard();
        render();
        showToast("Přidáno mezi priority se střední důležitostí.");
        break;
      case "importance":
        item.importance = actionButton.value;
        actionButton.className = `importance-select importance-${item.importance}`;
        saveBoard();
        break;
      default:
        break;
    }
  }

  function moveByDrop(fromListName, id, toListName, targetId, insertAfter) {
    if (!state[fromListName] || !state[toListName]) return;
    const source = state[fromListName];
    const sourceIndex = source.findIndex(item => item.id === id);
    if (sourceIndex < 0) return;
    const [item] = source.splice(sourceIndex, 1);
    if (fromListName !== toListName) {
      if (toListName === "priorities") item.importance = item.importance || "medium";
      else delete item.importance;
    }
    const target = state[toListName];
    let targetIndex = targetId ? target.findIndex(entry => entry.id === targetId) : target.length;
    if (targetIndex < 0) targetIndex = target.length;
    if (insertAfter && targetId) targetIndex += 1;
    target.splice(targetIndex, 0, item);
    draggedItem = null;
    saveBoard();
    render();
    const message = fromListName === toListName
      ? `Přesunuto na ${targetIndex + 1}. místo.`
      : toListName === "priorities"
        ? "Nápad zařazen mezi priority se střední důležitostí."
        : "Priorita přesunuta zpět mezi nápady.";
    showToast(message);
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => elements.toast.classList.remove("is-visible"), 2600);
  }

  function setupVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      document.querySelectorAll("[data-dictate]").forEach(button => button.hidden = true);
      return;
    }
    document.querySelectorAll("[data-dictate]").forEach(button => {
      button.addEventListener("click", () => {
        if (activeRecognition) {
          activeRecognition.stop();
          return;
        }
        const input = document.getElementById(button.dataset.dictate);
        const recognition = new SpeechRecognition();
        recognition.lang = "cs-CZ";
        recognition.interimResults = false;
        recognition.continuous = false;
        activeRecognition = recognition;
        button.classList.add("is-listening");
        button.setAttribute("aria-pressed", "true");
        showToast("Poslouchám… Teď nadiktuj nápad nebo prioritu.");
        recognition.onresult = event => {
          const transcript = event.results?.[0]?.[0]?.transcript?.trim();
          if (transcript) {
            input.value = `${input.value.trim()}${input.value.trim() ? " " : ""}${transcript}`;
            input.focus();
          }
        };
        recognition.onerror = event => {
          if (event.error !== "no-speech" && event.error !== "aborted") showToast("Hlasový zápis není dostupný. Položku můžeš napsat.");
        };
        recognition.onend = () => {
          activeRecognition = null;
          button.classList.remove("is-listening");
          button.setAttribute("aria-pressed", "false");
        };
        try { recognition.start(); }
        catch { activeRecognition = null; button.classList.remove("is-listening"); button.setAttribute("aria-pressed", "false"); }
      });
    });
  }

  elements.priorityForm.addEventListener("submit", event => {
    event.preventDefault();
    addTask("priorities", elements.priorityInput.value);
    elements.priorityInput.value = "";
    elements.priorityInput.focus();
  });

  elements.ideaForm.addEventListener("submit", event => {
    event.preventDefault();
    addTask("ideas", elements.ideaInput.value);
    elements.ideaInput.value = "";
    elements.ideaInput.focus();
  });

  elements.board.addEventListener("click", handleAction);

  elements.board.addEventListener("submit", event => {
    const form = event.target.closest("[data-edit-form]");
    if (!form || !sheetSync?.isConnected() || pendingSaves > 0) return;
    event.preventDefault();
    const item = findItem(form.dataset.list, form.dataset.id);
    const text = new FormData(form).get("task")?.toString().trim();
    if (!item || !text) return;
    item.text = text.slice(0, 180);
    editingItem = null;
    saveBoard();
    render();
    showToast("Položka byla upravena.");
  });

  elements.board.addEventListener("change", event => {
    if (event.target.matches("[data-action='importance']")) handleAction(event);
  });

  elements.themeSelect.addEventListener("change", () => {
    const theme = THEMES.includes(elements.themeSelect.value) ? elements.themeSelect.value : "classic";
    document.body.dataset.theme = theme;
    updateModeToggle();
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* The selection still applies for this page view. */ }
  });

  elements.modeToggle.addEventListener("click", () => {
    const mode = document.body.dataset.mode === "night" ? "day" : "night";
    document.body.dataset.mode = mode;
    updateModeToggle();
    try { localStorage.setItem(MODE_KEY, mode); } catch { /* The selection still applies for this page view. */ }
  });

  elements.board.addEventListener("dragstart", event => {
    if (!sheetSync?.isConnected() || pendingSaves > 0) return;
    const handle = event.target.closest(".drag-handle");
    const card = handle?.closest("[data-task-card]");
    if (!card) return;
    draggedItem = { id: card.dataset.itemId, list: card.dataset.listName };
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedItem.id);
    card.classList.add("is-dragging");
  });

  elements.board.addEventListener("dragover", event => {
    const list = event.target.closest("[data-list]");
    if (!draggedItem || !list) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    elements.board.querySelectorAll(".drop-before, .drop-after, .list-drop-active").forEach(el => el.classList.remove("drop-before", "drop-after", "list-drop-active"));
    const card = event.target.closest("[data-task-card]");
    if (!card) {
      list.classList.add("list-drop-active");
      return;
    }
    const bounds = card.getBoundingClientRect();
    card.classList.add(event.clientY > bounds.top + bounds.height / 2 ? "drop-after" : "drop-before");
  });

  elements.board.addEventListener("drop", event => {
    if (!sheetSync?.isConnected() || pendingSaves > 0) return;
    const list = event.target.closest("[data-list]");
    if (!draggedItem || !list) return;
    event.preventDefault();
    const targetCard = event.target.closest("[data-task-card]");
    if (targetCard?.dataset.itemId === draggedItem.id) return;
    const after = targetCard ? event.clientY > targetCard.getBoundingClientRect().top + targetCard.getBoundingClientRect().height / 2 : false;
    const dragging = draggedItem;
    elements.board.querySelectorAll(".is-dragging, .drop-before, .drop-after, .list-drop-active").forEach(el => el.classList.remove("is-dragging", "drop-before", "drop-after", "list-drop-active"));
    moveByDrop(dragging.list, dragging.id, list.dataset.list, targetCard?.dataset.itemId || null, after);
  });

  elements.board.addEventListener("dragend", () => {
    draggedItem = null;
    elements.board.querySelectorAll(".is-dragging, .drop-before, .drop-after, .list-drop-active").forEach(el => el.classList.remove("is-dragging", "drop-before", "drop-after", "list-drop-active"));
  });

  elements.exportButton.addEventListener("click", () => {
    const exportItems = list => state[list].map(item => ({
      id: item.id,
      text: item.text,
      project: item.project || "",
      source: item.source || "",
      ...(list === "priorities" ? { importance: item.importance || "medium" } : {})
    }));
    const backup = {
      version: DATA_VERSION,
      priorities: exportItems("priorities"),
      ideas: exportItems("ideas"),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vinmat-napady-a-priority-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Záloha tabule byla stažena.");
  });

  elements.importButton.addEventListener("click", () => elements.importFile.click());
  elements.importFile.addEventListener("change", async () => {
    const file = elements.importFile.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const restored = normalizeBoard(parsed);
      if (!sheetSync?.isConnected()) {
        showToast("Nejdřív připoj Google Sheets, potom obnov zálohu.");
        return;
      }
      if (!window.confirm("Nahradit současnou tabuli obsahem této zálohy?")) return;
      state = restored;
      editingItem = null;
      saveBoard();
      render();
      showToast("Záloha byla obnovena.");
    } catch (error) {
      showToast(error.message === "Tato záloha neobsahuje platnou tabuli." ? error.message : "Zálohu se nepodařilo načíst. Vyber platný JSON soubor tabule.");
    } finally {
      elements.importFile.value = "";
    }
  });
})();
