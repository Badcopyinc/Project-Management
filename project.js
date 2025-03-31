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
        const isComplete = subtasks.length > 0
          ? subDone === subtasks.length
          : task.complete === true || task.status === 1;

        cb.checked = isComplete;
        cb.disabled = true;

        li.appendChild(cb);
        li.append(` ${task.name}`);

        taskList.appendChild(li);
      });

      const matList = document.getElementById("material-list");
      matList.innerHTML = "";
      const stages = ["Picked up/on van", "On site", "Installed", "Returning"];
      const colors = ["gold", "red", "green", "blue"];

      materials.forEach((mat, index) => {
        const li = document.createElement("li");
        li.textContent = `${mat.name} `;

        const stage = mat.stage ?? mat.status ?? 0;

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = stage > 0;
        cb.onclick = () => {
          const current = materials[index].stage ?? 0;
          const nextStage = (current + 1) % 4;
          updateStatus(tech, project, "material", mat.name, nextStage, () => loadProjectData(tech, project));
        };
        li.appendChild(cb);

        const stageBtn = document.createElement("span");
        stageBtn.textContent = stages[stage] || stages[0];
        stageBtn.style.color = colors[stage] || "black";
        stageBtn.style.marginLeft = "0.5rem";
        stageBtn.style.cursor = "pointer";
        stageBtn.onclick = () => {
          const current = materials[index].stage ?? 0;
          const nextStage = (current + 1) % 4;
          updateStatus(tech, project, "material", mat.name, nextStage, () => loadProjectData(tech, project));
        };

        li.appendChild(stageBtn);
        matList.appendChild(li);
      });

      // ✅ Fixed: Progress calculation that includes subtasks
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
      const percentText = document.getElementById("progress-percent");
      if (percentText) percentText.textContent = `${percent}%`;
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

// ✅ Restored for collapsible sections (Tasks, Materials, Scope)
function toggleSection(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle("expanded");
}
