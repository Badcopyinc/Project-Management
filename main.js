const technicianContainer = document.getElementById('technicianContainer');

fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiqtKsta7fndkeQKjWivVrAhBlgBFntMB74F9TkSRYAdG4Zd6SFFnad-6NEWK45uKDn5OlADFgWo66oE2n0t8OKSGbg594iDm_MqHgNfpLIpxbImrLaoT_brbmifOLzKEMAlMeA-eew4fHBE1VUBqyxJUMTaSqbQJcqigeNZjjwI7X9dF3nXi_mOSbJYh8VmIKti4ppwZuuHSUm_IfRrZnAWa4Cf-AerYmZ06F2SmBODjL6sctccCCjHBPKdRH5PUdh5PK7osu1w5MPvEBa9988XvdCs5IziMwbqlvK&lib=MkkaF6ErJhfhPZ-5m-D1_YuXGf20AjjVP')
  .then(res => res.json())
  .then(data => {
    console.log("Formatted JSON loaded:", data);
    technicianContainer.innerHTML = '';

    Object.entries(data).forEach(([tech, projects]) => {
      const techDiv = document.createElement("div");
      techDiv.className = "technician-card";

      const techHeader = document.createElement("h2");
      techHeader.textContent = tech;
      techHeader.style.cursor = "pointer";

      const projectList = document.createElement("div");
      projectList.style.display = "none";
      projectList.className = "project-list";

      // Add collapse toggle
      techHeader.addEventListener("click", () => {
        projectList.style.display = projectList.style.display === "none" ? "block" : "none";
      });

      // Render existing projects
      Object.entries(projects).forEach(([projectName, projectData]) => {
        const tasks = projectData.tasks || [];
        const materials = projectData.materials || [];

        const total = tasks.length + materials.length;
        const completed = tasks.filter(t => t.status === 1).length + materials.filter(m => m.status === 3).length;
        const percent = total ? Math.round((completed / total) * 100) : 0;

        const projectDiv = document.createElement("div");
        projectDiv.className = "project-row";
        projectDiv.innerHTML = `
          <span class="project-name">${projectName}</span>
          <div class="progress-wrapper">
            <div class="progress-bar-inline">
              <div class="progress-bar-fill" style="width:${percent}%">${percent}%</div>
            </div>
          </div>
        `;

        projectList.appendChild(projectDiv);
      });

      // Create add project button + input
      const addBtn = document.createElement("button");
      addBtn.textContent = "+ Add Project";
      addBtn.className = "add-project-btn";

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Enter project name";
      input.style.display = "none";
      input.className = "add-project-input";

      // Add project button toggle
      addBtn.addEventListener("click", () => {
        input.style.display = input.style.display === "none" ? "block" : "none";
        if (input.style.display === "block") input.focus();
      });

      // Add project on Enter
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && input.value.trim()) {
          const newProjectName = input.value.trim();
          const projectDiv = document.createElement("div");
          projectDiv.className = "project-row";
          projectDiv.innerHTML = `
            <span class="project-name">${newProjectName}</span>
            <div class="progress-wrapper">
              <div class="progress-bar-inline">
                <div class="progress-bar-fill" style="width:0%">0%</div>
              </div>
            </div>
          `;
          projectList.appendChild(projectDiv);
          projectList.appendChild(addBtn);
          projectList.appendChild(input);
          input.value = "";
          input.style.display = "none";
        }
      });

      // Append button/input to projectList initially (only shows when expanded)
      projectList.appendChild(addBtn);
      projectList.appendChild(input);

      // Build the tech card
      techDiv.appendChild(techHeader);
      techDiv.appendChild(projectList);
      technicianContainer.appendChild(techDiv);
    });
  })
  .catch(error => {
    console.error("Data fetch error:", error);
    technicianContainer.innerHTML = "<p style='color:red;'>Failed to load project data.</p>";
  });
