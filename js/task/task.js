import { state } from "../core/state.js";
import { saveToLocal, saveState } from "../core/storage.js";
import { getToday, celebrate } from "../core/utils.js";
import { addXP, updateStreak, updateDailyHistory } from "../stats/stats.js";
import { openTaskModal, closeTaskModal } from "../ui/modal.js";
import { refreshUI } from "../main.js";

export let editingTask = null;
let dragged = null;

export function resetEditingTask() {
  editingTask = null;
}

export function saveTaskModal() {
  const name = document.getElementById("taskNameInput").value;
  const deadline = document.getElementById("taskDeadlineInput").value;
  const time = document.getElementById("taskTimeInput").value;
  const location = document.getElementById("taskLocationInput").value;
  const note = document.getElementById("taskNoteInput").value;
  const priority = document.getElementById("taskPriorityInput").value;

  if (!name.trim()) return;

  saveState();

  if(editingTask){
    const task = state.appData[editingTask.catIndex].tasks[editingTask.taskIndex];
    task.name = name;
    task.deadline = deadline;
    task.time = time;
    task.location = location;
    task.note = note;
    task.priority = priority;
    editingTask = null;
  } else {
    state.appData[state.currentCategoryIndex].tasks.push({
      name, deadline, time, location, note, priority,
      done: false, completedDates: [], streak: 0, lastCompleted: null
    });
  }

  saveToLocal();
  refreshUI();

  // RESET FORM
  document.getElementById("taskNameInput").value = "";
  document.getElementById("taskDeadlineInput").value = "";
  document.getElementById("taskTimeInput").value = "";
  document.getElementById("taskLocationInput").value = "";
  document.getElementById("taskNoteInput").value = "";
  document.getElementById("taskPriorityInput").value = "low";

  closeTaskModal();
}

export function toggleTask(catIndex, taskIndex) {
  saveState();
  const task = state.appData[catIndex].tasks[taskIndex];
  const today = getToday();

  task.done = !task.done;
  const reward = 3;

  if(task.done){
    if(!task.completedDates.includes(today)){
      task.completedDates.push(today);
      updateTaskStreak(task);
    }
    addXP(reward);
    celebrate();
    updateStreak();
  } else {
    addXP(-reward);
    task.completedDates = task.completedDates.filter(date => date !== today);
  }

  updateDailyHistory();
  saveToLocal();
  refreshUI();
}

export function renderTasks() {
  const container = document.getElementById("container");
  if(!container) return;
  
  container.innerHTML = "";

  state.appData.forEach((category, catIndex) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "category";

    /* HEADER */
    const header = document.createElement("div");
    header.className = "category-header";

    const title = document.createElement("h2");
    title.innerText = category.name;

    const actions = document.createElement("div");
    const editBtn = document.createElement("button");
    editBtn.innerText = "✏️";
    editBtn.onclick = () => editCategory(catIndex);

    const delBtn = document.createElement("button");
    delBtn.innerText = "🗑";
    delBtn.onclick = () => deleteCategory(catIndex);

    actions.append(editBtn, delBtn);
    header.append(title, actions);

    /* TASK LIST */
    const taskList = document.createElement("div");

    category.tasks.forEach((task, taskIndex) => {
      if (!filterTask(task)) return;

      const taskDiv = document.createElement("div");
      taskDiv.className = `task ${task.done ? "done" : ""} ${task.priority || "low"}-priority`;
        
      /* DRAG */
      taskDiv.draggable = true;
      taskDiv.addEventListener("dragstart", () => {
        dragged = { catIndex, taskIndex };
        taskDiv.classList.add("dragging");
      });
      taskDiv.addEventListener("dragend", () => {
        taskDiv.classList.remove("dragging");
      });
      taskDiv.addEventListener("dragover", (e) => {
        e.preventDefault();
      });
      taskDiv.addEventListener("drop", () => {
        if (!dragged) return;
        saveState();

        const fromCategory = state.appData[dragged.catIndex];
        const movedTask = fromCategory.tasks.splice(dragged.taskIndex, 1)[0];

        let insertIndex = taskIndex;
        if(dragged.catIndex === catIndex && dragged.taskIndex < taskIndex) {
          insertIndex--;
        }

        const targetTasks = state.appData[catIndex].tasks;
        targetTasks.splice(insertIndex, 0, movedTask);

        saveToLocal();
        dragged = null;
        refreshUI();
      });

      /* LEFT */
      const left = document.createElement("div");
      left.className = "task-left";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.onchange = () => toggleTask(catIndex, taskIndex);

      const textWrapper = document.createElement("div");
      const text = document.createElement("span");
      text.innerText = task.name;
      textWrapper.appendChild(text);

      /* DEADLINE */
      if(task.deadline){
        const deadlineText = document.createElement("div");
        deadlineText.className = "deadline-warning";

        const today = new Date();
        const deadline = new Date(task.deadline);
        const diff = Math.ceil((deadline - today) / (1000*60*60*24));

        if(diff < 0){
          deadlineText.classList.add("overdue");
          deadlineText.innerText = "⚠️ Deadline passed";
        } else if(diff === 0){
          deadlineText.innerText = "⏰ Deadline today";
        } else {
          deadlineText.innerText = `📅 ${diff} days left`;
        }
        textWrapper.appendChild(deadlineText);
      }

      left.append(checkbox, textWrapper);

      /* RIGHT */
      const right = document.createElement("div");
      right.className = "task-right";

      const edit = document.createElement("button");
      edit.innerText = "✏️";
      edit.onclick = () => editTask(catIndex, taskIndex);

      const del = document.createElement("button");
      del.innerText = "🗑";
      del.onclick = () => deleteTask(catIndex, taskIndex);

      right.append(edit, del);
      taskDiv.append(left, right);
      taskList.appendChild(taskDiv);
    });

    /* ADD TASK */
    const addTaskBtn = document.createElement("button");
    addTaskBtn.innerText = "+ Add Task";
    addTaskBtn.onclick = () => {
      state.currentCategoryIndex = catIndex;
      openTaskModal();
    };

    categoryDiv.append(header, taskList, addTaskBtn);
    container.appendChild(categoryDiv);
  });
}

export function filterTask(task){
  const matchFilter = 
    (state.currentFilter === "all") ||
    (state.currentFilter === "done" && task.done) ||
    (state.currentFilter === "pending" && !task.done);

  const keyword = state.searchValue;
  const matchSearch =
    !keyword ||
    ((task.name || "").toLowerCase().includes(keyword) ||
     (task.note || "").toLowerCase().includes(keyword) ||
     (task.location || "").toLowerCase().includes(keyword));

  return (matchFilter && matchSearch);
}

export function searchTask() {
  state.searchValue = document.getElementById("searchInput").value.toLowerCase();
  refreshUI();
}

export function setFilter(filter) {
  state.currentFilter = filter;
  refreshUI();
}

export function updateTaskStreak(task){
  const dates = [...task.completedDates].sort();
  if(dates.length === 0){
    task.streak = 0;
    return;
  }
  let streak = 1;
  for(let i = dates.length - 1; i > 0; i--){
    const current = new Date(dates[i]);
    const prev = new Date(dates[i - 1]);
    const diff = (current - prev) / (1000 * 60 * 60 * 24);
    if(diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  task.streak = streak;
  task.lastCompleted = getToday();
}

export function editTask(catIndex, taskIndex) {
  const task = state.appData[catIndex].tasks[taskIndex];
  editingTask = { catIndex, taskIndex };

  document.getElementById("taskNameInput").value = task.name || "";
  document.getElementById("taskDeadlineInput").value = task.deadline || "";
  document.getElementById("taskTimeInput").value = task.time || "";
  document.getElementById("taskLocationInput").value = task.location || "";
  document.getElementById("taskNoteInput").value = task.note || "";
  document.getElementById("taskPriorityInput").value = task.priority || "low";

  openTaskModal();
}

export function deleteTask(catIndex, taskIndex) {
  if (!confirm("Delete task?")) return;
  saveState();
  state.appData[catIndex].tasks.splice(taskIndex, 1);
  saveToLocal();
  refreshUI();
}

export function addCategory() {
  const input = document.getElementById("categoryInput");
  if (!input.value.trim()) return;
  saveState();
  state.appData.push({ name: input.value, tasks: [] });
  input.value = "";
  saveToLocal();
  refreshUI();
}

export function editCategory(index) {
  const newName = prompt("Edit category:", state.appData[index].name);
  if (!newName) return;
  state.appData[index].name = newName;
  saveToLocal();
  refreshUI();
}

export function deleteCategory(index) {
  if (!confirm("Delete category?")) return;
  saveState();
  state.appData.splice(index, 1);
  saveToLocal();
  refreshUI();
}