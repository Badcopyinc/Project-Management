const technicianContainer = document.getElementById('technicianContainer');

fetch('https://adjusted-bluejay-gratefully.ngrok-free.app/data', {
  method: 'GET',
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
})
.then(res => res.json())
.then(data => {
  console.log("Formatted JSON loaded:", data);
  technicianContainer.innerHTML = '';

  const techs = data.technicians;
  Object.entries(techs).forEach(([techName, techData]) => {
    const techCard = document.createElement('div');
    techCard.className = 'technician-card';

    const techHeader = document.createElement('h2');
    techHeader.textContent = techName;
    techHeader.classList.add('tech-name');
    techHeader.style.cursor = 'pointer';

    const projectList = document.createElement('div');
    projectList.className = 'project-list';
    projectList.style.display = 'none';

    let totalTasks = 0;
    let completedTasks = 0;

    Object.values(techData.projects || {}).forEach(project => {
      const projectName = Object.keys(techData.projects).find(
        name => techData.projects[name] === project
      );

      const taskCount = project.tasks?.length || 0;
      const completeCount = project.tasks?.filter(t => t.complete).length || 0;

      totalTasks += taskCount;
      completedTasks += completeCount;

      const projectDiv = document.createElement('div');
      projectDiv.className = 'project-entry';
      projectDiv.innerHTML = `
        <strong>${projectName}</strong><br>
        ${Math.round((completeCount / taskCount) * 100 || 0)}% Complete
      `;
      projectList.appendChild(projectDiv);
    });

    const progressDiv = document.createElement('div');
    progressDiv.textContent = `${Math.round((completedTasks / totalTasks) * 100 || 0)}% Complete`;

    const addButton = document.createElement('button');
    addButton.textContent = '+ Add Project';
    addButton.className = 'add-project-btn';

    // Toggle logic
    techHeader.addEventListener('click', () => {
      projectList.style.display = projectList.style.display === 'none' ? 'block' : 'none';
    });

    techCard.appendChild(techHeader);
    techCard.appendChild(progressDiv);
    techCard.appendChild(projectList);
    techCard.appendChild(addButton);

    technicianContainer.appendChild(techCard);
  });
})
.catch(err => {
  console.error("Data fetch error:", err);
  technicianContainer.innerHTML = '<p style="color:red">Failed to load project data.</p>';
});
