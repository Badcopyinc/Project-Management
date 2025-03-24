
// 🔴 Customize your projects, tasks, and materials here
const projectsData = [
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
        subtasks: ["Picked up", "On van", "Used/Installed"]
      },
      {
        name: "🔴 Material Set B",
        subtasks: ["Picked up", "On van", "Used/Installed"]
      }
    ]
  },
  {
    name: "🔴 Project B",
    tasks: [
      {
        name: "🔴 Step 1",
        subtasks: ["Prep materials", "Mark locations"]
      },
      {
        name: "🔴 Step 2",
        subtasks: ["Install components", "Secure wiring"]
      },
      {
        name: "🔴 Step 3",
        subtasks: ["Final inspection", "Client sign-off"]
      }
    ],
    materials: [
      {
        name: "🔴 Material Set X",
        subtasks: ["Picked up", "On van", "Used/Installed"]
      }
    ]
  }
];

const projectsContainer = document.getElementById("projects");

projectsData.forEach((project, projectIndex) => {
  const saved = JSON.parse(localStorage.getItem("project_" + projectIndex)) || {};

  const container = document.createElement("div");
  container.className = "project";

  const title = document.createElement("h2");
  title.textContent = project.name;
  container.appendChild(title);

  const allSubtasks = [
    ...project.tasks.flatMap((_, taskIndex) =>
      project.tasks[taskIndex].subtasks.map((__, subIndex) => `task_${taskIndex}_${subIndex}`)
    ),
    ...((project.materials || []).flatMap((_, matIndex) =>
      project.materials[matIndex].subtasks.map((__, subIndex) => `mat_${matIndex}_${subIndex}`)
    ))
  ];

  const progress = document.createElement("progress");
  progress.max = allSubtasks.length;
  progress.value = Object.values(saved).filter(Boolean).length;
        percentageLabel.textContent = Math.round((progress.value / progress.max) * 100) + "%";
  
  const progressContainer = document.createElement("div");
  progressContainer.style.display = "flex";
  progressContainer.style.alignItems = "center";
  progressContainer.style.gap = "1rem";
  progressContainer.style.marginBottom = "1rem";

  const percentageLabel = document.createElement("span");
  percentageLabel.textContent = Math.round((progress.value / progress.max) * 100) + "%";

  progress.onchange = () => {
    percentageLabel.textContent = Math.round((progress.value / progress.max) * 100) + "%";
  };

  progressContainer.appendChild(progress);
  progressContainer.appendChild(percentageLabel);
  container.appendChild(progressContainer);


  // Tasks Section
  const taskSection = document.createElement("details");
  const taskSummary = document.createElement("summary");
  taskSummary.textContent = "📋 Tasks";
  taskSummary.style.fontWeight = "bold";
  taskSection.appendChild(taskSummary);
  project.tasks.forEach((task, taskIndex) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    const taskTitle = document.createElement("strong");
    taskTitle.textContent = task.name;
    taskDiv.appendChild(taskTitle);

    const subtaskList = document.createElement("ul");
    task.subtasks.forEach((subtask, subIndex) => {
      const item = document.createElement("li");

      const checkbox = document.createElement("input");
      const key = `task_${taskIndex}_${subIndex}`;
      checkbox.type = "checkbox";
      checkbox.checked = saved[key] || false;

      checkbox.onchange = () => {
        saved[key] = checkbox.checked;
        localStorage.setItem("project_" + projectIndex, JSON.stringify(saved));
        progress.value = Object.values(saved).filter(Boolean).length;
        percentageLabel.textContent = Math.round((progress.value / progress.max) * 100) + "%";
      };

      const label = document.createElement("label");
      label.textContent = subtask;
      label.style.marginLeft = "0.5rem";

      item.appendChild(checkbox);
      item.appendChild(label);
      subtaskList.appendChild(item);
    });

    taskDiv.appendChild(subtaskList);
    taskSection.appendChild(taskDiv);
  });

  // Materials Section
  const matSection = document.createElement("details");
  const matSummary = document.createElement("summary");
  matSummary.textContent = "📦 Materials";
  matSummary.style.fontWeight = "bold";
  matSection.appendChild(matSummary);
  if (project.materials) {
    const materialsHeader = document.createElement("h3");
    materialsHeader.textContent = "🔧 Materials";
    
    project.materials.forEach((mat, matIndex) => {
      const matDiv = document.createElement("div");
      matDiv.className = "task";
      const matTitle = document.createElement("strong");
      matTitle.textContent = mat.name;
      matDiv.appendChild(matTitle);

      const matList = document.createElement("ul");
      mat.subtasks.forEach((subtask, subIndex) => {
        const item = document.createElement("li");

        const checkbox = document.createElement("input");
        const key = `mat_${matIndex}_${subIndex}`;
        checkbox.type = "checkbox";
        checkbox.checked = saved[key] || false;

        checkbox.onchange = () => {
          saved[key] = checkbox.checked;
          localStorage.setItem("project_" + projectIndex, JSON.stringify(saved));
          progress.value = Object.values(saved).filter(Boolean).length;
        percentageLabel.textContent = Math.round((progress.value / progress.max) * 100) + "%";
        };

        const label = document.createElement("label");
        label.textContent = subtask;
        label.style.marginLeft = "0.5rem";

        item.appendChild(checkbox);
        item.appendChild(label);
        matList.appendChild(item);
      });

      matDiv.appendChild(matList);
      matSection.appendChild(matDiv);
    });
  }

  container.appendChild(taskSection);
  projectsContainer.appendChild(container);
});
