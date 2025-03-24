
// 🔴 Customize your projects and tasks here
const projectsData = [
  {
    name: "🔴 Project A",
    tasks: [
      "🔴 Running wire",
      "🔴 Installing head and wiring head end",
      "🔴 Installing devices",
      "🔴 Testing"
    ]
  },
  {
    name: "🔴 Project B",
    tasks: [
      "🔴 Step 1",
      "🔴 Step 2",
      "🔴 Step 3"
    ]
  }
];

const projectsContainer = document.getElementById("projects");

projectsData.forEach((project, index) => {
  const saved = JSON.parse(localStorage.getItem("project_" + index)) || [];

  const container = document.createElement("div");
  container.className = "project";

  const title = document.createElement("h2");
  title.textContent = project.name;
  container.appendChild(title);

  const progress = document.createElement("progress");
  progress.max = project.tasks.length;
  progress.value = saved.filter(Boolean).length;
  container.appendChild(progress);

  project.tasks.forEach((task, taskIndex) => {
    const div = document.createElement("div");
    div.className = "task";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = saved[taskIndex] || false;
    checkbox.onchange = () => {
      saved[taskIndex] = checkbox.checked;
      localStorage.setItem("project_" + index, JSON.stringify(saved));
      progress.value = saved.filter(Boolean).length;
    };

    const label = document.createElement("label");
    label.textContent = task;
    label.style.marginLeft = "0.5rem";

    div.appendChild(checkbox);
    div.appendChild(label);
    container.appendChild(div);
  });

  projectsContainer.appendChild(container);
});
