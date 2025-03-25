const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwkHVn_1Jj-qhZRCzxZlLKqD5QUugf_xpb-UQJmKPcaM72bjbNMZv2_iEb5Ga7kqfoiWQ/exec";
let editMode = false;
let techProjects = {};

function fetchProjects() {
  fetch(SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      techProjects = data;
      populateDropdown();
    });
}

function saveProjects() {
  fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(techProjects),
    headers: { 'Content-Type': 'application/json' }
  });
}

function populateDropdown() {
  const techSelect = document.getElementById('techSelect');
  const techNames = Object.keys(techProjects);
  techSelect.innerHTML = '<option value="">-- Select --</option>' + techNames.map(tech => `<option value="${tech}">${tech}</option>`).join('');
}

function toggleEditMode() {
  editMode = !editMode;
  document.getElementById('techSelect').dispatchEvent(new Event('change'));
}

document.getElementById('techSelect').addEventListener('change', function () {
  const tech = this.value;
  const view = document.getElementById('projectView');
  view.innerHTML = '';
  if (techProjects[tech]) {
    Object.keys(techProjects[tech]).forEach(project => {
      const data = techProjects[tech][project];
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <strong contenteditable="${editMode}" onblur="updateProjectName('${tech}', '${project}', this.textContent)">${project}</strong>
        <div class="collapsible" onclick="toggleCollapse(this)">Tasks</div>
        <div class="collapsible-content">
          <ul>
            ${data.tasks.map((t, i) => `<li><input type="checkbox" ${t.complete ? 'checked' : ''} onchange="toggleTask('${tech}','${project}',${i},this.checked)"> ${t.name}</li>`).join('')}
          </ul>
          <div class="progress-bar"><div class="progress-fill task-fill"></div></div>
        </div>
        <div class="collapsible" onclick="toggleCollapse(this)">Materials</div>
        <div class="collapsible-content">
          <ul>
            ${data.materials.map((m, i) => `<li><button onclick="cycleStage(this,'${tech}','${project}',${i})">${m.name}</button> <span class="stage-label"></span></li>`).join('')}
          </ul>
          <div class="progress-bar"><div class="progress-fill material-fill"></div></div>
        </div>`;
      view.appendChild(card);
    });
  }
});

function toggleCollapse(el) {
  const next = el.nextElementSibling;
  next.style.display = next.style.display === 'block' ? 'none' : 'block';
}

function toggleTask(tech, project, i, checked) {
  techProjects[tech][project].tasks[i].complete = checked;
  saveProjects();
}

function updateProjectName(tech, oldName, newName) {
  if (!newName || newName === oldName) return;
  techProjects[tech][newName] = techProjects[tech][oldName];
  delete techProjects[tech][oldName];
  saveProjects();
  fetchProjects();
}

function cycleStage(btn, tech, project, i) {
  const stages = ["", "Picked up / On Van", "On Site", "Installed/Used", "Unused/RTO"];
  const colors = ["", "orange", "red", "green", "blue"];
  let current = parseInt(btn.dataset.stage || 0);
  current = (current + 1) % stages.length;
  btn.dataset.stage = current;
  btn.nextElementSibling.textContent = stages[current];
  btn.nextElementSibling.style.color = colors[current];
  techProjects[tech][project].materials[i].stage = current;
  saveProjects();
}

window.onload = fetchProjects;
