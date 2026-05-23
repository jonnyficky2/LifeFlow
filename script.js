let calendarSelected = {
  catIndex: null,
  taskIndex: null
};
let chart = null;
let habitChart = null;
let deferredPrompt = null;
let dragged = null;
let selectedCalendarDate = null;
let editingTask = null;
let editingHabit = null;

/* =========================
   STATE
========================= */

const state = {
  appData: JSON.parse(localStorage.getItem("appData") || "[]"),

  xp: Number(localStorage.getItem("xp")) || 0,

  habits: JSON.parse(
  localStorage.getItem("habits") || "[]"
),

habitHistory: JSON.parse(
  localStorage.getItem("habitHistory") || "{}"
),

  streakData: JSON.parse(
    localStorage.getItem("streakData") || "[]"
  ),
  
  historyData: JSON.parse(
  localStorage.getItem("historyData") || "{}"
),

  undoStack: [],
  redoStack: [],

  searchValue: "",
  currentFilter: "all",

  currentDate: new Date(),

  currentCategoryIndex: null,
  currentHabitCategoryIndex:null
};

/* =========================
   ELEMENT
========================= */

const container =
  document.getElementById("container");
  
  const homeSection =
  document.getElementById("homeSection");

const calendarSection =
  document.getElementById("calendarSection");

const habitSection =
  document.getElementById("habitSection");

const statsSection =
  document.getElementById("statsSection");

/* =========================
   START
========================= */

window.addEventListener(
  "DOMContentLoaded",
  () => {
    if("Notification" in window){

  Notification.requestPermission();
}
    resetHabitsDaily();
    refreshUI();
    checkTaskReminders();
    checkDeadlines();

    loadTheme();

    showSection("home");
  }
);

function resetHabitsDaily(){

  const today =
    new Date()
    .toISOString()
    .split("T")[0];

  const lastReset =
    localStorage.getItem(
      "habitResetDate"
    );

  if(lastReset === today)
    return;

  state.habits.forEach(category=>{

    category.habits.forEach(habit=>{

      habit.done = false;
    });
  });

  localStorage.setItem(
    "habitResetDate",
    today
  );
  saveToLocal();
}

function trimHistory(){

  const keys =
    Object.keys(state.historyData);

  while(keys.length > 90){

  delete state.historyData[keys.shift()];
}
}

/* =========================
   SAVE
========================= */

function saveToLocal() {
  trimHistory();

  localStorage.setItem(
    "appData",
    JSON.stringify(state.appData)
  );

  localStorage.setItem(
    "xp",
    state.xp
  );

  localStorage.setItem(
    "habits",
    JSON.stringify(state.habits)
  );
  
  localStorage.setItem(
  "habitHistory",
  JSON.stringify(state.habitHistory)
);

  localStorage.setItem(
    "streakData",
    JSON.stringify(state.streakData)
  );
  localStorage.setItem(
  "historyData",
  JSON.stringify(state.historyData)
);
}
function saveState(){

  state.undoStack.push(
    JSON.stringify({
      appData:state.appData,
      xp:state.xp,
      habits:state.habits,
      historyData:state.historyData,
      streakData:state.streakData
    })
  );
  
  if(state.undoStack.length > 30){

  state.undoStack.shift();
}

  state.redoStack = [];
}

/* =========================
   RENDER
========================= */

function render() {

  container.innerHTML = "";

  state.appData.forEach(
    (category, catIndex) => {

      const categoryDiv =
        document.createElement("div");
        

      categoryDiv.className =
        "category";

      /* HEADER */

      const header =
        document.createElement("div");

      header.className =
        "category-header";

      const title =
        document.createElement("h2");

      title.innerText =
        category.name;

      const actions =
        document.createElement("div");

      const editBtn =
        document.createElement("button");

      editBtn.innerText = "✏️";

      editBtn.onclick = () =>
        editCategory(catIndex);

      const delBtn =
        document.createElement("button");

      delBtn.innerText = "🗑";

      delBtn.onclick = () =>
        deleteCategory(catIndex);

      actions.append(
        editBtn,
        delBtn
      );

      header.append(
        title,
        actions
      );

      /* TASK LIST */

      const taskList =
        document.createElement("div");

      category.tasks.forEach(
        (task, taskIndex) => {

          if (!filterTask(task)) return;

          const taskDiv =
            document.createElement("div");

          taskDiv.className =
            `task 
            ${task.done ? "done" : ""}
            ${task.priority || "low"}-priority`;
            
            /* DRAG */

taskDiv.draggable = true;

taskDiv.addEventListener(
  "dragstart",
  () => {

    dragged = {
      catIndex,
      taskIndex
    };

    taskDiv.classList.add(
      "dragging"
    );
  }
);

taskDiv.addEventListener(
  "dragend",
  () => {

    taskDiv.classList.remove(
      "dragging"
    );
  }
);

taskDiv.addEventListener(
  "dragover",
  (e) => {

    e.preventDefault();
  }
);

taskDiv.addEventListener(
  "drop",
  () => {

    if (!dragged) return;

    saveState();

    const fromCategory =
      state.appData[dragged.catIndex];

    const movedTask =
      fromCategory.tasks.splice(
        dragged.taskIndex,
        1
      )[0];

    // FIX INDEX
    let insertIndex = taskIndex;
    if(
  dragged.catIndex === catIndex &&
  dragged.taskIndex < taskIndex
){
  insertIndex--;
}

    const targetTasks =
  state.appData[catIndex].tasks;

targetTasks.splice(insertIndex,0,movedTask);

    saveToLocal();

    dragged = null;

    refreshUI();
  }
);

          /* LEFT */

          const left =
            document.createElement("div");

          left.className =
            "task-left";

          const checkbox =
            document.createElement("input");

          checkbox.type =
            "checkbox";

          checkbox.checked =
            task.done;

          checkbox.onchange = () =>
            toggleTask(
              catIndex,
              taskIndex
            );

          const textWrapper =
  document.createElement("div");

const text =
  document.createElement("span");

text.innerText =
  task.name;

textWrapper.appendChild(text);

/* DEADLINE */

if(task.deadline){

  const deadlineText =
    document.createElement("div");

  deadlineText.className =
    "deadline-warning";

  const today =
    new Date();

  const deadline =
    new Date(task.deadline);

  const diff =
    Math.ceil(
      (
        deadline - today
      ) / (1000*60*60*24)
    );

  if(diff < 0){

    deadlineText.classList.add(
      "overdue"
    );

    deadlineText.innerText =
      "⚠️ Deadline lewat";

  }else if(diff === 0){

    deadlineText.innerText =
      "⏰ Deadline hari ini";

  }else{

    deadlineText.innerText =
      `📅 ${diff} hari lagi`;
  }

  textWrapper.appendChild(
    deadlineText
  );
}



          left.append(
            checkbox,
            textWrapper
          );

          /* RIGHT */

          const right =
            document.createElement("div");

          right.className =
            "task-right";

          const edit =
            document.createElement("button");

          edit.innerText = "✏️";

          edit.onclick = () =>
            editTask(
              catIndex,
              taskIndex
            );

          const del =
            document.createElement("button");

          del.innerText = "🗑";

          del.onclick = () =>
            deleteTask(
              catIndex,
              taskIndex
            );

          right.append(
            edit,
            del
          );

          taskDiv.append(
            left,
            right
          );

          taskList.appendChild(
            taskDiv
          );
        }
      );

      /* ADD TASK */

      const addTaskBtn =
        document.createElement("button");

      addTaskBtn.innerText =
        "+ Tambah Task";

      addTaskBtn.onclick = () => {

        state.currentCategoryIndex =
          catIndex;

        openTaskModal();
      };

      categoryDiv.append(
        header,
        taskList,
        addTaskBtn
      );

      container.appendChild(
        categoryDiv
      );
    });
}

/* =========================
   REFRESH UI
========================= */

function refreshUI() {
  
  refreshTaskUI()
refreshStatsUI()
refreshHabitUI()
refreshCalendarUI()
  
}

function refreshTaskUI(){

  render();

  updateLevel();
  updateQuickStats();
  updateProgressRing();

  generateHeatmap();

  loadRandomQuote();

  updateImproveStats();
}


function refreshHabitUI(){

  renderHabits();
}

function refreshCalendarUI(){

  renderCalendar();
}

/* =========================
   CATEGORY
========================= */

function addCategory() {

  const input =
    document.getElementById(
      "categoryInput"
    );

  if (!input.value.trim()) return;

  saveState();

  state.appData.push({
    name: input.value,
    tasks: []
  });

  input.value = "";

  saveToLocal();
  refreshUI();

  ;
}

function addHabitCategory(){

  const input =
    document.getElementById(
      "habitCategoryInput"
    );

  const name =
    input.value.trim();

  if(!name) return;

  saveState();

  state.habits.push({

    category:name,

    habits:[]
  });

  input.value = "";

  saveToLocal();

  refreshHabitUI();
}

function editCategory(index) {

  const newName =
    prompt(
      "Edit category:",
      state.appData[index].name
    );

  if (!newName) return;

  state.appData[index].name =
    newName;

  saveToLocal();

  refreshUI();
}

function deleteCategory(index) {

  if (!confirm("Hapus category?"))
    return;

  saveState();

  state.appData.splice(index, 1);

  saveToLocal();

  refreshUI();
}

/* =========================
   TASK
========================= */

function saveTaskModal() {

  const name =
    document.getElementById(
      "taskNameInput"
    ).value;

  const deadline =
    document.getElementById(
      "taskDeadlineInput"
    ).value;

  const time =
    document.getElementById(
      "taskTimeInput"
    ).value;

  const location =
    document.getElementById(
      "taskLocationInput"
    ).value;

  const note =
    document.getElementById(
      "taskNoteInput"
    ).value;

  const priority =
    document.getElementById(
      "taskPriorityInput"
    ).value;

  if (!name.trim()) return;

  saveState();

if(editingTask){

  const task =
    state.appData[
      editingTask.catIndex
    ].tasks[
      editingTask.taskIndex
    ];

  task.name = name;
  task.deadline = deadline;
  task.time = time;
  task.location = location;
  task.note = note;
  task.priority = priority;

  editingTask = null;

}else{

  state.appData[
    state.currentCategoryIndex
  ].tasks.push({
    name,
    deadline,
    time,
    location,
    note,
    priority,
    done: false
  });
}

  saveToLocal();

  refreshUI();

  // RESET FORM
  document.getElementById(
    "taskNameInput"
  ).value = "";

  document.getElementById(
    "taskDeadlineInput"
  ).value = "";

  document.getElementById(
    "taskTimeInput"
  ).value = "";

  document.getElementById(
    "taskLocationInput"
  ).value = "";

  document.getElementById(
    "taskNoteInput"
  ).value = "";

  document.getElementById(
    "taskPriorityInput"
  ).value = "low";

  closeTaskModal();
}

function toggleTask(
  catIndex,
  taskIndex
) {

  saveState();
  /* =========================
   REFRESH UI
========================= */


  const task =
    state.appData[catIndex]
    .tasks[taskIndex];

  task.done = !task.done;
  updateDailyHistory();

  const reward = 3;

if (task.done) {

  addXP(reward);

  celebrate();

  updateStreak();

} else {

  addXP(-reward);
}

  saveToLocal();
}

function toggleHabit(
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

  const level =
  Math.min(
    getLevelData().level,
    10
  );

const rewards = [
  5, // level 1
  5, // level 2
  4, // level 3
  4, // level 4
  3, // level 5
  3, // level 6
  2, // level 7
  2, // level 8
  1, // level 9
  1  // level 10
];

const reward =
  rewards[level - 1];

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

  saveToLocal();

  renderHabits();
}

function editTask(
  catIndex,
  taskIndex
) {

  const task =
    state.appData[catIndex]
    .tasks[taskIndex];

  editingTask = {
    catIndex,
    taskIndex
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

function deleteTask(
  catIndex,
  taskIndex
) {

  saveState();

  state.appData[catIndex]
    .tasks.splice(taskIndex, 1);

  saveToLocal();

  refreshUI();
}

/* =========================
   FILTER
========================= */

function filterTask(task){

  const matchFilter =

    (
      state.currentFilter ===
      "all"
    )

    ||

    (
      state.currentFilter ===
      "done"

      && task.done
    )

    ||

    (
      state.currentFilter ===
      "pending"

      && !task.done
    );

  const keyword =
    state.searchValue;

  const matchSearch =

    !keyword

    ||

    (
      (task.name || "")
      .toLowerCase()
      .includes(keyword)

      ||

      (task.note || "")
      .toLowerCase()
      .includes(keyword)

      ||

      (task.location || "")
      .toLowerCase()
      .includes(keyword)
    );

  return (
    matchFilter &&
    matchSearch
  );
}

function searchTask() {

  state.searchValue =
    document
      .getElementById(
        "searchInput"
      )
      .value
      .toLowerCase();

  refreshUI();
}

function setFilter(filter) {

  state.currentFilter = filter;

  refreshUI();
}

const levels = [

  {
    name:"Pemula",
    xp:10
  },

  {
    name:"Konsisten",
    xp:9
  },

  {
    name:"Fokus",
    xp:8
  },

  {
    name:"Produktif",
    xp:7
  },

  {
    name:"Disiplin",
    xp:6
  },

  {
    name:"Advanced",
    xp:5
  },

  {
    name:"Elite",
    xp:4
  },

  {
    name:"Master",
    xp:3
  },

  {
    name:"Legend",
    xp:2
  },

  {
    name:"Monster",
    xp:1
  }
];

function getLevelData(){

  let level = 1;
  let xpNeeded = 100;
  let remainingXP = state.xp;

  while(remainingXP >= xpNeeded){

    remainingXP -= xpNeeded;

    level++;

    xpNeeded += 50;
  }

  return {
    level,
    remainingXP,
    xpNeeded
  };
}

/* =========================
   XP
========================= */

function addXP(amount) {

  state.xp += amount;

  if (state.xp < 0) {
    state.xp = 0;
  }

  updateLevel();

  saveToLocal();
}

function updateLevel() {

  let level = 1;
  let xpNeeded = 100;
  let remainingXP = state.xp;

  while (remainingXP >= xpNeeded) {

    remainingXP -= xpNeeded;

    level++;

    xpNeeded += 50;
  }

  const percent =
    (remainingXP / xpNeeded) * 100;

  document.getElementById(
    "levelText"
  ).innerText =
    `🏆 Level ${level}`;

  document.getElementById(
    "xpText"
  ).innerText =
    `${remainingXP} / ${xpNeeded} XP`;

  document.getElementById(
    "xpFill"
  ).style.width =
    `${percent}%`;
}

function updateQuickStats(){

  let done = 0;
  let pending = 0;

  state.appData.forEach(category=>{

    category.tasks.forEach(task=>{

      if(task.done){

        done++;

      }else{

        pending++;
      }
    });
  });

  const level =
    getLevelData().level;

  document.getElementById(
    "doneCount"
  ).innerText = done;

  document.getElementById(
    "pendingCount"
  ).innerText = pending;

  document.getElementById(
    "streakCount"
  ).innerText =
    state.streakData.length;

  document.getElementById(
    "levelCount"
  ).innerText = level;
}

function updateProgressRing(){

  let total = 0;
  let done = 0;

  state.appData.forEach(category=>{

    category.tasks.forEach(task=>{

      total++;

      if(task.done){
        done++;
      }
    });
  });

  const percent =
    total
    ? Math.round(done / total * 100)
    : 0;

  const circle =
    document.getElementById(
      "progressRing"
    );

  const offset =
    440 - (440 * percent / 100);

  circle.style.strokeDashoffset =
    offset;

  document.getElementById(
    "ringPercent"
  ).innerText =
    `${percent}%`;
}

/* =========================
   DAILY HISTORY
========================= */

function updateDailyHistory() {

  const today =
    new Date()
    .toISOString()
    .split("T")[0];

  let total = 0;
  let done = 0;

  state.appData.forEach(category => {

    category.tasks.forEach(task => {

      total++;

      if(task.done){
        done++;
      }
    });
  });

  const percent =
    total
    ? Math.round(
        done / total * 100
      )
    : 0;

  state.historyData[today] =
    percent;

  saveToLocal();
}

function updateHabitStats(){

  const today =
    new Date()
    .toISOString()
    .split("T")[0];

  let total = 0;
  let done = 0;

  state.habits.forEach(category=>{

    category.habits.forEach(habit=>{

      total++;

      if(habit.done){
        done++;
      }

    });

  });

  const percent =
    total
    ? Math.round(done / total * 100)
    : 0;

  state.habitHistory[today] =
    percent;

  saveToLocal();

  updateHabitChart();
}

/* =========================
   IMPROVE SYSTEM
========================= */

function updateImproveStats(){

  const dates =
    Object.keys(state.historyData);

  if(dates.length < 2)
    return;

  const today =
    new Date();

  const todayKey =
    today
    .toISOString()
    .split("T")[0];

  const yesterday =
    new Date();

  yesterday.setDate(
    yesterday.getDate() - 1
  );

  const yesterdayKey =
    yesterday
    .toISOString()
    .split("T")[0];

  const todayValue =
    state.historyData[todayKey] || 0;

  const yesterdayValue =
    state.historyData[
      yesterdayKey
    ] || 0;

  let diff =
    todayValue - yesterdayValue;

  let text = "";

  if(diff > 0){

    text =
      `🔥 Hari ini ${diff}% lebih baik dari kemarin`;

  }else if(diff < 0){

    text =
      `📉 Hari ini turun ${Math.abs(diff)}%`;

  }else{

    text =
      `⚖️ Progress sama seperti kemarin`;
  }

  document.getElementById(
    "dailyImprove"
  ).innerText = text;

  /* WEEK */

  const values =
    Object.values(
      state.historyData
    );

  const last7 =
    values.slice(-7);

  const prev7 =
    values.slice(-14,-7);

  const avg1 =
    last7.length
    ? Math.round(
        last7.reduce(
          (a,b)=>a+b,0
        ) / last7.length
      )
    : 0;

  const avg2 =
    prev7.length
    ? Math.round(
        prev7.reduce(
          (a,b)=>a+b,0
        ) / prev7.length
      )
    : 0;

  let weeklyText = "";

  const weekDiff =
    avg1 - avg2;

  if(weekDiff > 0){

    weeklyText =
      `🚀 Minggu ini naik ${weekDiff}%`;

  }else if(weekDiff < 0){

    weeklyText =
      `📉 Minggu ini turun ${Math.abs(weekDiff)}%`;

  }else{

    weeklyText =
      `📊 Minggu ini stabil`;
  }

  document.getElementById(
    "weeklyImprove"
  ).innerText =
    weeklyText;
}

/* =========================
   CHART
========================= */

function updateChart(){

  if(typeof Chart === "undefined")
    return;

  const canvas =
    document.getElementById(
      "statsChart"
    );

  if(!canvas) return;

  const labels = [];
const data = [];

for(let i = 6; i >= 0; i--){

  const date =
    new Date();

  date.setDate(
    date.getDate() - i
  );

  const key =
    date
    .toISOString()
    .split("T")[0];

  labels.push(
    `${date.getDate()}/${
      date.getMonth()+1
    }`
  );

  data.push(
    state.historyData[key] || 0
  );
}

  if(chart){
    chart.destroy();
  }

  chart = new Chart(canvas, {

    type: "bar",

    data: {

      labels,

      datasets: [{

        label: "Progress %",

        data,

        borderRadius: 12,

        borderSkipped: false,

        backgroundColor:
  "rgba(59,130,246,0.8)",
      }]
    },

    options: {

      responsive: true,

      maintainAspectRatio: false,

      animation: {

        duration: 1200,

        easing: "easeOutQuart"
      },

      plugins: {

        legend: {

          labels: {

            color:
              document.body.classList.contains(
                "light-mode"
              )
              ? "#111"
              : "#fff"
          }
        }
      },

      scales: {

        y: {

          beginAtZero: true,

          max: 100,

          ticks: {

            color:
              document.body.classList.contains(
                "light-mode"
              )
              ? "#111"
              : "#fff"
          },

          grid: {
            color:
              "rgba(255,255,255,0.08)"
          }
        },

        x: {

          ticks: {

            color:
              document.body.classList.contains(
                "light-mode"
              )
              ? "#111"
              : "#fff"
          },

          grid: {
            display: false
          }
        }
      }
    }
  });
}

function updateHabitChart(){

  const canvas =
    document.getElementById(
      "habitChart"
    );

  if(!canvas) return;

  const labels = [];
  const data = [];

  for(let i=6;i>=0;i--){

    const date =
      new Date();

    date.setDate(
      date.getDate()-i
    );

    const key =
      date
      .toISOString()
      .split("T")[0];

    labels.push(
      `${date.getDate()}/${
        date.getMonth()+1
      }`
    );

    data.push(
      state.habitHistory[key] || 0
    );
  }
  const categoryStats =
  state.habits.map(cat=>{

    const total =
      cat.habits.length;

    const done =
      cat.habits.filter(
        h=>h.done
      ).length;

    return {
      name:cat.category,
      percent:
        total
        ? Math.round(done/total*100)
        : 0
    };
  });

  if(habitChart){
    habitChart.destroy();
  }

  habitChart = new Chart(canvas,{

    type:"line",

    data:{
      labels,

      datasets:[{
        label:"Habit %",
        data,
        tension:0.4,
        fill:true,
        backgroundColor:
          "rgba(34,197,94,0.2)",

        borderColor:
          "rgba(34,197,94,1)",

        borderWidth:3,

        pointRadius:5,
pointHoverRadius:8,
pointBorderWidth:2,
cubicInterpolationMode:"monotone",
      }]
    },

    options:{

      responsive:true,

      maintainAspectRatio:false,

      plugins:{
        legend:{
          labels:{
            color:
              document.body.classList.contains(
                "light-mode"
              )
              ? "#111"
              : "#fff"
          }
        }
      },

      scales:{

        y:{
          beginAtZero:true,
          max:100,

          ticks:{
            color:
              document.body.classList.contains(
                "light-mode"
              )
              ? "#111"
              : "#fff"
          }
        },

        x:{
          ticks:{
            color:
              document.body.classList.contains(
                "light-mode"
              )
              ? "#111"
              : "#fff"
          }
        }
      }
    }
  });
}

/* =========================
   HEATMAP
========================= */

function generateHeatmap() {

  const heatmap =
    document.getElementById(
      "heatmap"
    );

  if (!heatmap) return;

  heatmap.innerHTML = "";

  for (let i = 0; i < 30; i++) {

    const box =
      document.createElement("div");

    box.className = "day-box";

    if (i < state.streakData.length)
     {
      box.classList.add(
        "day-active"
      );
    }

    heatmap.appendChild(box);
  }
}

/* =========================
   STREAK
========================= */

function updateStreak(){

  const today =
    new Date()
    .toDateString();

  let allDone = true;
  let hasTask = false;

  state.appData.forEach(category=>{

    category.tasks.forEach(task=>{

      hasTask = true;

      if(!task.done){
        allDone = false;
      }
    });
  });

  if(
    hasTask &&
    allDone &&
    !state.streakData.includes(today)
  ){

    state.streakData.push(today);

    saveToLocal();
  }

  document.getElementById(
    "streakText"
  ).innerText =
    `🔥 Streak: ${state.streakData.length} hari`;
}
function loadRandomQuote() {

  if (!quotes.length) return;

  const today =
    new Date()
    .toDateString();

  let savedDate =
    localStorage.getItem(
      "quoteDate"
    );

  let savedQuote =
    localStorage.getItem(
      "dailyQuote"
    );

  // kalau hari baru
  if (savedDate !== today) {

    const random =
      quotes[
        Math.floor(
          Math.random() * quotes.length
        )
      ];

    savedQuote =
      JSON.stringify(random);

    localStorage.setItem(
      "dailyQuote",
      savedQuote
    );

    localStorage.setItem(
      "quoteDate",
      today
    );
  }

  const quote =
    JSON.parse(savedQuote);

  document.getElementById(
    "quoteText"
  ).innerText =
    `"${quote.text}"`;

  document.getElementById(
    "quoteAuthor"
  ).innerText =
    `— ${quote.author}`;
}

/* =========================
   HABIT
========================= */

function addHabit() {

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

  saveToLocal();

  renderHabits();

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

function isHabitToday(habit){

  const now =
    new Date();

  const day =
    now.getDay();

  const date =
    now.getDate();

  if(habit.repeatType === "daily"){
    return true;
  }

  if(habit.repeatType === "weekly"){

  return habit.repeatDays.includes(day);
}

  if(habit.repeatType === "monthly"){
    return Number(
      habit.repeatDate
    ) === date;
  }

  if(habit.repeatType === "custom"){
    return habit.repeatDays.includes(day);
  }

  return true;
}

function renderHabits() {

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
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu"
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

/* =========================
   MODAL
========================= */

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
/* =========================
   HABIT MODAL
========================= */


function closeHabitModal(){

  document
    .getElementById(
      "habitModal"
    )
    .classList.remove("show");
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

/* =========================
   SECTION
========================= */

function showSection(section) {

  homeSection.style.display = "none";

  calendarSection.style.display = "none";

  habitSection.style.display = "none";

  statsSection.style.display = "none";

  if (section === "home") {
    homeSection.style.display = "block";
  }

  if (section === "calendar") {

    calendarSection.style.display = "block";

    renderCalendar();
  }

  if (section === "habit") {
    habitSection.style.display = "block";
  }

  if (section === "stats") {

    statsSection.style.display = "block";

    refreshStatsUI();
  }
}

/* =========================
   THEME
========================= */

function loadTheme() {

  const theme =
    localStorage.getItem(
      "theme"
    );

  if (theme === "light") {

    document.body.classList.add(
      "light-mode"
    );
  }
}

document
  .getElementById(
    "toggleTheme"
  )
  .onclick = () => {

    document.body.classList.toggle(
      "light-mode"
    );

    localStorage.setItem(
      "theme",

      document.body.classList.contains(
        "light-mode"
      )
        ? "light"
        : "dark"
    );
    refreshStatsUI();
  };

/* =========================
   EXPORT IMPORT
========================= */

function exportData() {

  const data = JSON.stringify({
  appData: state.appData,
  xp: state.xp,
  habits: state.habits,
  historyData: state.historyData,
  habitHistory: state.habitHistory,
  streakData: state.streakData
});

  const blob =
    new Blob([data], {
      type:
        "application/json"
    });

  const a =
    document.createElement("a");

  a.href =
    URL.createObjectURL(blob);

  a.download =
    "daily-tracker.json";

  a.click();
}

function importData(event) {

  const file =
    event.target.files[0];

  if (!file) return;

  const reader =
    new FileReader();

  reader.onload = (e) => {

    try{

  const imported =
    JSON.parse(e.target.result);

  state.appData =
    imported.appData || [];

  state.xp =
    imported.xp || 0;

  state.habits =
    imported.habits || [];
    state.historyData =
  imported.historyData || {};

state.habitHistory =
  imported.habitHistory || {};

state.streakData =
  imported.streakData || [];


}catch(err){

  alert("File rusak");
}

    saveToLocal();

    refreshUI();
  };

  reader.readAsText(file);
}

/* =========================
   UNDO REDO
========================= */

function undo() {

  if (!state.undoStack.length)
    return;

  state.redoStack.push(
    JSON.stringify({
      appData: state.appData,
      xp: state.xp,
      habits: state.habits,
      historyData: state.historyData,
      streakData: state.streakData
    })
  );

  const prev =
    JSON.parse(
      state.undoStack.pop()
    );

  state.appData =
    prev.appData;

  state.xp =
    prev.xp;

  state.habits =
    prev.habits;

  state.historyData =
    prev.historyData;

  state.streakData =
    prev.streakData;

  saveToLocal();

  refreshUI();
}

function redo() {

  if (!state.redoStack.length)
    return;

  state.undoStack.push(
    JSON.stringify({
      appData: state.appData,
      xp: state.xp,
      habits: state.habits,
      historyData: state.historyData,
      streakData: state.streakData
    })
  );

  const next =
    JSON.parse(
      state.redoStack.pop()
    );

  state.appData =
    next.appData;

  state.xp =
    next.xp;

  state.habits =
    next.habits;

  state.historyData =
    next.historyData;

  state.streakData =
    next.streakData;

  saveToLocal();

  refreshUI();
}

/* =========================
   TOAST
========================= */

function showToast(message){

  const toast =
    document.getElementById(
      "toast"
    );

  toast.innerText =
    message;

  toast.classList.add(
    "show"
  );

  setTimeout(() => {

    toast.classList.remove(
      "show"
    );

  },2500);
}

/* =========================
   EFFECT
========================= */

function celebrate() {

  if (
    typeof confetti !==
    "undefined"
  ) {

    confetti({
      particleCount: 100,
      spread: 70
    });
  }
}


function refreshStatsUI(){

  requestAnimationFrame(()=>{

    updateChart();
    updateHabitChart();

  });

  updateImproveStats();
}


/* =========================
   RENDER CALENDAR
========================= */

function renderCalendar() {

  const grid =
    document.getElementById(
      "calendarGrid"
    );

  const monthText =
    document.getElementById(
      "calendarMonth"
    );

  if (!grid || !monthText) return;

  grid.innerHTML = "";

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ];

  const days = [
    "Min",
    "Sen",
    "Sel",
    "Rab",
    "Kam",
    "Jum",
    "Sab"
  ];

  const year =
    state.currentDate.getFullYear();

  const month =
    state.currentDate.getMonth();

  monthText.innerText =
    `${months[month]} ${year}`;

  // HEADER HARI
  days.forEach(day => {

    const dayName =
      document.createElement("div");

    dayName.className =
      "calendar-day-name";

    dayName.innerText = day;

    grid.appendChild(dayName);
  });

  // TANGGAL PERTAMA
  const firstDay =
    new Date(year, month, 1)
    .getDay();

  // TOTAL HARI
  const totalDays =
    new Date(year, month + 1, 0)
    .getDate();

  // KOTAK KOSONG
  for (
    let i = 0;
    i < firstDay;
    i++
  ) {

    const empty =
      document.createElement("div");

    grid.appendChild(empty);
  }

  // TANGGAL
  for (
    let day = 1;
    day <= totalDays;
    day++
  ) {

    const dayBox =
      document.createElement("div");

    dayBox.className =
      "calendar-day";

    const today =
      new Date();

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {

      dayBox.classList.add(
        "today"
      );
    }

    // TANGGAL
    const dateText =
      document.createElement("strong");

    dateText.innerText = day;

    dayBox.appendChild(dateText);

    // TASK
    state.appData.forEach((category, catIndex) => {
  category.tasks.forEach((task, taskIndex) => {

    if (!task.deadline) return;

    const taskDate =
  new Date(task.deadline + "T00:00:00");

    if (
      taskDate.getDate() === day &&
      taskDate.getMonth() === month &&
      taskDate.getFullYear() === year
    ) {

      const taskEl = document.createElement("div");

      taskEl.className = "calendar-task";

      if (task.done) {
        taskEl.classList.add("done-task");
      }

      taskEl.innerText =
  `📌 ${task.name}`;

      

      dayBox.appendChild(taskEl);
    }
  });
});

      dayBox.addEventListener(
  "click",
  () => {
    openDayTasks(
      year,
      month,
      day
    );
  }
);

    grid.appendChild(dayBox);
  }
}

function openDayTasks(
  year,
  month,
  day
){

  const selectedDate =
  getLocalDate(
    new Date(year, month, day)
  );

  selectedCalendarDate =
    selectedDate;

  document.getElementById(
    "selectedDateTitle"
  ).innerText =
    `${day}/${month+1}/${year}`;

  const list =
    document.getElementById(
      "dayTaskList"
    );

  list.innerHTML = "";

  let found = false;

  state.appData.forEach(
    (category, catIndex)=>{

    category.tasks.forEach(
      (task, taskIndex)=>{

      if(
        task.deadline === selectedDate
      ){

        found = true;

        const item =
          document.createElement("div");

        item.className =
          "calendar-task-item";

        item.innerHTML = `
  <strong>${task.name}</strong>

  <small>
    📂 ${category.name}
  </small>

  ${
    task.time
    ? `<small>⏰ ${task.time}</small>`
    : ""
  }

  ${
    task.location
    ? `<small>📍 ${task.location}</small>`
    : ""
  }

  ${
    task.note
    ? `<small>📝 ${task.note}</small>`
    : ""
  }
`;

        item.onclick = ()=>{

          calendarSelected = {
            catIndex,
            taskIndex
          };

          openCalendarModal();
        };

        list.appendChild(item);
      }
    });
  });

  if(!found){

    list.innerHTML =
      "<p>Tidak ada task</p>";
  }

  document
    .getElementById(
      "dayTasksModal"
    )
    .classList.add("show");
}

/* =========================
   FLOATING BUTTON
========================= */

document
  .getElementById(
    "floatingAddBtn"
  )
  .addEventListener(
    "click",
    () => {

      // CEK CATEGORY ADA
      if (
        state.appData.length === 0
      ) {

        alert(
          "Buat category dulu"
        );

        return;
      }

      // DEFAULT KE CATEGORY PERTAMA
      state.currentCategoryIndex = 
      state.appData.length -1;

      openTaskModal();
    }
  );
  
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
  
  /* =========================
   CHANGE MONTH
========================= */

function changeMonth(step) {

  state.currentDate.setMonth(
    state.currentDate.getMonth() + step
  );

  renderCalendar();
}

function getLocalDate(date){

  const offset =
    date.getTimezoneOffset();

  const local =
    new Date(
      date.getTime() - offset * 60000
    );

  return local
    .toISOString()
    .split("T")[0];
}


/* =========================
   SPLASH
========================= */

/* =========================
   SPLASH WELCOME
========================= */

function updateSplashWelcome(){

  let level =
    getLevelData().level;

  if(level > 10){
    level = 10;
  }

  const splashData = [

    {
      title:
        "Selamat datang, Pemula 👋",

      quote:
        "Setiap orang hebat pernah memulai dari nol."
    },

    {
      title:
        "Selamat datang, Konsisten 🔥",

      quote:
        "Konsistensi kecil setiap hari mengalahkan motivasi sesaat."
    },

    {
      title:
        "Selamat datang, Fokus 🎯",

      quote:
        "Fokus pada progress, bukan kesempurnaan."
    },

    {
      title:
        "Selamat datang, Produktif ⚡",

      quote:
        "Produktivitas bukan sibuk, tapi menyelesaikan hal penting."
    },

    {
      title:
        "Selamat datang, Disiplin 🧠",

      quote:
        "Disiplin membuatmu tetap berjalan saat motivasi hilang."
    },

    {
      title:
        "Selamat datang, Advanced 🚀",

      quote:
        "Kamu sudah lebih jauh dari kebanyakan orang."
    },

    {
      title:
        "Selamat datang, Elite 👑",

      quote:
        "Level tinggi datang dari ribuan langkah kecil."
    },

    {
      title:
        "Selamat datang, Master 🔥",

      quote:
        "Master bukan yang sempurna, tapi yang terus berkembang."
    },

    {
      title:
        "Selamat datang, Legend ⚔️",

      quote:
        "Legenda dibentuk oleh konsistensi bertahun-tahun."
    },

    {
      title:
        "Selamat datang, Monster 💀",

      quote:
        "Kamu bukan lagi mengejar orang lain. Kamu melampaui dirimu sendiri."
    }
  ];

  const data =
    splashData[level - 1];

  document.getElementById(
    "splashLevelText"
  ).innerText =
    data.title;

  document.getElementById(
    "splashQuote"
  ).innerText =
    data.quote;
}

window.addEventListener(
  "load",
  () => {
    updateSplashWelcome();

    const splash =
      document.getElementById(
        "splashScreen"
      );

    setTimeout(() => {

      splash.classList.add(
        "splash-hide"
      );

    }, 1200);
  }
);

/* =========================
   INSTALL PWA
========================= */

window.addEventListener(
  "beforeinstallprompt",
  (e) => {

    e.preventDefault();

    deferredPrompt = e;

    document.getElementById(
      "installBtn"
    ).style.display =
      "block";
  }
);

document
  .getElementById(
    "installBtn"
  )
  .addEventListener(
    "click",
    async () => {

      if (!deferredPrompt)
        return;

      deferredPrompt.prompt();

      deferredPrompt = null;
    }
  );
  
  /* =========================
   TASK REMINDER
========================= */

function checkDeadlines(){

  if(
    Notification.permission !==
    "granted"
  ) return;

  const today =
    new Date();

  state.appData.forEach((category, catIndex)=>{

    category.tasks.forEach(task=>{

      if(
        task.done ||
        !task.deadline
      ) return;

      const deadline =
        new Date(task.deadline);

      const diff =
        Math.ceil(
          (
            deadline - today
          ) / (1000*60*60*24)
        );

      if(diff === 0){

  const notifyKey =
    `deadline_${task.name}_${task.deadline}`;

  if(localStorage.getItem(notifyKey))
    return;

  localStorage.setItem(
    notifyKey,
    "sent"
  );

  new Notification(
    "⏰ Deadline Hari Ini",
    {
      body:task.name
    }
  );

  showToast(
    "Deadline hari ini!"
  );
}
    });
  });
}

/* =========================
   TASK TIME REMINDER
========================= */

function checkTaskReminders(){

  if(Notification.permission !== "granted")
    return;

  const now = new Date();

  const currentDate =
    getLocalDate(new Date())

  const currentHour =
    String(now.getHours())
    .padStart(2,"0");

  const currentMinute =
    String(now.getMinutes())
    .padStart(2,"0");

  const currentTime =
    `${currentHour}:${currentMinute}`;
    

  state.appData.forEach(category=>{

    category.tasks.forEach(task=>{

      if(
        task.done ||
        !task.deadline ||
        !task.time
      ) return;

      // hanya hari ini
      if(task.deadline !== currentDate)
        return;

      // cocok jam
      if(task.time === currentTime){

        const notifyKey =
          `notif_${task.name}_${currentDate}_${currentTime}`;

        // cegah notif spam
        if(localStorage.getItem(notifyKey))
          return;

        new Notification(
          "🔔 Reminder Task",
          {
            body:
              `${task.name}
              • ${task.time}`
          }
        );

        showToast(
          `Reminder:
          ${task.name}`
        );

        localStorage.setItem(
          notifyKey,
          "sent"
        );
      }
    });
  });
}

document.addEventListener(
  "visibilitychange",
  () => {

    if(!document.hidden){

      checkTaskReminders();
    }
  }
);


setInterval(()=>{

  checkTaskReminders();

},60000);


  
