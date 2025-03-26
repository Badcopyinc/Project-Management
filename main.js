
const SCRIPT_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiqtKsta7fndkeQKjWivVrAhBlgBFntMB74F9TkSRYAdG4Zd6SFFnad-6NEWK45uKDn5OlADFgWo66oE2n0t8OKSGbg594iDm_MqHgNfpLIpxbImrLaoT_brbmifOLzKEMAlMeA-eew4fHBE1VUBqyxJUMTaSqbQJcqigeNZjjwI7X9dF3nXi_mOSbJYh8VmIKti4ppwZuuHSUm_IfRrZnAWa4Cf-AerYmZ06F2SmBODjL6sctccCCjHBPKdRH5PUdh5PK7osu1w5MPvEBa9988XvdCs5IziMwbqlvK&lib=MkkaF6ErJhfhPZ-5m-D1_YuXGf20AjjVP";

async function loadDashboard() {
  const dashboard = document.getElementById("dashboard");
  dashboard.innerHTML = "Loading...";
  try {
    const res = await fetch(SCRIPT_URL);
    const data = await res.json();
    dashboard.innerHTML = "";

    Object.keys(data).forEach(tech => {
      const techDiv = document.createElement("div");
      techDiv.className = "tech-button";
      techDiv.textContent = tech;

      const projectsContainer = document.createElement("div");
      projectsContainer.style.display = "none";

      Object.keys(data[tech]).forEach(project => {
        const proj = data[tech][project];
        const totalTasks = proj.tasks.length;
        const completedTasks = proj.tasks.filter(t => t.complete).length;
        const totalMaterials = proj.materials.length;
        const completedMaterials = proj.materials.filter(m => m.stage >= 2).length;
        const taskPercent = totalTasks ? completedTasks / totalTasks : 0;
        const matPercent = totalMaterials ? completedMaterials / totalMaterials : 0;
        const avg = Math.round(((taskPercent + matPercent) / 2) * 100);

        const projectLink = document.createElement("a");
        projectLink.href = `project.html?tech=${encodeURIComponent(tech)}&project=${encodeURIComponent(project)}`;
        projectLink.className = "project-link";
        projectLink.textContent = `${project} – ${avg}%`;
        projectsContainer.appendChild(projectLink);
      });

      techDiv.addEventListener("click", () => {
        projectsContainer.style.display = projectsContainer.style.display === "none" ? "block" : "none";
      });

      dashboard.appendChild(techDiv);
      dashboard.appendChild(projectsContainer);
    });
  } catch (err) {
    dashboard.innerHTML = "Failed to load project data.";
    console.error(err);
  }
}

if (document.getElementById("dashboard")) loadDashboard();
