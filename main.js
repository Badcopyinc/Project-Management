const technicianContainer = document.getElementById('technicianContainer');

fetch('https://adjusted-bluejay-gratefully.ngrok-free.app/data')
')
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
        projectDiv.className = "project";
        projectDiv.innerHTML = `
          <a href="project.html?tech=${encodeURIComponent(tech)}&project=${encodeURIComponent(projectName)}" class="project-name">${projectName}</a>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width:${percent}%"></div>
          </div>
          <p>${percent}% Complete</p>
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
          projectDiv.className = "project";
          projectDiv.innerHTML = `
            <p class="project-name">${newProjectName}</p>
            <div class="progress-bar-container">
              <div class="progress-bar" style="width:0%"></div>
            </div>
            <p>0% Complete</p>
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
