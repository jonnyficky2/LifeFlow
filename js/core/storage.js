import { state } from "./state.js";
import { showToast } from "./utils.js";

export function trimHistory(historyData){

  const keys =
    Object.keys(historyData);

  while(keys.length > 90){

    delete historyData[
      keys.shift()
    ];
  }
}

export function saveToLocal() {
  trimHistory(state.historyData);
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
  localStorage.setItem(
  "notes",
  JSON.stringify(state.notes)
);
}

export function saveState(){

  state.undoStack.push(
    JSON.stringify({
      appData:state.appData,
      xp:state.xp,
      habits:state.habits,
      historyData:state.historyData,
      streakData:state.streakData,
      notes:state.notes
    })
  );
  
  if(state.undoStack.length > 30){

  state.undoStack.shift();
}

  state.redoStack = [];
}

export function exportData() {

  const data = JSON.stringify({
  appData: state.appData,
  xp: state.xp,
  habits: state.habits,
  historyData: state.historyData,
  habitHistory: state.habitHistory,
  streakData: state.streakData,
  notes: state.notes
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

export function importData(event) {

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

state.notes =
  imported.notes || [];

}catch(err){

  showToast("File rusak");
}

    saveToLocal();

    
  };

  reader.readAsText(file);
}