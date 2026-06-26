import { saveToLocal } from "../core/storage.js";
import { state } from "../core/state.js";
import { loadScript } from "../core/utils.js";

let chart = null;
let habitChart = null;
let chartLoadPromise = null;

function ensureChartLoaded() {
  if (typeof Chart !== "undefined") return Promise.resolve();
  if (chartLoadPromise) return chartLoadPromise;

  chartLoadPromise = loadScript("./assets/libs/chart.umd.js").catch(err => {
    chartLoadPromise = null;
    throw err;
  });
  return chartLoadPromise;
}

export function getLevelData(){

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

export function addXP(amount) {

  state.xp += amount;

  if (state.xp < 0) {
    state.xp = 0;
  }

  updateLevel();

  saveToLocal();
}

const levelNames = [
  "Rookie",
  "Grinder",
  "Focused",
  "Achiever",
  "Discipline",
  "Advanced",
  "Elite",
  "Mastermind",
  "Legend",
  "Monster"
];

export function updateLevel() {

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

  const levelName =
  levelNames[
    Math.min(level - 1, 9)
  ];

  const levelTextEl = document.getElementById("levelText");
  if (levelTextEl) {
    levelTextEl.innerText = `Lv. ${level}\n${levelName}`;
  }

  const xpTextEl = document.getElementById("xpText");
  if (xpTextEl) {
    xpTextEl.innerText = `${remainingXP} / ${xpNeeded} XP`;
  }

  const xpFillEl = document.getElementById("xpFill");
  if (xpFillEl) {
    xpFillEl.style.width = `${percent}%`;
  }
}

export function updateQuickStats(){

  let done = 0;
  let pending = 0;
  let total = 0;
  let todayTasks = 0;
  const today =
    new Date().toISOString().split("T")[0];

  state.appData.forEach(category=>{

    category.tasks.forEach(task=>{

      total++;

      if (task.deadline === today) {
        todayTasks++;
      }

      if(task.done){

        done++;

      }else{

        pending++;
      }
    });
  });

  const level =
    getLevelData().level;

  const quickStatsEl = document.getElementById("quickStats");
  const doneCountEl = document.getElementById("doneCount");
  const pendingCountEl = document.getElementById("pendingCount");

  if (quickStatsEl && (!doneCountEl || !pendingCountEl)) {
    quickStatsEl.innerHTML = `
      <div class="stat-card">
        <span class="stat-icon stat-icon-blue">▤</span>
        <div>
          <p>All Tasks</p>
          <h3 id="allTaskCount">${total}</h3>
          <small>Total tasks</small>
        </div>
      </div>
      <div class="stat-card">
        <span class="stat-icon stat-icon-yellow">◷</span>
        <div>
          <p>Pending</p>
          <h3 id="pendingCount">${pending}</h3>
          <small>Tasks to do</small>
        </div>
      </div>
      <div class="stat-card">
        <span class="stat-icon stat-icon-green">✓</span>
        <div>
          <p>Done</p>
          <h3 id="doneCount">${done}</h3>
          <small>Tasks completed</small>
        </div>
      </div>
      <div class="stat-card">
        <span class="stat-icon stat-icon-purple">▣</span>
        <div>
          <p>Today</p>
          <h3 id="todayCount">${todayTasks}</h3>
          <small>Tasks for today</small>
        </div>
      </div>
    `;
  } else {
    if (doneCountEl) doneCountEl.innerText = done;
    if (pendingCountEl) pendingCountEl.innerText = pending;
    
    const allTaskCount = document.getElementById("allTaskCount");
    if (allTaskCount) allTaskCount.innerText = total;

    const todayCount = document.getElementById("todayCount");
    if (todayCount) todayCount.innerText = todayTasks;
  }

  const levelCount =
    document.getElementById("levelCount");

  if (levelCount) {
    levelCount.innerText = level;
  }

  const sidebarStreakCount =
    document.getElementById("sidebarStreakCount");

  if (sidebarStreakCount) {
    sidebarStreakCount.innerText =
      `${state.streakData.length} Days`;
  }
}

export function updateProgressRing(){

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

  if (circle) {
    circle.style.strokeDashoffset =
      offset;
  }

  const ringPercentEl = document.getElementById(
    "ringPercent"
  );
  if (ringPercentEl) {
    ringPercentEl.innerText =
      `${percent}%`;
  }
}

/* =========================
   DAILY HISTORY
========================= */

export function updateDailyHistory() {

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

export function updateHabitStats(){
  const today = new Date().toISOString().split("T")[0];
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

export function updateImproveStats(){

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
      `🔥 Today ${diff}% is better than yesterday`;

  }else if(diff < 0){

    text =
      `📉 Today down ${Math.abs(diff)}%`;

  }else{

    text =
      `⚖️ progress is the same as yesterday`;
  }

  const dailyImproveEl = document.getElementById(
    "dailyImprove"
  );
  if (dailyImproveEl) {
    dailyImproveEl.innerText = text;
  }

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
      `🚀 This week is up ${weekDiff}%`;

  }else if(weekDiff < 0){

    weeklyText =
      `📉 This week is down ${Math.abs(weekDiff)}%`;

  }else{

    weeklyText =
      `📊 This week it's stable`;
  }

  const weeklyImproveEl = document.getElementById(
    "weeklyImprove"
  );
  if (weeklyImproveEl) {
    weeklyImproveEl.innerText =
      weeklyText;
  }
}

/* =========================
   CHART
========================= */

export async function updateChart(){
  try {
    await ensureChartLoaded();
  } catch (e) {
    console.error("Failed to load Chart.js", e);
    return;
  }

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

export async function updateHabitChart(){

  try {
    await ensureChartLoaded();
  } catch (e) {
    console.error("Failed to load Chart.js", e);
    return;
  }

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

export function generateHeatmap() {

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

export function updateStreak(){

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

  const streakTextEl = document.getElementById(
    "streakText"
  );
  if (streakTextEl) {
    streakTextEl.innerText =
      `🔥 Streak: ${state.streakData.length} Days`;
  }
}

export function refreshStatsUI(){

  const hasData = state.appData.some(cat => cat.tasks.length > 0) || state.habits.some(cat => cat.habits.length > 0);
  const emptyState = document.getElementById("statsEmptyState");
  const content = document.getElementById("statsContent");

  if (emptyState && content) {
    if (!hasData) {
      emptyState.style.display = "flex";
      content.style.display = "none";
      return;
    }
    emptyState.style.display = "none";
    content.style.display = "block";
  }

  requestAnimationFrame(()=>{

    updateChart();
    updateHabitChart();

  });

  updateImproveStats();
}
