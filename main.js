
// Initialize edit mode and load from localStorage
let isEditing = false;
const savedData = JSON.parse(localStorage.getItem("trackerData")) || {
  projects: [
    {
      name: "🔴 Project A",
      tasks: [
        {
          name: "🔴 Running wire",
          subtasks: ["Run cable to Room A", "Run cable to Room B", "Run cable to Room C"]
        },
        {
          name: "🔴 Installing head and wiring head end",
          subtasks: ["Mount head end", "Wire inputs", "Test connections"]
        },
        {
          name: "🔴 Installing devices",
          subtasks: ["Install keypads", "Install cameras", "Install sensors"]
        },
        {
          name: "🔴 Testing",
          subtasks: ["Power cycle", "Verify signals", "Document results"]
        }
      ],
      materials: [
        {
          name: "🔴 Material Set A",
          subtasks: ["Readers", "Door Contacts", "DS160", "X3300", "X1320", "Cameras"]
        }
      ]
    }
  ],
  progress: {}
};

const materialStages = [
  { label: "Picked up / On Van", color: "orange", value: 1 / 3 },
  { label: "On Site", color: "red", value: 2 / 3 },
  { label: "Installed/Used", color: "green", value: 1 },
  { label: "Unused Returning to Office", color: "blue", value: 1 }
];

const saveData = () => {
  localStorage.setItem("trackerData", JSON.stringify(savedData));
};

const projectsContainer = document.getElementById("projects");

function render() {
  projectsContainer.innerHTML = "";
  savedData.projects.forEach((project, pIndex) => {
    const container = document.createElement("div");
    container.className = "project";

    const title = isEditing
      ? document.createElement("input")
      : document.createElement("h2");

    if (isEditing) {
      title.type = "text";
      title.value = project.name;
      title.oninput = () => {
        savedData.projects[pIndex].name = title.value;
        saveData();
      };
    } else {
      title.textContent = project.name;
    }

    container.appendChild(title);

    const allSubtasks = [];
    project.tasks.forEach((task, tIndex) => {
      task.subtasks.forEach((_, sIndex) => {
        allSubtasks.push(`task_${pIndex}_${tIndex}_${sIndex}`);
      });
    });
    project.materials.forEach((mat, mIndex) => {
      mat.subtasks.forEach((_, sIndex) => {
        allSubtasks.push(`mat_${pIndex}_${mIndex}_${sIndex}`);
      });
    });

    const progress = document.createElement("progress");
    progress.max = allSubtasks.length;
    progress.value = allSubtasks.reduce((total, key) => {
      const val = savedData.progress[key];
      if (typeof val === "number") {
        if (key.startsWith("mat_")) {
          return total + materialStages[val].value;
        } else {
          return total + (val ? 1 : 0);
        }
      }
      return total;
    }, 0);

    const label = document.createElement("span");
    label.textContent = Math.round((progress.value / progress.max) * 100) + "%";

    const progressContainer = document.createElement("div");
    progressContainer.style.display = "flex";
    progressContainer.style.alignItems = "center";
    progressContainer.style.gap = "1rem";
    progressContainer.appendChild(progress);
    progressContainer.appendChild(label);
    container.appendChild(progressContainer);

    const taskSection = document.createElement("details");
    const taskSummary = document.createElement("summary");
    taskSummary.textContent = "📋 Tasks";
    taskSummary.style.fontWeight = "bold";
    taskSection.appendChild(taskSummary);

    project.tasks.forEach((task, tIndex) => {
      const taskDiv = document.createElement("div");
      const taskTitle = isEditing
        ? document.createElement("input")
        : document.createElement("strong");

      if (isEditing) {
        taskTitle.type = "text";
        taskTitle.value = task.name;
        taskTitle.oninput = () => {
          savedData.projects[pIndex].tasks[tIndex].name = taskTitle.value;
          saveData();
        };
      } else {
        taskTitle.textContent = task.name;
      }

      taskDiv.appendChild(taskTitle);

      const subtaskList = document.createElement("ul");
      task.subtasks.forEach((sub, sIndex) => {
        const item = document.createElement("li");
        if (isEditing) {
          const input = document.createElement("input");
          input.type = "text";
          input.value = sub;
          input.oninput = () => {
            savedData.projects[pIndex].tasks[tIndex].subtasks[sIndex] = input.value;
            saveData();
          };
          item.appendChild(input);
        } else {
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          const key = `task_${pIndex}_${tIndex}_${sIndex}`;
          checkbox.checked = !!savedData.progress[key];
          checkbox.onchange = () => {
            savedData.progress[key] = checkbox.checked;
            saveData();
            render();
          };
          item.appendChild(checkbox);
          const label = document.createElement("label");
          label.textContent = " " + sub;
          item.appendChild(label);
        }
        subtaskList.appendChild(item);
      });

      if (isEditing) {
        const addBtn = document.createElement("button");
        addBtn.textContent = "+ Add Subtask";
        addBtn.onclick = () => {
          savedData.projects[pIndex].tasks[tIndex].subtasks.push("New Subtask");
          saveData();
          render();
        };
        taskDiv.appendChild(addBtn);
      }

      taskDiv.appendChild(subtaskList);
      taskSection.appendChild(taskDiv);
    });

    if (isEditing) {
      const newTaskBtn = document.createElement("button");
      newTaskBtn.textContent = "+ Add Task";
      newTaskBtn.onclick = () => {
        savedData.projects[pIndex].tasks.push({ name: "New Task", subtasks: [] });
        saveData();
        render();
      };
      taskSection.appendChild(newTaskBtn);
    }

    container.appendChild(taskSection);

    const matSection = document.createElement("details");
    const matSummary = document.createElement("summary");
    matSummary.textContent = "📦 Materials";
    matSummary.style.fontWeight = "bold";
    matSection.appendChild(matSummary);

    project.materials.forEach((mat, mIndex) => {
      const matDiv = document.createElement("div");
      const matTitle = isEditing
        ? document.createElement("input")
        : document.createElement("strong");

      if (isEditing) {
        matTitle.type = "text";
        matTitle.value = mat.name;
        matTitle.oninput = () => {
          savedData.projects[pIndex].materials[mIndex].name = matTitle.value;
          saveData();
        };
      } else {
        matTitle.textContent = mat.name;
      }

      matDiv.appendChild(matTitle);

      const matList = document.createElement("ul");
      mat.subtasks.forEach((sub, sIndex) => {
        const item = document.createElement("li");
        const key = `mat_${pIndex}_${mIndex}_${sIndex}`;
        let stage = savedData.progress[key] || 0;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = stage >= 2;

        const label = isEditing
          ? document.createElement("input")
          : document.createElement("label");

        if (isEditing) {
          label.type = "text";
          label.value = sub;
          label.oninput = () => {
            savedData.projects[pIndex].materials[mIndex].subtasks[sIndex] = label.value;
            saveData();
          };
        } else {
          label.textContent = " " + sub;
        }

        const stageLabel = document.createElement("span");
        if (!isEditing && materialStages[stage]) {
          stageLabel.textContent = ` (${materialStages[stage].label})`;
          stageLabel.style.color = materialStages[stage].color;
          stageLabel.style.marginLeft = "0.5rem";
        }

        if (!isEditing) {
          checkbox.onclick = () => {
            stage = (stage + 1) % 4;
            savedData.progress[key] = stage;
            saveData();
            render();
          };
        }

        item.appendChild(checkbox);
        item.appendChild(label);
        if (!isEditing) item.appendChild(stageLabel);
        matList.appendChild(item);
      });

      if (isEditing) {
        const addMat = document.createElement("button");
        addMat.textContent = "+ Add Material";
        addMat.onclick = () => {
          savedData.projects[pIndex].materials[mIndex].subtasks.push("New Material");
          saveData();
          render();
        };
        matDiv.appendChild(addMat);
      }

      matDiv.appendChild(matList);
      matSection.appendChild(matDiv);
    });

    if (isEditing) {
      const newMatBtn = document.createElement("button");
      newMatBtn.textContent = "+ Add Material Set";
      newMatBtn.onclick = () => {
        savedData.projects[pIndex].materials.push({ name: "New Material Set", subtasks: [] });
        saveData();
        render();
      };
      matSection.appendChild(newMatBtn);
    }

    container.appendChild(matSection);
    projectsContainer.appendChild(container);
  });
}

document.getElementById("toggleEdit").onclick = () => {
  isEditing = !isEditing;
  document.getElementById("toggleEdit").textContent = isEditing ? "Save" : "Edit";
  render();
};

render();
