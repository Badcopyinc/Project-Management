
const scriptUrl = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiqtKsta7fndkeQKjWivVrAhBlgBFntMB74F9TkSRYAdG4Zd6SFFnad-6NEWK45uKDn5OlADFgWo66oE2n0t8OKSGbg594iDm_MqHgNfpLIpxbImrLaoT_brbmifOLzKEMAlMeA-eew4fHBE1VUBqyxJUMTaSqbQJcqigeNZjjwI7X9dF3nXi_mOSbJYh8VmIKti4ppwZuuHSUm_IfRrZnAWa4Cf-AerYmZ06F2SmBODjL6sctccCCjHBPKdRH5PUdh5PK7osu1w5MPvEBa9988XvdCs5IziMwbqlvK&lib=MkkaF6ErJhfhPZ-5m-D1_YuXGf20AjjVP";

function getParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    tech: urlParams.get("tech"),
    project: urlParams.get("project")
  };
}

async function loadProject() {
  const { tech, project } = getParams();
  const container = document.getElementById("tracker");
  try {
    const res = await fetch(scriptUrl);
    const data = await res.json();
    const projectData = data[tech]?.[project];

    if (!projectData) {
      container.innerHTML = "<p>Project not found.</p>";
      return;
    }

    container.innerHTML = `
      <h2>${project}</h2>
      <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
      <section>
        <h3>Tasks</h3>
        <ul id="taskList"></ul>
        <button onclick="addTask()">+ Add Task</button>
      </section>
      <section>
        <h3>Materials</h3>
        <ul id="materialList"></ul>
        <button onclick="addMaterial()">+ Add Material</button>
      </section>
    `;

    const taskList = document.getElementById("taskList");
    const materialList = document.getElementById("materialList");

    projectData.tasks.forEach(t => {
      const li = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = t.complete;
      checkbox.onchange = updateProgress;
      li.appendChild(checkbox);
      li.appendChild(document.createTextNode(" " + t.name));
      taskList.appendChild(li);
    });

    projectData.materials.forEach(m => {
      const li = document.createElement("li");
      li.textContent = m.name;
      materialList.appendChild(li);
    });

    updateProgress();
  } catch (e) {
    console.error(e);
    container.innerHTML = "<p>Error loading project.</p>";
  }
}

function addTask() {
  const taskName = prompt("Task name:");
  if (taskName) {
    const taskList = document.getElementById("taskList");
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.onchange = updateProgress;
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(" " + taskName));
    taskList.appendChild(li);
    updateProgress();
  }
}

function addMaterial() {
  const matName = prompt("Material name:");
  if (matName) {
    const matList = document.getElementById("materialList");
    const li = document.createElement("li");
    li.textContent = matName;
    matList.appendChild(li);
    updateProgress();
  }
}

function updateProgress() {
  const checkboxes = document.querySelectorAll("#taskList input[type='checkbox']");
  const checked = [...checkboxes].filter(cb => cb.checked).length;
  const percent = checkboxes.length ? Math.round((checked / checkboxes.length) * 100) : 0;
  document.getElementById("progressFill").style.width = percent + "%";
}

loadProject();
