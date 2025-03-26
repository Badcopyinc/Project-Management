const technicianContainer = document.getElementById('technicianContainer');
fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiqtKsta7fndkeQKjWivVrAhBlgBFntMB74F9TkSRYAdG4Zd6SFFnad-6NEWK45uKDn5OlADFgWo66oE2n0t8OKSGbg594iDm_MqHgNfpLIpxbImrLaoT_brbmifOLzKEMAlMeA-eew4fHBE1VUBqyxJUMTaSqbQJcqigeNZjjwI7X9dF3nXi_mOSbJYh8VmIKti4ppwZuuHSUm_IfRrZnAWa4Cf-AerYmZ06F2SmBODjL6sctccCCjHBPKdRH5PUdh5PK7osu1w5MPvEBa9988XvdCs5IziMwbqlvK&lib=MkkaF6ErJhfhPZ-5m-D1_YuXGf20AjjVP')
  .then(res => res.json())
  .then(data => {
    technicianContainer.innerHTML = '';
    if (!Array.isArray(data)) throw new Error("Data format invalid");
    const grouped = {};
    data.forEach(row => {
      const tech = row[0], project = row[1], type = row[2], name = row[3], status = +row[4] || 0;
      if (!grouped[tech]) grouped[tech] = {};
      if (!grouped[tech][project]) grouped[tech][project] = { tasks: [], materials: [] };
      grouped[tech][project][type === 'task' ? 'tasks' : 'materials'].push({ name, status });
    });

    Object.entries(grouped).forEach(([tech, projects]) => {
      const card = document.createElement('div');
      card.className = 'technician-card';
      const techTitle = document.createElement('h2');
      techTitle.textContent = tech;
      card.appendChild(techTitle);

      Object.entries(projects).forEach(([project, { tasks, materials }]) => {
        const total = tasks.length + materials.length * 3;
        const completed = tasks.filter(t => t.status).length + materials.reduce((sum, m) => sum + m.status, 0);
        const percent = Math.round((completed / total) * 100 || 0);

        const link = document.createElement('a');
        link.href = `project.html?tech=${encodeURIComponent(tech)}&project=${encodeURIComponent(project)}`;
        link.className = 'project-name';
        link.textContent = `${project} – ${percent}%`;
        card.appendChild(link);

        const barContainer = document.createElement('div');
        barContainer.className = 'progress-bar-container';
        const bar = document.createElement('div');
        bar.className = 'progress-bar';
        bar.style.width = percent + '%';
        barContainer.appendChild(bar);
        card.appendChild(barContainer);
      });

      technicianContainer.appendChild(card);
    });
  })
  .catch(err => {
    console.error(err);
    technicianContainer.innerHTML = '<p>Failed to load project data.</p>';
  });