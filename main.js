const technicianContainer = document.getElementById('technicianContainer');

fetch('https://script.google.com/macros/s/AKfycbwkHVn_1Jj-qhZRCzxZlLKqD5QUugf_xpb-UQJmKPcaM72bjbNMZv2_iEb5Ga7kqfoiWQ/exec')
  .then(res => res.json())
  .then(data => {
    const raw = Array.isArray(data) ? data : data.data || [];
    console.log("RAW SHEET ROWS:", raw);
    technicianContainer.innerHTML = '';

    const grouped = {};

    raw.forEach(row => { 
      const tech = row[0]; 
      const project = row[1]; 
      const type = (row[2] || "").toLowerCase(); 
      const name = row[3]; 
      const status = +row[4] || 0; 

      if (!grouped[tech]) grouped[tech] = {}; 
      if (!grouped[tech][project]) grouped[tech][project] = { tasks: [], materials: [] }; 

      if (type === "task") { 
        grouped[tech][project].tasks.push({ name, status }); 
      } else if (type === "material") { 
        grouped[tech][project].materials.push({ name, status }); 
      }
    }); 

    Object.entries(grouped).forEach(([tech, projects]) => {
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
