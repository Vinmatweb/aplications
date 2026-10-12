(() => {
  "use strict";

  const STORAGE_KEY = "vinmat-ideas-and-priorities-v1";
  const DATA_VERSION = 1;
  const seededBoard = {
    version: DATA_VERSION,
    priorities: [
      { id: "starter-coloring-pack", text: "Finish the Halloween coloring pack", importance: "high" },
      { id: "starter-tracing-pack", text: "Finish the Halloween tracing pages", importance: "medium" }
    ],
    ideas: []
  };

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
    importFile: document.getElementById("import-file")
  };

  let state = loadBoard();
  let draggedItem = null;
  let editingItem = null;
  let toastTimer = null;
  let activeRecognition = null;

  render();
  setupVoiceInput();

  function makeId() {
    return globalThis.crypto?.randomUUID?.() || `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function loadBoard() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return structuredClone(seededBoard);
      return normalizeBoard(JSON.parse(saved));
    } catch {
      return structuredClone(seededBoard);
    }
  }

  function normalizeBoard(value) {
    if (!value || !Array.isArray(value.priorities) || !Array.isArray(value.ideas)) {
      throw new Error("This backup does not contain a valid board.");
    }
    const cleanItems = items => items
      .filter(item => item && typeof item.text === "string" && item.text.trim())
      .map(item => ({
        id: typeof item.id === "string" && item.id ? item.id : makeId(),
        text: item.text.trim().slice(0, 180),
        ...(items === value.priorities ? { importance: ["high", "medium", "low"].includes(item.importance) ? item.importance : "medium" } : {})
      }));
    return {
      version: DATA_VERSION,
      priorities: cleanItems(value.priorities),
      ideas: cleanItems(value.ideas)
    };
  }

  function saveBoard(showSaved = true) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (showSaved) {
        const time = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date());
        elements.saveStatus.textContent = `Saved at ${time}`;
      }
    } catch {
      elements.saveStatus.textContent = "Could not save in this browser";
      showToast("Your browser could not save this board. Export a backup to keep your changes.");
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
    elements.summaryText.textContent = `${state.priorities.length} ${pluralize(state.priorities.length, "priority", "priorities")} · ${state.ideas.length} ${pluralize(state.ideas.length, "idea", "ideas")}`;
  }

  function renderTask(item, listName, index) {
    const isPriority = listName === "priorities";
    const editing = editingItem?.id === item.id && editingItem?.list === listName;
    const safeText = escapeHTML(item.text);
    const importance = item.importance || "medium";
    const dragLabel = isPriority ? `Drag priority ${index + 1}` : `Drag idea ${index + 1}`;
    const moveLabel = isPriority ? "priority" : "idea";

    return `<li class="task-card ${isPriority ? "priority-card" : "idea-card"}" data-task-card data-item-id="${escapeHTML(item.id)}" data-list-name="${listName}">
      <span class="task-rank ${isPriority ? "" : "idea-rank"}" aria-label="${isPriority ? `Priority ${index + 1}` : `Idea ${index + 1}`} ">${isPriority ? index + 1 : "✳"}</span>
      <button class="drag-handle" type="button" draggable="true" aria-label="${dragLabel}" title="Drag to move">
        <svg viewBox="0 0 16 20" aria-hidden="true"><circle cx="5" cy="4" r="1.3"/><circle cx="11" cy="4" r="1.3"/><circle cx="5" cy="10" r="1.3"/><circle cx="11" cy="10" r="1.3"/><circle cx="5" cy="16" r="1.3"/><circle cx="11" cy="16" r="1.3"/></svg>
      </button>
      <div class="task-content">
        ${editing ? `<form class="edit-form" data-edit-form data-list="${listName}" data-id="${escapeHTML(item.id)}">
          <label class="sr-only" for="edit-${escapeHTML(item.id)}">Edit task</label>
          <input id="edit-${escapeHTML(item.id)}" class="edit-input" name="task" maxlength="180" value="${safeText}" required>
          <button class="text-action save-edit" type="submit">Save</button>
          <button class="text-action cancel-edit" type="button" data-action="cancel-edit">Cancel</button>
        </form>` : `<div class="task-title-row"><span class="task-title">${safeText}</span><button class="text-action edit-action" type="button" data-action="edit" aria-label="Edit ${safeText}">Edit</button></div>
          ${isPriority ? `<label class="importance-wrap"><span class="importance-label">IMPORTANCE</span><select class="importance-select importance-${importance}" data-action="importance" aria-label="Importance for ${safeText}">
            <option value="high" ${importance === "high" ? "selected" : ""}>High</option>
            <option value="medium" ${importance === "medium" ? "selected" : ""}>Medium</option>
            <option value="low" ${importance === "low" ? "selected" : ""}>Low</option>
          </select></label>` : ""}`}
      </div>
      <div class="task-actions" aria-label="${isPriority ? "Priority" : "Idea"} actions">
        <button class="icon-button move-up" type="button" data-action="move-up" aria-label="Move ${moveLabel} up" title="Move up" ${index === 0 ? "disabled" : ""}>↑</button>
        <button class="icon-button move-down" type="button" data-action="move-down" aria-label="Move ${moveLabel} down" title="Move down" ${index === (isPriority ? state.priorities : state.ideas).length - 1 ? "disabled" : ""}>↓</button>
        ${isPriority
          ? `<button class="text-action demote-action" type="button" data-action="demote" title="Move back to ideas">To ideas</button>`
          : `<button class="text-action promote-action" type="button" data-action="promote" title="Make this a priority"><span aria-hidden="true">↗</span> Prioritize</button>`}
        <button class="icon-button delete-action" type="button" data-action="delete" aria-label="Delete ${safeText}" title="Delete">×</button>
      </div>
    </li>`;
  }

  function pluralize(count, singular, plural) {
    return count === 1 ? singular : plural;
  }

  function addTask(listName, text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (listName === "priorities") {
      state.priorities.push({ id: makeId(), text: trimmed, importance: "medium" });
    } else {
      state.ideas.push({ id: makeId(), text: trimmed });
    }
    saveBoard();
    render();
  }

  function findItem(listName, id) {
    return state[listName]?.find(item => item.id === id);
  }

  function handleAction(event) {
    const actionButton = event.target.closest("[data-action]");
    const card = event.target.closest("[data-task-card]");
    if (!actionButton || !card) return;
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
        showToast("Item removed.");
        break;
      case "move-up":
      case "move-down": {
        const nextIndex = index + (actionButton.dataset.action === "move-up" ? -1 : 1);
        if (nextIndex < 0 || nextIndex >= list.length) return;
        [list[index], list[nextIndex]] = [list[nextIndex], list[index]];
        saveBoard();
        render();
        showToast(`Moved to position ${nextIndex + 1}.`);
        break;
      }
      case "promote":
        state.ideas.splice(index, 1);
        state.priorities.push({ id: item.id, text: item.text, importance: "medium" });
        editingItem = null;
        saveBoard();
        render();
        showToast("Added to priorities as Medium.");
        break;
      case "demote":
        state.priorities.splice(index, 1);
        state.ideas.push({ id: item.id, text: item.text });
        editingItem = null;
        saveBoard();
        render();
        showToast("Moved back to ideas.");
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
    showToast(fromListName === toListName ? `Moved to position ${targetIndex + 1}.` : toListName === "priorities" ? "Added to priorities as Medium." : "Moved back to ideas.");
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => elements.toast.classList.remove("is-visible"), 2300);
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
        showToast("Listening… Speak your idea in Czech.");
        recognition.onresult = event => {
          const transcript = event.results?.[0]?.[0]?.transcript?.trim();
          if (transcript) {
            input.value = `${input.value.trim()}${input.value.trim() ? " " : ""}${transcript}`;
            input.focus();
          }
        };
        recognition.onerror = event => {
          if (event.error !== "no-speech" && event.error !== "aborted") showToast("Voice input is unavailable. You can type your item instead.");
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
    if (!form) return;
    event.preventDefault();
    const item = findItem(form.dataset.list, form.dataset.id);
    const text = new FormData(form).get("task")?.toString().trim();
    if (!item || !text) return;
    item.text = text.slice(0, 180);
    editingItem = null;
    saveBoard();
    render();
    showToast("Item updated.");
  });

  elements.board.addEventListener("change", event => {
    if (event.target.matches("[data-action='importance']")) handleAction(event);
  });

  elements.board.addEventListener("dragstart", event => {
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
    const backup = { ...state, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vinmat-ideas-and-priorities-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Board backup downloaded.");
  });

  elements.importButton.addEventListener("click", () => elements.importFile.click());
  elements.importFile.addEventListener("change", async () => {
    const file = elements.importFile.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const restored = normalizeBoard(parsed);
      if (!window.confirm("Replace the current board with this backup?")) return;
      state = restored;
      editingItem = null;
      saveBoard();
      render();
      showToast("Backup restored.");
    } catch (error) {
      showToast(error.message === "This backup does not contain a valid board." ? error.message : "Could not read that backup. Choose a valid board JSON file.");
    } finally {
      elements.importFile.value = "";
    }
  });
})();
