import { state } from "../core/state.js";
import { getLocalDate } from "../core/utils.js";
import { editTask } from "./task.js";

export let selectedCalendarDate = null;

export function renderCalendar() {
  const grid = document.getElementById("calendarGrid");
  const monthText = document.getElementById("calendarMonth");

  if (!grid || !monthText) return;

  grid.innerHTML = "";

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const year = state.currentDate.getFullYear();
  const month = state.currentDate.getMonth();

  monthText.innerText = `${months[month]} ${year}`;

  days.forEach(day => {
    const dayName = document.createElement("div");
    dayName.className = "calendar-day-name";
    dayName.innerText = day;
    grid.appendChild(dayName);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    grid.appendChild(empty);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dayBox = document.createElement("div");
    dayBox.className = "calendar-day";
    const today = new Date();

    if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      dayBox.classList.add("today");
    }

    const dateText = document.createElement("strong");
    dateText.innerText = day;
    dayBox.appendChild(dateText);

    state.appData.forEach((category, catIndex) => {
      category.tasks.forEach((task, taskIndex) => {
        if (!task.deadline) return;
        const taskDate = new Date(task.deadline + "T00:00:00");
        if (taskDate.getDate() === day && taskDate.getMonth() === month && taskDate.getFullYear() === year) {
          const taskEl = document.createElement("div");
          taskEl.className = "calendar-task";
          if (task.done) {
            taskEl.classList.add("done-task");
          }
          taskEl.innerText = `📌 ${task.name}`;
          dayBox.appendChild(taskEl);
        }
      });
    });

    dayBox.addEventListener("click", () => {
      openDayTasks(year, month, day);
    });
    grid.appendChild(dayBox);
  }
}

export function openDayTasks(year, month, day) {
  const selectedDate = getLocalDate(new Date(year, month, day));
  selectedCalendarDate = selectedDate;

  document.getElementById("selectedDateTitle").innerText = `${day}/${month+1}/${year}`;
  const list = document.getElementById("dayTaskList");
  list.innerHTML = "";
  let found = false;

  state.appData.forEach((category, catIndex) => {
    category.tasks.forEach((task, taskIndex) => {
      if (task.deadline === selectedDate) {
        found = true;
        const item = document.createElement("div");
        item.className = "calendar-task-item";
        item.innerHTML = `
          <strong>${task.name}</strong>
          <small>📂 ${category.name}</small>
          ${task.time ? `<small>⏰ ${task.time}</small>` : ""}
          ${task.location ? `<small>📍 ${task.location}</small>` : ""}
          ${task.note ? `<small>📝 ${task.note}</small>` : ""}
        `;

        item.onclick = () => {
          editTask(catIndex, taskIndex);
          document.getElementById("dayTasksModal").classList.remove("show");
        };
        list.appendChild(item);
      }
    });
  });

  if (!found) {
    list.innerHTML = "<p>Tidak ada task</p>";
  }
  document.getElementById("dayTasksModal").classList.add("show");
}

export function changeMonth(step) {
  state.currentDate.setMonth(state.currentDate.getMonth() + step);
  renderCalendar();
}