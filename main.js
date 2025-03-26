
document.addEventListener("DOMContentLoaded", () => {
  const techData = {
    Chris: [{ name: "Project A", percent: 25 }],
    Mike: [{ name: "Project B", percent: 50 }],
  };

  const container = document.getElementById("tech-list");
  container.innerHTML = "";

  for (const [tech, projects] of Object.entries(techData)) {
    const techEl = document.createElement("div");
    techEl.className = "tech";
    techEl.textContent = tech;
    container.appendChild(techEl);

    projects.forEach(proj => {
      const projEl = document.createElement("div");
      projEl.className = "project";
      projEl.innerHTML = \`
        <a href="project.html?tech=\${tech}&project=\${encodeURIComponent(proj.name)}">\${proj.name} – \${proj.percent}%</a>
        <div class="progress-container">
          <div class="progress-bar" style="width: \${proj.percent}%"></div>
        </div>
      \`;
      container.appendChild(projEl);
    });
  }
});
