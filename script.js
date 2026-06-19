// Saare DOM elements aur dynamic data store krne ke liye variables
let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

const columns = [todo, progress, done];
let dragElement = null;

// Har column ke cards count krne aur local storage update krne ke liye helper
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

// Kisi bhi column me task add krne ka main function (isme drag-drop aur delete feature bhi shamil h)
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

  // Jab task card ko drag (khichna) shuru kren
  div.addEventListener("dragstart", () => {
    dragElement = div;
  });

  div.addEventListener("drag", () => {
    dragElement = div;
  });

  // Delete button dabane pr card remove krne ka event
  const deleteBtn = div.querySelector("button");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      div.remove();
      updateLocalStorageAndCounts();
    });
  }

  return div;
}

// Page load hote hi localStorage se saare purane tasks nikal kr render krna
if (localStorage.getItem("task")) {
  const data = JSON.parse(localStorage.getItem("task"));

  for (const colId in data) {
    const column = document.querySelector(`#${colId}`);
    if (column) {
      data[colId].forEach((task) => {
        // Agar data purane format (title ya description) me ho to crash hone se bachaye
        const tittle = task.tittle || task.title || "";
        const desc = task.desc || task.description || "";
        addTask(tittle, desc, column);
      });
    }
  }
}

// Pehle se bane hue tasks (static) ke liye drag/delete event setup krna
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

// Initial load pr columns ke task counts sync krne ke liye
updateLocalStorageAndCounts();

// Columns ke upar drag enter, leave, over aur drop event configure krna
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

// Naya task add krne waale modal window (popup) ki settings
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
