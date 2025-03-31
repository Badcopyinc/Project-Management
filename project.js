document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const tech = params.get("tech");
  const project = params.get("project");
  document.getElementById("project-name").textContent = project;

  loadProjectData(tech, project);
});

function loadProjectData(tech, project) {
  fetch("https://adjusted-bluejay-gratefully.ngrok-free.app/data", {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  })
    .then(res => res.json())
    .then(data => {
      const projectData = data.technicians?.[tech]?.projects?.[project];
      if (!projectData) {
        document.getElementById("project-name").textContent = "Project Not Found";
        return;
      }

      const tasks = projectData.tasks || [];
      const materials = projectData.materials || [];
      const scopeText = projectData.scope || "No scope of work provided.";

      document.getElementById("scope-text").textContent = scopeText;

      const taskList = document.getElementById("task-list");
taskList.innerHTML = "";

tasks.forEach(task => {
  const li = document.createElement("li");

  const cb = document.createElement("input");
  cb.type = "checkbox";

  const subtasks = task.subtasks || [];
  const subDone = subtasks.filter(st => st.status === 1).length;
  const isComplete = subtasks.length > 0 ? subDone === subtasks.length : task.complete === true || task.status === 1;

  cb.checked = isComplete;
  cb.disabled = true;

  const taskLabel = document.createElement("span");
  taskLabel.textContent = ` ${task.name}`;
  taskLabel.className = "clickable-label";
  taskLabel.onclick = () => {
    subUl.classList.toggle("hidden");
  };

  li.appendChild(cb);
  li.appendChild(taskLabel);

  const subUl = document.createElement("ul");
  subUl.classList.add("hidden");

  subtasks.forEach(sub => {
    const subLi = document.createElement("li");
    const subCb = document.createElement("input");
    subCb.type = "checkbox";
    subCb.checked = sub.status === 1;

    subCb.onchange = () => {
      updateStatus(tech, project, "subtask", `${task.name}|${sub.name}`, subCb.checked ? 1 : 0, () => loadProjectData(tech, project));
    };

    subLi.appendChild(subCb);
    subLi.append(` ${sub.name}`);
    subUl.appendChild(subLi);
  });

  // Add subtask input
  const addSubLi = document.createElement("li");
  const subInput = document.createElement("input");
  subInput.type = "text";
  subInput.placeholder = "Add subtask";
  subInput.onkeydown = (e) => {
    if (e.key === "Enter" && subInput.value.trim()) {
      saveNewItem("subtask", `${task.name}|${subInput.value.trim()}`);
    }
  };
  addSubLi.appendChild(subInput);
  subUl.appendChild(addSubLi);

  li.appendChild(subUl);
  taskList.appendChild(li);
});

  // Add Subtask button
  const addBtn = document.createElement("button");
  addBtn.textContent = "+ Add Subtask";
  addBtn.className = "add-task-btn";
  subUl.appendChild(addBtn); // Optionally add logic to hook it up
  li.appendChild(subUl);
  taskList.appendChild(li);
});
      const matList = document.getElementById("material-list");
      matList.innerHTML = "";
      const stages = ["Picked up/on van", "On site", "Installed", "Returning"];
      const colors = ["gold", "red", "green", "blue"];

      materials.forEach((mat, index) => {
  const li = document.createElement("li");
  const stage = mat.stage ?? mat.status ?? 0;

  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.checked = stage > 0;
  cb.onclick = () => {
    const current = materials[index].stage ?? 0;
    const nextStage = (current + 1) % 4;
    updateStatus(tech, project, "material", mat.name, nextStage, () => loadProjectData(tech, project));
  };

  const label = document.createElement("span");
  label.textContent = ` ${mat.name}`;
  label.classList.add("clickable-label");
  label.onclick = () => {
    subUl.classList.toggle("expanded");
  };

  const stageBtn = document.createElement("span");
  stageBtn.textContent = stages[stage] || stages[0];
  stageBtn.className = [
    "material-stage-yellow",
    "material-stage-red",
    "material-stage-green",
    "material-stage-blue"
  ][stage] || "";
  stageBtn.style.marginLeft = "0.5rem";
  stageBtn.style.cursor = "pointer";
  stageBtn.onclick = () => {
    const current = materials[index].stage ?? 0;
    const nextStage = (current + 1) % 4;
    updateStatus(tech, project, "material", mat.name, nextStage, () => loadProjectData(tech, project));
  };

  li.appendChild(cb);
  li.appendChild(label);
  li.appendChild(stageBtn);

  const subUl = document.createElement("ul");
  subUl.classList.add("collapsible-content");

  // Sub-materials would be rendered here if needed
  const addSubMat = document.createElement("button");
  addSubMat.textContent = "+ Add Sub-Material";
  addSubMat.className = "add-task-btn";
  subUl.appendChild(addSubMat);

  li.appendChild(subUl);
  matList.appendChild(li);
});
      const total = tasks.reduce((sum, t) => sum + (t.subtasks?.length || 1), 0) + materials.length;
      const done = tasks.reduce((sum, t) => {
        if (t.subtasks?.length) {
          return sum + t.subtasks.filter(st => st.status === 1).length;
        } else {
          return sum + ((t.complete || t.status === 1) ? 1 : 0);
        }
      }, 0) + materials.filter(m => (m.stage ?? m.status) === 3).length;

      const percent = total ? Math.round((done / total) * 100) : 0;

      document.getElementById("progress-bar").style.width = `${percent}%`;
      document.getElementById("progress-bar").textContent = `${percent}%`;
    });
}

function updateStatus(tech, project, type, name, status, callback) {
  fetch("https://adjusted-bluejay-gratefully.ngrok-free.app/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tech,
      project,
      type,
      name,
      status,
      updatedBy: "Technician"
    })
  })
    .then(res => res.text())
    .then(text => {
      if (text === "Success") {
        callback?.();
      } else {
        console.error("Update failed:", text);
      }
    })
    .catch(err => console.error("Update error:", err));
}

function addTask() {
  const taskList = document.getElementById("task-list");
  const li = document.createElement("li");
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "New task name";
  input.onkeydown = (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      saveNewItem("task", input.value.trim());
    }
  };
  li.appendChild(input);
  taskList.appendChild(li);
  input.focus();
}

function addMaterial() {
  const matList = document.getElementById("material-list");
  const li = document.createElement("li");
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "New material name";
  input.onkeydown = (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      saveNewItem("material", input.value.trim());
    }
  };
  li.appendChild(input);
  matList.appendChild(li);
  input.focus();
}

function saveNewItem(type, name) {
  const params = new URLSearchParams(window.location.search);
  const tech = params.get("tech");
  const project = params.get("project");

  fetch("https://adjusted-bluejay-gratefully.ngrok-free.app/addItem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tech,
      project,
      type,
      name,
      updatedBy: "Technician"
    })
  })
    .then(res => res.text())
    .then((res) => {
      if (res === "Success") {
        loadProjectData(tech, project);
      } else {
        alert("Failed to add " + type);
      }
    })
    .catch(err => console.error("Add error:", err));
}

// ✅ Needed for collapsible sections to function
function toggleSection(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle("expanded");
}
