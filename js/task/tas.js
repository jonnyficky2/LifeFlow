import { state } from "../core/state.js";

import {
  saveToLocal,
  saveState
} from "../core/storage.js";

import {
  getToday,
  celebrate
} from "../core/utils.js";

/* =========================
   RENDER TASK
========================= */

export function renderTasks(container){

  if(!container) return;

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
            "Edit category:",
            category.name
          );

        if(!newName) return;

        category.name =
          newName;

        saveToLocal();

        renderTasks(container);
      };

      /* DELETE CATEGORY */

      const delBtn =
        document.createElement("button");

      delBtn.innerText = "🗑";

      delBtn.onclick = ()=>{

        if(
          !confirm(
            "Hapus category?"
          )
        ) return;

        state.appData.splice(
          catIndex,
          1
        );

        saveToLocal();

        renderTasks(container);
      };

      actions.append(
        editBtn,
        delBtn
      );

      header.appendChild(actions);

      categoryDiv.appendChild(
        header
      );

      /* TASKS */

      category.tasks.forEach(
        (task, taskIndex)=>{

        const taskDiv =
          document.createElement("div");

        taskDiv.className =
          `task ${
            task.done
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
          task.done;

        checkbox.onchange =
          ()=>{

          toggleTask(
            catIndex,
            taskIndex
          );
        };

        const wrapper =
          document.createElement("div");

        const text =
          document.createElement("span");

        text.innerText =
          task.name;

        wrapper.appendChild(
          text
        );

        /* DEADLINE */

        if(task.deadline){

          const info =
            document.createElement(
              "small"
            );

          info.innerText =
            `📅 ${task.deadline}`;

          wrapper.appendChild(
            info
          );
        }

        left.append(
          checkbox,
          wrapper
        );

        /* RIGHT */

        const right =
          document.createElement(
            "div"
          );

        const edit =
          document.createElement(
            "button"
          );

        edit.innerText = "✏️";

        edit.onclick = ()=>{

          const newName =
            prompt(
              "Edit task:",
              task.name
            );

          if(!newName) return;

          task.name =
            newName;

          saveToLocal();

          renderTasks(
            container
          );
        };

        const del =
          document.createElement(
            "button"
          );

        del.innerText = "🗑";

        del.onclick = ()=>{

          category.tasks.splice(
            taskIndex,
            1
          );

          saveToLocal();

          renderTasks(
            container
          );
        };

        right.append(
          edit,
          del
        );

        taskDiv.append(
          left,
          right
        );

        categoryDiv.appendChild(
          taskDiv
        );
      });

      /* ADD TASK BUTTON */

      const addBtn =
        document.createElement(
          "button"
        );

      addBtn.innerText =
        "+ Tambah Task";

      addBtn.onclick = ()=>{

        state.currentCategoryIndex =
          catIndex;

        document
          .getElementById(
            "taskModal"
          )
          .classList.add(
            "show"
          );
      };

      categoryDiv.appendChild(
        addBtn
      );

      container.appendChild(
        categoryDiv
      );
    }
  );
}

/* =========================
   TOGGLE TASK
========================= */

export function toggleTask(
  catIndex,
  taskIndex
){

  saveState();

  const task =
    state.appData[
      catIndex
    ].tasks[
      taskIndex
    ];

  const today =
    getToday();

  task.done =
    !task.done;

  if(task.done){

    if(
      !task.completedDates
    ){
      task.completedDates = [];
    }

    if(
      !task.completedDates.includes(
        today
      )
    ){

      task.completedDates.push(
        today
      );
    }

    celebrate();

  } else {

    task.completedDates =
      task.completedDates.filter(
        date =>
          date !== today
      );
  }

  saveToLocal();
}

/* =========================
   ADD TASK
========================= */

export function addTask(){

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

  if(!name.trim()) return;

  state.appData[
    state.currentCategoryIndex
  ].tasks.push({

    name,

    deadline,

    time,

    location,

    note,

    priority,

    done:false,

    completedDates:[],

    streak:0,

    lastCompleted:null
  });

  saveToLocal();

  document
    .getElementById(
      "taskModal"
    )
    .classList.remove(
      "show"
    );
}