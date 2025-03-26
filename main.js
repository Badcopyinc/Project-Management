const technicianContainer = document.getElementById('technicianContainer');

fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiqtKsta7fndkeQKjWivVrAhBlgBFntMB74F9TkSRYAdG4Zd6SFFnad-6NEWK45uKDn5OlADFgWo66oE2n0t8OKSGbg594iDm_MqHgNfpLIpxbImrLaoT_brbmifOLzKEMAlMeA-eew4fHBE1VUBqyxJUMTaSqbQJcqigeNZjjwI7X9dF3nXi_mOSbJYh8VmIKti4ppwZuuHSUm_IfRrZnAWa4Cf-AerYmZ06F2SmBODjL6sctccCCjHBPKdRH5PUdh5PK7osu1w5MPvEBa9988XvdCs5IziMwbqlvK&lib=MkkaF6ErJhfhPZ-5m-D1_YuXGf20AjjVP')
  .then(res => res.json())
  .then(data => {
    console.log("Formatted JSON loaded:", data);
    technicianContainer.innerHTML = '';

    Object.entries(data).forEach(([tech, projects]) => {
      const techDiv = document.createElement("div");
      techDiv.className = "technician-card";
      techDiv.innerHTML = `<h2>${tech}</h2>`;

      Object.entries(projects).forEach(([projectName, projectData]) => {
        const tasks = projectData.tasks || [];
        const materials = projectData.materials || [];

        const total = tasks.length + materials.length;
        const completed = tasks.filter(t => t.status === 1).length + materials.filter(m => m.status === 3).length;
        const percent = total ? Math.round((completed / total) * 100) : 0;

        const projectHTML = `
          <div class="project">
            <p class="project-name">${projectName}</p>
            <div class="progress-bar-container">
              <div class="progress-bar" style="width:${percent}%"></div>
            </div>
            <p>${percent}% Complete</p>
          </div>
        `;

        techDiv.innerHTML += projectHTML;
      });

      technicianContainer.appendChild(techDiv);
    });
  })
  .catch(error => {
    console.error("Data fetch error:", error);
    technicianContainer.innerHTML = "<p style='color:red;'>Failed to load project data.</p>";
  });
