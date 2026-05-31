function openTaskModal() {

  document
    .getElementById(
      "taskModal"
    )
    .classList.add("show");
}

function closeTaskModal() {

  document
    .getElementById(
      "taskModal"
    )
    .classList.remove("show");
    editingTask = null;
}

function openHabitModal(){

  document
    .getElementById(
      "habitModal"
    )
    .classList.add("show");
}

function closeHabitModal(){

  document
    .getElementById(
      "habitModal"
    )
    .classList.remove("show");
}

function openCalendarModal() {

  const task =
    state.appData[
      calendarSelected.catIndex
    ].tasks[
      calendarSelected.taskIndex
    ];

  editingTask = {
    catIndex:
      calendarSelected.catIndex,

    taskIndex:
      calendarSelected.taskIndex
  };

  document.getElementById(
    "taskNameInput"
  ).value = task.name || "";

  document.getElementById(
    "taskDeadlineInput"
  ).value = task.deadline || "";

  document.getElementById(
    "taskTimeInput"
  ).value = task.time || "";

  document.getElementById(
    "taskLocationInput"
  ).value = task.location || "";

  document.getElementById(
    "taskNoteInput"
  ).value = task.note || "";

  document.getElementById(
    "taskPriorityInput"
  ).value = task.priority || "low";

  openTaskModal();
}

function toggleRepeatOptions(){

  const repeat =
    document.getElementById(
      "habitRepeatInput"
    ).value;

  const daysBox =
    document.getElementById(
      "habitDaysBox"
    );

  const dateBox =
    document.getElementById(
      "habitDateBox"
    );

  daysBox.style.display =
    repeat === "custom"
    ? "block"
    : "none";

  dateBox.style.display =
    repeat === "monthly"
    ? "block"
    : "none";
}