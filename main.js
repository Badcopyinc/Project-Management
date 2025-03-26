
document.addEventListener("DOMContentLoaded", function () {
  const dashboard = document.getElementById("dashboard");

  fetch("https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiqtKsta7fndkeQKjWivVrAhBlgBFntMB74F9TkSRYAdG4Zd6SFFnad-6NEWK45uKDn5OlADFgWo66oE2n0t8OKSGbg594iDm_MqHgNfpLIpxbImrLaoT_brbmifOLzKEMAlMeA-eew4fHBE1VUBqyxJUMTaSqbQJcqigeNZjjwI7X9dF3nXi_mOSbJYh8VmIKti4ppwZuuHSUm_IfRrZnAWa4Cf-AerYmZ06F2SmBODjL6sctccCCjHBPKdRH5PUdh5PK7osu1w5MPvEBa9988XvdCs5IziMwbqlvK&lib=MkkaF6ErJhfhPZ-5m-D1_YuXGf20AjjVP")
    .then(res => res.json())
    .then(data => {
      const grouped = {};

      data.forEach(row => {
        const [tech, project, type, name, status] = row;
        if (!grouped[tech]) grouped[tech] = {};
        if (!grouped[tech][project]) grouped[tech][project] = { task: [], material: [] };
        grouped[tech][project][type].push({ name, status: parseInt(status) });
      });

      dashboard.innerHTML = "";
      Object.entries(grouped).forEach(([tech, projects]) => {
        const techDiv = document.createElement("div");
        techDiv.className = "technician-section";

        const header = document.createElement("div");
        header.className = "tech-header";
        header.textContent = tech;
        header.onclick = () => {
          list.classList.toggle("hidden");
        };

        const list = document.createElement("div");
        list.className = "project-list hidden";

        Object.entries(projects).forEach(([projectName, { task, material }]) => {
          const completedTasks = task.filter(t => t.status === 1).length;
          const taskCount = task.length || 1;
          const percent = Math.round((completedTasks / taskCount) * 100);

          const proj = document.createElement("div");
          proj.className = "project-entry";
          const link = document.createElement("a");
          link.href = `project.html?tech=${tech}&project=${projectName}`;
          link.textContent = `${projectName} – ${percent}%`;

          const barWrap = document.createElement("div");
          barWrap.className = "progress-bar-bg";
          const barFill = document.createElement("div");
          barFill.className = "progress-bar-fill";
          barFill.style.width = `${percent}%`;
          barWrap.appendChild(barFill);

          proj.appendChild(link);
          proj.appendChild(barWrap);
          list.appendChild(proj);
        });

        techDiv.appendChild(header);
        techDiv.appendChild(list);
        dashboard.appendChild(techDiv);
      });
    })
    .catch(err => {
      dashboard.innerHTML = "Failed to load project data.";
      console.error(err);
    });
});
