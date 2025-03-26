fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiqtKsta7fndkeQKjWivVrAhBlgBFntMB74F9TkSRYAdG4Zd6SFFnad-6NEWK45uKDn5OlADFgWo66oE2n0t8OKSGbg594iDm_MqHgNfpLIpxbImrLaoT_brbmifOLzKEMAlMeA-eew4fHBE1VUBqyxJUMTaSqbQJcqigeNZjjwI7X9dF3nXi_mOSbJYh8VmIKti4ppwZuuHSUm_IfRrZnAWa4Cf-AerYmZ06F2SmBODjL6sctccCCjHBPKdRH5PUdh5PK7osu1w5MPvEBa9988XvdCs5IziMwbqlvK&lib=MkkaF6ErJhfhPZ-5m-D1_YuXGf20AjjVP')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('tech-list');
    container.innerHTML = '';
    Object.keys(data).forEach(tech => {
      const card = document.createElement('div');
      card.className = 'tech-card';
      
    card.innerHTML = `
      <h2 style="text-align:center; cursor:pointer;">${tech}</h2>
      <div class="project-section" style="display:none;" id="section-${tech.replace(/\s+/g, '')}"></div>
    `;
    card.querySelector('h2').addEventListener('click', () => {
      const section = document.getElementById("section-" + tech.replace(/\s+/g, ""));
      section.style.display = section.style.display === "none" ? "block" : "none";
    });
    
      Object.keys(data[tech]).forEach(project => {
        const projectData = data[tech][project];
        const totalTasks = projectData.tasks.length;
        const completedTasks = projectData.tasks.filter(t => t.complete).length;
        const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
        card.innerHTML += `
          <a href="project.html?tech=${encodeURIComponent(tech)}&project=${encodeURIComponent(project)}">${project} – ${progress}%</a>
          <div style="background:#ccc;height:8px;border-radius:5px;">
            <div style="background:#007bff;height:8px;width:${progress}%;border-radius:5px;"></div>
          </div>`;
      });
      container.appendChild(card);
    });
  });
