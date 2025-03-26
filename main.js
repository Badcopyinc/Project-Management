
const SHEET_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiqtKsta7fndkeQKjWivVrAhBlgBFntMB74F9TkSRYAdG4Zd6SFFnad-6NEWK45uKDn5OlADFgWo66oE2n0t8OKSGbg594iDm_MqHgNfpLIpxbImrLaoT_brbmifOLzKEMAlMeA-eew4fHBE1VUBqyxJUMTaSqbQJcqigeNZjjwI7X9dF3nXi_mOSbJYh8VmIKti4ppwZuuHSUm_IfRrZnAWa4Cf-AerYmZ06F2SmBODjL6sctccCCjHBPKdRH5PUdh5PK7osu1w5MPvEBa9988XvdCs5IziMwbqlvK&lib=MkkaF6ErJhfhPZ-5m-D1_YuXGf20AjjVP";

async function loadData() {
  const techList = document.getElementById("techList");
  techList.innerHTML = "Loading...";
  try {
    const res = await fetch(SHEET_URL);
    const data = await res.json();
    techList.innerHTML = "";

    Object.entries(data).forEach(([tech, projects]) => {
      const techDiv = document.createElement("div");
      techDiv.className = "tech";

      const techTitle = document.createElement("div");
      techTitle.innerHTML = `<strong>${tech}</strong>`;
      techDiv.appendChild(techTitle);

      Object.entries(projects).forEach(([project, obj]) => {
        const taskTotal = obj.tasks.length;
        const taskDone = obj.tasks.filter(t => t.complete).length;
        const matTotal = obj.materials.length;
        const matDone = obj.materials.filter(m => m.stage >= 3).length;
        const total = taskTotal + matTotal;
        const done = taskDone + matDone;
        const percent = total ? Math.round((done / total) * 100) : 0;

        const projDiv = document.createElement("div");
        projDiv.className = "project-entry";
        projDiv.innerHTML = \`
          <a href="project.html?tech=\${encodeURIComponent(tech)}&project=\${encodeURIComponent(project)}">\${project} – \${percent}%</a>
          <div class="progress-bar"><div class="progress-fill" style="width: \${percent}%"></div></div>
        \`;
        techDiv.appendChild(projDiv);
      });

      const addBtn = document.createElement("button");
      addBtn.className = "add-project-btn";
      addBtn.textContent = "+ Add Project";
      addBtn.onclick = () => {
        const name = prompt("Enter a project name:");
        if (name) {
          window.location.href = \`project.html?tech=\${encodeURIComponent(tech)}&project=\${encodeURIComponent(name)}\`;
        }
      };
      techDiv.appendChild(addBtn);

      techList.appendChild(techDiv);
    });
  } catch (err) {
    console.error(err);
    techList.textContent = "Failed to load data.";
  }
}

loadData();
