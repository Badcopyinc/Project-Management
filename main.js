
const projectsData = [
  {
    name: "🔴 Project A",
    tasks: [
      {
        name: "🔴 Testing",
        subtasks: ["Verify signals", "Power cycle"]
      }
    ],
    materials: [
      {
        name: "🔴 Material Set A",
        subtasks: ["Readers", "Door Contacts", "DS160", "X3300", "X1320", "Cameras"]
      }
    ]
  }
];

const materialStages = [
  { label: "Picked up", color: "orange" },
  { label: "On Van", color: "red" },
  { label: "Installed/Used", color: "green" },
  { label: "Unused/RTO", color: "blue" }
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

  const progressContainer = document.createElement("div");
  progressContainer.style.display = "flex";
  progressContainer.style.alignItems = "center";
  progressContainer.style.gap = "1rem";
  progressContainer.style.marginBottom = "1rem";

  const percentageLabel = document.createElement("span");
  progress.value = allSubtasks.reduce((total, key) => {
    const val = saved[key];
    if (typeof val === 'number') {
      if (key.startsWith("mat_")) {
        return total + (val >= 2 ? 1 : val * 0.25);
      } else {
        return total + (val ? 1 : 0);
      }
    } else {
      return total + (val ? 1 : 0);
    }
  }, 0);
  percentageLabel.textContent = Math.round((progress.value / progress.max) * 100) + "%";

  progressContainer.appendChild(progress);
  progressContainer.appendChild(percentageLabel);
  container.appendChild(progressContainer);

  const matSection = document.createElement("details");
  const matSummary = document.createElement("summary");
  matSummary.textContent = "📦 Materials";
  matSummary.style.fontWeight = "bold";
  matSection.appendChild(matSummary);

  project.materials.forEach((mat, matIndex) => {
    const matDiv = document.createElement("div");
    matDiv.className = "task";
    const matTitle = document.createElement("strong");
    matTitle.textContent = mat.name;
    matDiv.appendChild(matTitle);

    const matList = document.createElement("ul");
    mat.subtasks.forEach((subtask, subIndex) => {
      const item = document.createElement("li");

      const key = `mat_${matIndex}_${subIndex}`;
      let currentStage = saved[key] || 0;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = currentStage >= 2;

      const label = document.createElement("label");
      label.textContent = ` ${subtask}`;
      label.style.marginLeft = "0.5rem";

      const stageLabel = document.createElement("span");
      if (materialStages[currentStage]) {
        stageLabel.textContent = ` (${materialStages[currentStage].label})`;
        stageLabel.style.color = materialStages[currentStage].color;
        stageLabel.style.marginLeft = "0.5rem";
      }

      checkbox.onclick = () => {
        currentStage = (currentStage + 1) % 4;
        checkbox.checked = currentStage >= 2;
        stageLabel.textContent = ` (${materialStages[currentStage].label})`;
        stageLabel.style.color = materialStages[currentStage].color;
        saved[key] = currentStage;
        localStorage.setItem("project_" + projectIndex, JSON.stringify(saved));
        progress.value = allSubtasks.reduce((total, key) => {
          const val = saved[key];
          if (typeof val === 'number') {
            if (key.startsWith("mat_")) {
              return total + (val >= 2 ? 1 : val * 0.25);
            } else {
              return total + (val ? 1 : 0);
            }
          } else {
            return total + (val ? 1 : 0);
          }
        }, 0);
        percentageLabel.textContent = Math.round((progress.value / progress.max) * 100) + "%";
      };

      item.appendChild(checkbox);
      item.appendChild(label);
      item.appendChild(stageLabel);
      matList.appendChild(item);
    });

    matDiv.appendChild(matList);
    matSection.appendChild(matDiv);
  });

  container.appendChild(matSection);
  projectsContainer.appendChild(container);
});
