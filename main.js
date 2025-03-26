const technicianContainer = document.getElementById('technicianContainer');

fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiqtKsta7fndkeQKjWivVrAhBlgBFntMB74F9TkSRYAdG4Zd6SFFnad-6NEWK45uKDn5OlADFgWo66oE2n0t8OKSGbg594iDm_MqHgNfpLIpxbImrLaoT_brbmifOLzKEMAlMeA-eew4fHBE1VUBqyxJUMTaSqbQJcqigeNZjjwI7X9dF3nXi_mOSbJYh8VmIKti4ppwZuuHSUm_IfRrZnAWa4Cf-AerYmZ06F2SmBODjL6sctccCCjHBPKdRH5PUdh5PK7osu1w5MPvEBa9988XvdCs5IziMwbqlvK&lib=MkkaF6ErJhfhPZ-5m-D1_YuXGf20AjjVP')
  .then(res => res.json())
  .then(data => {
    console.log("Fetched Data:", data);
    technicianContainer.innerHTML = '';

    // Check for expected format: array of arrays
    if (!Array.isArray(data)) {
      if (data.data && Array.isArray(data.data)) {
        data = data.data;
      } else {
        technicianContainer.innerHTML = "<p style='color:red;'>Data format error. Please check the Google Sheet or Apps Script.</p>";
        throw new Error("Data format invalid");
      }
    }

    const grouped = {};
    data.forEach(row => {
      const tech = row[0], project = row[1], type = row[2], name = row[3], status = +row[4] || 0;
      if (!grouped[tech]) grouped[tech] = {};
      if (!grouped[tech][project]) grouped[tech][project] = { tasks: [], materials: [] };
      grouped[tech][project][type === "Task" ? "tasks" : "materials"].push({ name, status });
    });

    Object.entries(grouped).forEach(([tech, projects]) => {
      const techDiv = document.createElement("div");
      techDiv.className = "technician";
      techDiv.innerHTML = `<h2>${tech}</h2>`;
      
      Object.entries(projects).forEach(([projectName, { tasks, materials }]) => {
        const projectDiv = document.createElement("div");
        projectDiv.className = "project";
        const total = tasks.length + materials.length;
        const completed = tasks.filter(t => t.status === 1).length + materials.filter(m => m.status === 3).length;
        const percent = total ? Math.round((completed / total) * 100) : 0;

        projectDiv.innerHTML = `
          <h3>${projectName}</h3>
          <div class="progress-bar"><div style="width:${percent}%;"></div></div>
          <p>${percent}% Complete</p>
        `;

        techDiv.appendChild(projectDiv);
      });

      technicianContainer.appendChild(techDiv);
    });
  })
  .catch(error => {
    console.error("Data fetch error:", error);
    technicianContainer.innerHTML = "<p style='color:red;'>Failed to load project data.</p>";
  });
