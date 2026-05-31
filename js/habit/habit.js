import { state } from "../core/state.js";
import { saveToLocal } from "../core/storage.js";
import { openHabitModal, closeHabitModal } from "../ui/modal.js";
import { addXP, updateHabitStats, refreshStatsUI } from "../stats/stats.js";
import { celebrate } from "../core/utils.js";

export let editingHabit = null;
let dragged = null;

export function isHabitToday(habit){
  const now = new Date();
  const day = now.getDay();
  const date = now.getDate();

  if(habit.repeatType === "daily"){
    return true;
  }

  if(habit.repeatType === "weekly"){
    return habit.repeatDays.includes(day);
  }

  if(habit.repeatType === "monthly"){
    return Number(habit.repeatDate) === date;
  }

  if(habit.repeatType === "custom"){
    return habit.repeatDays.includes(day);
  }

  return true;
}

export function renderHabits() {
  const container =
    document.getElementById(
      "habitContainer"
    );

  if(!container) return;

  container.innerHTML = "";

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
      "Edit category habit:",
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
      "Hapus category habit?"
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

      const text =
        document.createElement("span");

      text.innerText =
        habit.name;

      const info =
        document.createElement("small");

      let repeatText =
  habit.repeatType;

if(habit.repeatType === "custom"){

  const names = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  repeatText =
    habit.repeatDays
    .map(day=>names[day])
    .join(", ");
}

if(habit.repeatType === "monthly"){

  repeatText =
    `Tgl ${habit.repeatDate}`;
}

info.innerText =
  `${repeatText} • 🔥 ${habit.streak}`;

      wrapper.append(
        text,
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

  const newName =
    prompt(
      "Edit habit:",
      habit.name
    );

  if(!newName) return;

  habit.name = newName;

  saveToLocal();

  renderHabits();
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

    container.appendChild(
      categoryDiv
    );
  });
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
    repeat === "weekly" &&
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

  if(!name.trim()) return;

  // FIX
  if(
    state.currentHabitCategoryIndex === null ||
    !state.habits[
      state.currentHabitCategoryIndex
    ]
  ){
    alert("Pilih category habit dulu");
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
    repeat === "custom" ? "block" : "none";

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