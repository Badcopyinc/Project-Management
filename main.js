
const data = {
  Chris: [
    { name: "Warehouse Access", percent: 66 },
    { name: "Gate Cameras", percent: 33 }
  ],
  Mike: [
    { name: "Office 14", percent: 20 }
  ]
};

const tasks = [
  "Run wire", "Mount devices", "Terminate cables", "Test connections"
];

const materials = [
  "Readers", "Door Contacts", "DS160", "X3300", "X1320", "Cameras"
];

const stages = ["", "Picked up / On Van", "On Site", "Installed/Used", "Unused/RTO"];
const stageColors = ["", "orange", "red", "green", "blue"];

let materialStage = {};
let completedTasks = 0;
let totalItems = tasks.length + materials.length;

function renderDashboard() {
  const dashboard = document.getElementById("dashboard");
  dashboard.innerHTML = "";
  Object.keys(data).forEach(tech => {
    const card = document.createElement("div");
    card.className = "card";
    const title = document.createElement("h2");
    title.textContent = tech;
    card.appendChild(title);

    data[tech].forEach(project => {
      const proj = document.createElement("div");
      proj.className = "project";
      const name = document.createElement("span");
      name.className = "link";
      name.textContent = project.name;
      name.onclick = () => openTracker(tech, project.name);
      const percent = document.createElement("span");
      percent.textContent = project.percent + "%";
      proj.appendChild(name);
      proj.appendChild(percent);
      card.appendChild(proj);
    });

    dashboard.appendChild(card);
  });
}

function openTracker(tech, project) {
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("tracker").style.display = "block";
  document.getElementById("tracker-title").textContent = tech + ": " + project;
  renderTasks();
  renderMaterials();
  updateProgress();
}

function goBack() {
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("tracker").style.display = "none";
}

function renderTasks() {
  const container = document.getElementById("task-list");
  container.innerHTML = "<h3>Tasks</h3>";
  completedTasks = 0;
  tasks.forEach((task, i) => {
    const label = document.createElement("label");
    label.style.display = "block";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.onchange = () => {
      checkbox.checked ? completedTasks++ : completedTasks--;
      updateProgress();
    };
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + task));
    container.appendChild(label);
  });
}

function renderMaterials() {
  const container = document.getElementById("material-list");
  container.innerHTML = "<h3>Materials</h3>";
  materials.forEach((item, i) => {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "0.5rem";
    const button = document.createElement("button");
    button.textContent = item;
    button.onclick = () => {
      const stage = (materialStage[item] || 0) + 1;
      materialStage[item] = stage > 4 ? 0 : stage;
      updateMaterials(container);
      updateProgress();
    };
    wrapper.appendChild(button);
    const status = document.createElement("span");
    status.id = "stage-" + item;
    status.style.marginLeft = "0.5rem";
    wrapper.appendChild(status);
    container.appendChild(wrapper);
  });
}

function updateMaterials(container) {
  materials.forEach(item => {
    const stage = materialStage[item] || 0;
    const label = stages[stage];
    const color = stageColors[stage];
    const status = document.getElementById("stage-" + item);
    status.textContent = label;
    status.style.color = color;
  });
}

function updateProgress() {
  const materialsDone = Object.values(materialStage).filter(v => v >= 3).length;
  const totalDone = completedTasks + materialsDone;
  const percent = Math.round((totalDone / totalItems) * 100);
  document.getElementById("progress-bar").style.width = percent + "%";
}

renderDashboard();
