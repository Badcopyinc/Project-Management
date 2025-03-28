document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tech = decodeURIComponent(urlParams.get("tech"));
  const project = decodeURIComponent(urlParams.get("project"));
  document.getElementById("project-name").textContent = project;

  fetch("https://script.google.com/macros/s/AKfycbwkHVn_1Jj-qhZRCzxZlLKqD5QUugf_xpb-UQJmKPcaM72bjbNMZv2_iEb5Ga7kqfoiWQ/exec")
    .then(res => res.json())
    .then(data => {
      const projectData = data[tech]?.[project];
      if (!projectData) {
        document.getElementById("project-name").textContent = "Project Not Found";
        return;
      }

      const tasks = projectData.tasks || [];
      const materials = projectData.materials || [];

      // Render Tasks
      const taskList = document.getElementById("task-list");
      taskList.innerHTML = "";
      tasks.forEach(task => {
        const li = document.createElement("li");
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = task.complete === true || task.status === 1;
        cb.onchange = () => updateStatus(tech, project, "task", task.name, cb.checked ? 1 : 0);
        li.appendChild(cb);
        li.append(` ${task.name}`);
        taskList.appendChild(li);
      });

      // Render Materials
      const matList = document.getElementById("material-list");
      matList.innerHTML = "";
      materials.forEach(mat => {
        const li = document.createElement("li");
        li.textContent = `${mat.name} `;
        const stage = mat.stage ?? mat.status ?? 0;
        const stages = ["Picked up/on van", "On site", "Installed", "Returning"];

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = stage > 0;
        cb.onclick = () => {
          const newStage = (stage + 1) % 4;
          updateStatus(tech, project, "material", mat.name, newStage);
        };
        li.appendChild(cb);

        const stageBtn = document.createElement("span");
        stageBtn.textContent = stages[stage] || stages[0];
        stageBtn.style.color = ["gold", "red", "green", "blue"][stage] || "black";
        stageBtn.style.marginLeft = "0.5rem";
        stageBtn.onclick = () => {
          const newStage = (stage + 1) % 4;
          updateStatus(tech, project, "material", mat.name, newStage);
        };

        li.appendChild(stageBtn);
        matList.appendChild(li);
      });

      // Update Progress Bar
      const total = tasks.length + materials.length;
      const done = tasks.filter(t => t.complete === true || t.status === 1).length +
                   materials.filter(m => (m.stage ?? m.status) === 3).length;
      const percent = total ? Math.round((done / total) * 100) : 0;

      document.getElementById("progress-bar").style.width = `${percent}%`;
      document.getElementById("progress-bar").textContent = `${percent}%`;
      document.getElementById("progress-percent").textContent = `${percent}%`;
    });
});

function updateStatus(tech, project, type, name, status) {
  fetch("https://script.google.com/macros/s/AKfycbwkHVn_1Jj-qhZRCzxZlLKqD5QUugf_xpb-UQJmKPcaM72bjbNMZv2_iEb5Ga7kqfoiWQ/exec", {
    method: "POST",
    body: JSON.stringify({ tech, project, type, name, status })
  }).then(() => location.reload());
}

function addTask() {
  const name = prompt("Enter new task name");
  if (!name) return;
  updateStatus(getParam("tech"), getParam("project"), "task", name, 0);
}

function addMaterial() {
  const name = prompt("Enter new material name");
  if (!name) return;
  updateStatus(getParam("tech"), getParam("project"), "material", name, 0);
}

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}
