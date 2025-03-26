
const SHEET_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiqtKsta7fndkeQKjWivVrAhBlgBFntMB74F9TkSRYAdG4Zd6SFFnad-6NEWK45uKDn5OlADFgWo66oE2n0t8OKSGbg594iDm_MqHgNfpLIpxbImrLaoT_brbmifOLzKEMAlMeA-eew4fHBE1VUBqyxJUMTaSqbQJcqigeNZjjwI7X9dF3nXi_mOSbJYh8VmIKti4ppwZuuHSUm_IfRrZnAWa4Cf-AerYmZ06F2SmBODjL6sctccCCjHBPKdRH5PUdh5PK7osu1w5MPvEBa9988XvdCs5IziMwbqlvK&lib=MkkaF6ErJhfhPZ-5m-D1_YuXGf20AjjVP';

async function fetchData() {
  const res = await fetch(SHEET_URL);
  return res.json();
}

function createProgressBar(percent) {
  return \`
    <div class="progress-bar">
      <div class="progress-bar-fill" style="width: \${percent}%;"></div>
    </div>\`;
}

function renderDashboard(data) {
  const container = document.getElementById("dashboard");
  container.innerHTML = "";

  Object.keys(data).forEach(tech => {
    const techDiv = document.createElement("div");
    techDiv.className = "tech-card";
    const button = document.createElement("button");
    button.textContent = tech;
    button.onclick = () => {
      const existing = techDiv.querySelector(".project-list");
      if (existing) {
        existing.remove();
      } else {
        const list = document.createElement("div");
        list.className = "project-list";
        Object.keys(data[tech]).forEach(project => {
          const tasks = data[tech][project].tasks;
          const completed = tasks.filter(t => t.complete).length;
          const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
          const link = document.createElement("a");
          link.href = \`project.html?tech=\${tech}&project=\${encodeURIComponent(project)}\`;
          link.textContent = \`\${project} – \${percent}%\`;
          list.appendChild(link);
          list.innerHTML += createProgressBar(percent);
        });
        techDiv.appendChild(list);
      }
    };
    techDiv.appendChild(button);
    container.appendChild(techDiv);
  });
}

function renderProjectView(data) {
  const url = new URLSearchParams(location.search);
  const tech = url.get("tech");
  const project = url.get("project");
  const content = document.getElementById("projectContent");

  if (!tech || !project || !data[tech] || !data[tech][project]) {
    content.innerHTML = "<p>Project not found.</p>";
    return;
  }

  const taskList = data[tech][project].tasks.map(t => {
    return \`<div><input type="checkbox" \${t.complete ? 'checked' : ''}> \${t.name}</div>\`;
  }).join("");

  const materialList = data[tech][project].materials.map(m => {
    return \`<div>\${m.name} (Stage \${m.stage})</div>\`;
  }).join("");

  content.innerHTML = \`
    <h2>\${project}</h2>
    <div class="progress-bar">
      <div class="progress-bar-fill" style="width: 50%;"></div>
    </div>
    <h3>Tasks</h3>
    \${taskList}
    <button class="add-button">+ Add Task</button>
    <h3>Materials</h3>
    \${materialList}
    <button class="add-button">+ Add Material</button>
  \`;
}

fetchData().then(data => {
  if (document.getElementById("dashboard")) renderDashboard(data);
  if (document.getElementById("projectContent")) renderProjectView(data);
});
