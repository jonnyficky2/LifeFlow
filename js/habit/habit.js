import { state } from "../core/state.js";
import { saveToLocal } from "../core/storage.js";
import { openHabitModal, closeHabitModal } from "../ui/modal.js";
import { addXP, updateHabitStats, refreshStatsUI } from "../stats/stats.js";
import { celebrate, showToast } from "../core/utils.js";

export let editingHabit = null;
let dragged = null;

export function isHabitToday(habit){
  const now = new Date();
  const day = now.getDay();
  const date = now.getDate();

  if(habit.repeatType === "daily"){
    return true;
  }

  if(habit.repeatType === "weekly" || habit.repeatType === "custom" || habit.repeatType === "certain_days"){
    if (!habit.repeatDays || habit.repeatDays.length === 0) return true;
    return habit.repeatDays.includes(day);
  }

  if(habit.repeatType === "monthly"){
    if (!habit.repeatDate) return true;
    if (habit.repeatDate.includes("-")) {
      const dayPart = parseInt(habit.repeatDate.split("-")[2], 10);
      return dayPart === date;
    }
    return Number(habit.repeatDate) === date;
  }

  return true;
}

export function renderHabits() {
  const container =
    document.getElementById(
      "habitContainer"
    );

  if(!container) return;

  // Performance: Use DocumentFragment for batch DOM updates
  const fragment = document.createDocumentFragment();

  state.habits.forEach(
    (category,catIndex)=>{

    const categoryDiv =
      document.createElement("div");

    categoryDiv.className =
      "category";

    const header =
      document.createElement("div");

    header.className =
      "category-header";

    const title =
      document.createElement("h2");

    title.innerText =
      category.category;

    header.appendChild(title);
    const actions =
  document.createElement("div");

/* EDIT CATEGORY */

const editBtn =
  document.createElement("button");

editBtn.innerText = "✏️";

editBtn.onclick = ()=>{

  const newName =
    prompt(
      "Edit habit category:",
      category.category
    );

  if(!newName) return;

  category.category = newName;

  saveToLocal();

  renderHabits();
};

/* DELETE CATEGORY */

const delBtn =
  document.createElement("button");

delBtn.innerText = "🗑";

delBtn.onclick = ()=>{

  if(
    !confirm(
      "Delete habit category?"
    )
  ) return;

  state.habits.splice(
    catIndex,
    1
  );

  saveToLocal();

  renderHabits();
};

actions.append(
  editBtn,
  delBtn
);

header.appendChild(actions);
  const addBtn =
  document.createElement("button");

addBtn.innerText =
  "+ Habit";

addBtn.onclick = ()=>{

  state.currentHabitCategoryIndex =
    catIndex;

  editingHabit = null;
  document.getElementById("habitInput").value = "";
  document.getElementById("habitRepeatInput").value = "daily";
  document.querySelectorAll("#habitDaysBox input").forEach(el => el.checked = false);
  document.getElementById("habitDateInput").value = "";
  document.getElementById("habitTimeInput").value = "";
  toggleRepeatOptions();

  openHabitModal();
};

header.appendChild(addBtn);


    categoryDiv.appendChild(
      header
    );

    category.habits.forEach(
      (habit,habitIndex)=>{
        if(!isHabitToday(habit))
  return;

      const card =
        document.createElement("div");

      card.className =
        `task ${
          habit.done
          ? "done"
          : ""
        }`;

      const left =
        document.createElement("div");

      left.className =
        "task-left";

      const checkbox =
        document.createElement("input");

      checkbox.type =
        "checkbox";

      checkbox.checked =
        habit.done;

      checkbox.onchange = ()=>{

        toggleHabit(
          catIndex,
          habitIndex
        );
      };

      const wrapper =
        document.createElement("div");

      const titleWrapper = document.createElement("div");
      titleWrapper.style.display = "flex";
      titleWrapper.style.alignItems = "center";
      titleWrapper.style.gap = "8px";

      const text =
        document.createElement("span");

      text.innerText =
        habit.name;

      titleWrapper.appendChild(text);

      if (habit.time) {
        const timeBadge = document.createElement("span");
        timeBadge.className = "task-time-badge";
        timeBadge.innerText = `⏰ ${habit.time}`;
        titleWrapper.appendChild(timeBadge);
      }

      const info =
        document.createElement("small");

      let repeatText =
  habit.repeatType;

if(habit.repeatType === "custom" || habit.repeatType === "certain_days" || habit.repeatType === "weekly"){
  const names = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  if (habit.repeatDays && habit.repeatDays.length > 0) {
    repeatText = habit.repeatDays.map(day=>names[day]).join(", ");
  } else {
    repeatText = "Everyday";
  }
}

if(habit.repeatType === "monthly"){
  let dateStr = habit.repeatDate;
  if (dateStr && dateStr.includes("-")) {
    dateStr = dateStr.split("-")[2];
  }
  repeatText = `Date ${dateStr || 'specific'}`;
}

info.innerText =
  `${repeatText} • 🔥 ${habit.streak}`;

      wrapper.append(
        titleWrapper,
        info
      );

      left.append(
        checkbox,
        wrapper
      );

      card.appendChild(left);
      const right =
  document.createElement("div");
  card.draggable = true;
  card.addEventListener(
  "dragstart",
  ()=>{

    dragged = {
      type:"habit",
      catIndex,
      habitIndex
    };

    card.classList.add(
      "dragging"
    );
  }
);

card.addEventListener(
  "dragend",
  ()=>{

    card.classList.remove(
      "dragging"
    );
  }
);

card.addEventListener(
  "dragover",
  (e)=>{

    e.preventDefault();
  }
);

card.addEventListener(
  "drop",
  ()=>{

    if(
      !dragged ||
      dragged.type !== "habit"
    ) return;

    const from =
      state.habits[
        dragged.catIndex
      ];

    const moved =
      from.habits.splice(
        dragged.habitIndex,
        1
      )[0];

    state.habits[
      catIndex
    ].habits.splice(
      habitIndex,
      0,
      moved
    );

    saveToLocal();

    renderHabits();
  }
);

const edit =
  document.createElement("button");

edit.innerText = "✏️";

edit.onclick = ()=>{
  editingHabit = { catIndex, habitIndex };

  document.getElementById("habitInput").value = habit.name || "";
  document.getElementById("habitRepeatInput").value = habit.repeatType || "daily";
  
  document.querySelectorAll("#habitDaysBox input").forEach(el => {
    el.checked = false;
  });
  
  if (habit.repeatDays) {
    habit.repeatDays.forEach(day => {
      const checkbox = document.querySelector(`#habitDaysBox input[value="${day}"]`);
      if (checkbox) checkbox.checked = true;
    });
  }
  
  document.getElementById("habitDateInput").value = habit.repeatDate || "";
  document.getElementById("habitTimeInput").value = habit.time || "";

  toggleRepeatOptions();
  openHabitModal();
};

const del =
  document.createElement("button");

del.innerText = "🗑";

del.onclick = ()=>{

  category.habits.splice(
    habitIndex,
    1
  );

  saveToLocal();

  renderHabits();
};

right.append(
  edit,
  del
);

card.appendChild(right);

      categoryDiv.appendChild(
        card
      );
    });

    fragment.appendChild(
      categoryDiv
    );
  });

  container.innerHTML = "";
  container.appendChild(fragment);
}

export function toggleHabit(
  catIndex,
  habitIndex
){

  const habit =
    state.habits[
      catIndex
    ].habits[
      habitIndex
    ];

  habit.done =
    !habit.done;

const rewards = [
  5, 5, 4, 4, 3, 3, 2, 2, 1, 1
];

const reward = 3; // Static to prevent error due to getLevelData import logic, could refine further.

  if(habit.done){
    const today =
  new Date()
  .toISOString()
  .split("T")[0];

    addXP(reward);

    habit.streak++;
    habit.lastDoneDate = today;

    celebrate();

  } else {

    addXP(-reward);

    if(habit.streak > 0){

      habit.streak--;
    }
  }

  updateHabitStats();
  
  refreshStatsUI();

  saveToLocal();

  renderHabits();
}

export function addHabit() {

  const name =
    document.getElementById(
      "habitInput"
    ).value;

  const repeat =
    document.getElementById(
      "habitRepeatInput"
    ).value;

  let checkedDays = [
    ...document.querySelectorAll(
      "#habitDaysBox input:checked"
    )
  ].map(el => Number(el.value));

  if(
    (repeat === "weekly" || repeat === "custom" || repeat === "certain_days") &&
    checkedDays.length === 0
  ){
    checkedDays.push(
      new Date().getDay()
    );
  }

  const repeatDate =
    document.getElementById(
      "habitDateInput"
    ).value;

  const time =
    document.getElementById(
      "habitTimeInput"
    ).value;

  if(!name.trim()) {
    showToast("Habit name cannot be empty!", 'warning');
    return;
  }

  // FIX
  if(
    state.currentHabitCategoryIndex === null ||
    !state.habits[
      state.currentHabitCategoryIndex
    ] // Check if category exists
  ){
    showToast("Select a habit category first");
    return;
  }

  const category =
    state.habits[
      state.currentHabitCategoryIndex
    ];

  if(editingHabit){

    const habit =
      state.habits[
        editingHabit.catIndex
      ].habits[
        editingHabit.habitIndex
      ];

    habit.name = name;
    habit.repeatType = repeat;
    habit.repeatDays = checkedDays;
    habit.repeatDate = repeatDate;
    habit.time = time;

    editingHabit = null;

  }else{

    category.habits.push({

      id: Date.now(),

      name,

      repeatType: repeat,

      repeatDays: checkedDays,

      repeatDate,

      time,

      streak: 0,

      done: false,

      createdAt: Date.now()
    });
  }
  
  updateHabitStats();
  saveToLocal();

  renderHabits();
  refreshStatsUI();

  // Beri notifikasi ke user jika habit dijadwalkan, tapi bukan untuk hari ini
  const addedHabit = category.habits[category.habits.length - 1];
  if (!isHabitToday(addedHabit)) {
    showToast("Saved! This habit will appear on its scheduled day.", 'info');
  } else {
    showToast("Habit added successfully!");
  }

  // reset form
  document.getElementById(
    "habitInput"
  ).value = "";

  document.getElementById(
    "habitTimeInput"
  ).value = "";

  document.getElementById(
    "habitDateInput"
  ).value = "";

  document.querySelectorAll(
    "#habitDaysBox input"
  ).forEach(el=>{

    el.checked = false;
  });

  closeHabitModal();
}

export function toggleRepeatOptions(){
  const repeat = document.getElementById("habitRepeatInput").value;
  const daysBox = document.getElementById("habitDaysBox");
  const dateBox = document.getElementById("habitDateBox");

  daysBox.style.display =
    (repeat === "custom" || repeat === "certain_days" || repeat === "weekly") ? "block" : "none";

  dateBox.style.display =
    repeat === "monthly" ? "block" : "none";
}

export function addHabitCategory(){

  const input =
    document.getElementById(
      "habitCategoryInput"
    );

  if(!input.value.trim()) return;

  state.habits.push({
    category: input.value,
    habits: []
  });

  input.value = "";

  saveToLocal();

  renderHabits();
}