
let isEditing = false;

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    tech: params.get("tech"),
    project: params.get("project")
  };
}

function toggleEdit() {
  isEditing = !isEditing;
  renderProject(currentData);
}

let currentData = {};

async function loadProject() {
  const { tech, project } = getQueryParams();
  const res = await fetch(SCRIPT_URL);
  const data = await res.json();
  currentData = data[tech][project];
  renderProject(currentData);
}

function renderProject(data) {
  const container = document.getElementById("projectView");
  container.innerHTML = "";

  const taskList = document.createElement("div");
  const taskHeader = document.createElement("h2");
  taskHeader.textContent = "Tasks";
  taskList.appendChild(taskHeader);

  data.tasks.forEach((task, i) => {
    const item = document.createElement("div");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.complete;
    checkbox.disabled = !isEditing;
    checkbox.onchange = () => {
      task.complete = checkbox.checked;
      saveData();
    };
    const label = document.createElement("span");
    label.textContent = task.name;
    item.appendChild(checkbox);
    item.appendChild(label);
    taskList.appendChild(item);
  });

  const materialList = document.createElement("div");
  const matHeader = document.createElement("h2");
  matHeader.textContent = "Materials";
  materialList.appendChild(matHeader);

  data.materials.forEach((mat, i) => {
    const item = document.createElement("div");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = mat.stage > 0;
    checkbox.disabled = !isEditing;
    checkbox.onclick = () => {
      mat.stage = (mat.stage + 1) % 4;
      saveData();
    };
    const label = document.createElement("span");
    label.textContent = `${mat.name} (Stage ${mat.stage})`;
    item.appendChild(checkbox);
    item.appendChild(label);
    materialList.appendChild(item);
  });

  container.appendChild(taskList);
  container.appendChild(materialList);
}

async function saveData() {
  const { tech, project } = getQueryParams();
  const payload = {
    [tech]: {
      [project]: currentData
    }
  };
  await fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  renderProject(currentData);
}

window.onload = loadProject;
