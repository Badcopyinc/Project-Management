
fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiqtKsta7fndkeQKjWivVrAhBlgBFntMB74F9TkSRYAdG4Zd6SFFnad-6NEWK45uKDn5OlADFgWo66oE2n0t8OKSGbg594iDm_MqHgNfpLIpxbImrLaoT_brbmifOLzKEMAlMeA-eew4fHBE1VUBqyxJUMTaSqbQJcqigeNZjjwI7X9dF3nXi_mOSbJYh8VmIKti4ppwZuuHSUm_IfRrZnAWa4Cf-AerYmZ06F2SmBODjL6sctccCCjHBPKdRH5PUdh5PK7osu1w5MPvEBa9988XvdCs5IziMwbqlvK&lib=MkkaF6ErJhfhPZ-5m-D1_YuXGf20AjjVP')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('tech-container');
    container.innerHTML = '';
    
function calculateProgress(tasks, materials) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.complete).length;
  const taskProgress = totalTasks ? completedTasks / totalTasks : 0;

  const totalMaterials = materials.length * 3;
  const completedMaterials = materials.reduce((sum, m) => sum + Math.min(m.stage, 3), 0);
  const materialProgress = totalMaterials ? completedMaterials / totalMaterials : 0;

  return Math.round(((taskProgress + materialProgress) / 2) * 100);
}


    Object.keys(data).forEach(tech => {

      const techCard = document.createElement('div');
      techCard.className = 'tech-card';
      const title = document.createElement('h2');
      
    title.textContent = tech;
    title.addEventListener('click', () => {
      const list = techCard.querySelector('.project-list');
      if (list) list.style.display = list.style.display === 'none' ? 'block' : 'none';
    });

      
    techCard.appendChild(title);
    const projectList = document.createElement('div');
    projectList.className = 'project-list';

    Object.keys(data[tech]).forEach(project => {
      const proj = data[tech][project];
      const progress = calculateProgress(proj.tasks, proj.materials);

      const projEntry = document.createElement('div');
      projEntry.innerHTML = `
        <div>
          <a href="project.html?tech=${encodeURIComponent(tech)}&project=${encodeURIComponent(project)}">
            ${project} – ${progress}%
          </a>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${progress}%;"></div>
          </div>
        </div>
      `;
      projectList.appendChild(projEntry);
    });

    const addContainer = document.createElement('div');
    addContainer.className = 'add-project-container';
    addContainer.innerHTML = `
      <button onclick="addProject('${tech}')">+ Add Project</button>
    `;
    projectList.appendChild(addContainer);
    techCard.appendChild(projectList);

      container.appendChild(techCard);
    });
  })
  .catch(err => {
    console.error("Failed to load data:", err);
    document.getElementById('tech-container').innerHTML = "<p>Error loading data.</p>";
  });

function addProject(tech) {
  const name = prompt("Enter a project name:");
  if (!name) return;

  fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiqtKsta7fndkeQKjWivVrAhBlgBFntMB74F9TkSRYAdG4Zd6SFFnad-6NEWK45uKDn5OlADFgWo66oE2n0t8OKSGbg594iDm_MqHgNfpLIpxbImrLaoT_brbmifOLzKEMAlMeA-eew4fHBE1VUBqyxJUMTaSqbQJcqigeNZjjwI7X9dF3nXi_mOSbJYh8VmIKti4ppwZuuHSUm_IfRrZnAWa4Cf-AerYmZ06F2SmBODjL6sctccCCjHBPKdRH5PUdh5PK7osu1w5MPvEBa9988XvdCs5IziMwbqlvK&lib=MkkaF6ErJhfhPZ-5m-D1_YuXGf20AjjVP')
    .then(response => response.json())
    .then(data => {
      if (!data[tech]) data[tech] = {};
      data[tech][name] = {
        tasks: [{ name: "Task A", complete: false }, { name: "Task B", complete: false }],
        materials: [{ name: "Material A", stage: 0 }, { name: "Material B", stage: 0 }]
      };

      return fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiqtKsta7fndkeQKjWivVrAhBlgBFntMB74F9TkSRYAdG4Zd6SFFnad-6NEWK45uKDn5OlADFgWo66oE2n0t8OKSGbg594iDm_MqHgNfpLIpxbImrLaoT_brbmifOLzKEMAlMeA-eew4fHBE1VUBqyxJUMTaSqbQJcqigeNZjjwI7X9dF3nXi_mOSbJYh8VmIKti4ppwZuuHSUm_IfRrZnAWa4Cf-AerYmZ06F2SmBODjL6sctccCCjHBPKdRH5PUdh5PK7osu1w5MPvEBa9988XvdCs5IziMwbqlvK&lib=MkkaF6ErJhfhPZ-5m-D1_YuXGf20AjjVP', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    })
    .then(() => {
      window.location.href = `project.html?tech=${encodeURIComponent(tech)}&project=${encodeURIComponent(name)}`;
    })
    .catch(err => {
      alert("Failed to add project.");
      console.error(err);
    });
}
