
function addTechnician() {
  const name = prompt("Enter technician name:");
  if (name) {
    const techDiv = document.createElement("div");
    techDiv.innerHTML = `<h3>${name} <button onclick="addProject('${name}')">+ Add Project</button></h3><div id="${name}-projects"></div>`;
    document.getElementById("techList").appendChild(techDiv);
  }
}

function addProject(techName) {
  const project = prompt("Enter project name:");
  if (project) {
    const projectDiv = document.createElement("div");
    projectDiv.innerHTML = `<h4>${project} 
      <button onclick="addTask('${techName}', '${project}')">+ Task</button> 
      <button onclick="addMaterial('${techName}', '${project}')">+ Material</button>
    </h4>`;
    document.getElementById(`${techName}-projects`).appendChild(projectDiv);
  }
}

function addTask(tech, project) {
  alert(`Add task to ${project} for ${tech}`);
}

function addMaterial(tech, project) {
  alert(`Add material to ${project} for ${tech}`);
}
