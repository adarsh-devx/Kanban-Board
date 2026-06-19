// State and DOM elements
let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

const columns = [todo, progress, done];
let dragElement = null;

// Helper to update localStorage and counts for all columns
function updateLocalStorageAndCounts() {
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const countEl = col.querySelector(".right");

    tasksData[col.id] = Array.from(tasks).map((t) => {
      return {
        tittle: t.querySelector("h2").innerText,
        desc: t.querySelector("p").innerText,
      };
    });

    if (countEl) {
      countEl.innerText = tasks.length;
    }
  });

  localStorage.setItem("task", JSON.stringify(tasksData));
}

// Function to add a task to a column (with full functionality)
function addTask(tittle, desc, column) {
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");
  div.innerHTML = `
    <h2>${tittle || "Untitled Task"}</h2>
    <p>${desc || ""}</p>
    <button class="delete-btn">Delete</button>
  `;

  column.appendChild(div);

  // Drag events
  div.addEventListener("dragstart", () => {
    dragElement = div;
  });

  div.addEventListener("drag", () => {
    dragElement = div;
  });

  // Delete task event
  const deleteBtn = div.querySelector("button");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      div.remove();
      updateLocalStorageAndCounts();
    });
  }

  return div;
}

// Load tasks from localStorage on startup
if (localStorage.getItem("task")) {
  const data = JSON.parse(localStorage.getItem("task"));

  for (const colId in data) {
    const column = document.querySelector(`#${colId}`);
    if (column) {
      data[colId].forEach((task) => {
        // Handle loading old keys safely (tittle/desc)
        const tittle = task.tittle || task.title || "";
        const desc = task.desc || task.description || "";
        addTask(tittle, desc, column);
      });
    }
  }
}

// Bind drag events and delete events to pre-existing static tasks in HTML (if any)
document.querySelectorAll(".task").forEach((taskEl) => {
  taskEl.addEventListener("dragstart", () => {
    dragElement = taskEl;
  });
  taskEl.addEventListener("drag", () => {
    dragElement = taskEl;
  });
  const deleteBtn = taskEl.querySelector("button");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      taskEl.remove();
      updateLocalStorageAndCounts();
    });
  }
});

// Sync counts on load
updateLocalStorageAndCounts();

// Add Drag & Drop events to columns
function addDragEventsOnColumn(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    if (dragElement) {
      column.appendChild(dragElement);
      column.classList.remove("hover-over");
      updateLocalStorageAndCounts();
    }
  });
}

columns.forEach(addDragEventsOnColumn);

// Modal logic
const toggleModalBtn = document.querySelector("#toggle-modal");
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".modal .bg");
const addTaskBtn = document.querySelector("#add-new-task");
const taskTitleInput = document.querySelector("#task-tittle-input");
const taskDescInput = document.querySelector("#task-desc-input");

toggleModalBtn.addEventListener("click", () => {
  modal.classList.add("active");
});

const closeModal = () => {
  modal.classList.remove("active");
  if (taskTitleInput) taskTitleInput.value = "";
  if (taskDescInput) taskDescInput.value = "";
};

modalBg.addEventListener("click", closeModal);

addTaskBtn.addEventListener("click", () => {
  const title = taskTitleInput ? taskTitleInput.value.trim() : "";
  const desc = taskDescInput ? taskDescInput.value.trim() : "";

  if (title === "") {
    alert("Please enter a task title!");
    return;
  }

  addTask(title, desc, todo);
  updateLocalStorageAndCounts();
  closeModal();
});
