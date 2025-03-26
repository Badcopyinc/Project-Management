
const dashboard = document.getElementById("dashboard");

fetch("https://script.google.com/macros/s/AKfycbwkHVn_1Jj-qhZRCzxZlLKqD5QUugf_xpb-UQJmKPcaM72bjbNMZv2_iEb5Ga7kqfoiWQ/exec")
  .then(res => res.json())
  .then(data => {
    dashboard.innerHTML = '';
    Object.keys(data).forEach(tech => {
      const techDiv = document.createElement('div');
      techDiv.className = 'tech';
      techDiv.textContent = tech;

      const projectContainer = document.createElement('div');
      projectContainer.className = 'project';

      Object.keys(data[tech]).forEach(project => {
        const projLink = document.createElement('a');
        projLink.href = `project.html?tech=${encodeURIComponent(tech)}&project=${encodeURIComponent(project)}`;
        const tasks = data[tech][project].tasks || [];
        const materials = data[tech][project].materials || [];
        const taskProgress = tasks.filter(t => t.complete).length / tasks.length || 0;
        const materialProgress = materials.filter(m => m.stage >= 2).length / materials.length || 0;
        const percent = Math.round(((taskProgress + materialProgress) / 2) * 100);
        projLink.textContent = `${project} - ${percent}%`;
        projectContainer.appendChild(projLink);
      });

      techDiv.addEventListener("click", () => {
        techDiv.appendChild(projectContainer);
      });

      dashboard.appendChild(techDiv);
    });
  })
  .catch(err => {
    console.error(err);
    dashboard.innerHTML = "Failed to load project data.";
  });
