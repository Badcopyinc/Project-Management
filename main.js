
// Fetch data and render the dashboard
async function loadDashboard() {
  try {
    const res = await fetch(SCRIPT_URL);
    const data = await res.json();
    const container = document.getElementById("dashboard");
    container.innerHTML = "";

    Object.keys(data).forEach(tech => {
      const techDiv = document.createElement("div");
      const techTitle = document.createElement("h2");
      techTitle.textContent = tech;
      techDiv.appendChild(techTitle);

      Object.keys(data[tech]).forEach(project => {
        const projLink = document.createElement("a");
        projLink.href = `project.html?tech=${encodeURIComponent(tech)}&project=${encodeURIComponent(project)}`;
        projLink.textContent = `${project}`;
        projLink.style.display = "block";
        techDiv.appendChild(projLink);
      });

      container.appendChild(techDiv);
    });
  } catch (err) {
    document.getElementById("dashboard").innerHTML = "Failed to load project data.";
    console.error("Error loading data:", err);
  }
}

window.onload = loadDashboard;
