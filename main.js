let isEditing = false;
const savedData = JSON.parse(localStorage.getItem("trackerData")) || {
  projects: [
    {
      name: "🔴 Project A",
      tasks: [
        {
          name: "🔴 Running wire",
          subtasks: ["Run cable to Room A", "Run cable to Room B", "Run cable to Room C"]
        },
        {
          name: "🔴 Installing head and wiring head end",
          subtasks: ["Mount head end", "Wire inputs", "Test connections"]
        },
        {
          name: "🔴 Installing devices",
          subtasks: ["Install keypads", "Install cameras", "Install sensors"]
        },
        {
          name: "🔴 Testing",
          subtasks: ["Power cycle", "Verify signals", "Document results"]
        }
      ],
      materials: [
        {
          name: "🔴 Material Set A",
          subtasks: ["Readers", "Door Contacts", "DS160", "X3300", "X1320", "Cameras"]
        }
      ]
    }
  ],
  progress: {}
};

const materialStages = [
  { label: "Picked up / On Van", color: "orange", value: 1/3 },
  { label: "On Site", color: "red", value: 2/3 },
  { label: "Installed/Used", color: "green", value: 1 },
  { label: "Unused Returning to Office", color: "blue", value: 1 }
];

const saveData = () => localStorage.setItem("trackerData", JSON.stringify(savedData));
const projectsContainer = document.getElementById("projects");

function render() {
  projectsContainer.innerHTML = "";
  savedData.projects.forEach((project, pIndex) => {
    const container = document.createElement("div");
    container.className = "project";

    const title = isEditing ? document.createElement("input") : document.createElement("h2");
    if (isEditing) {
      title.type = "text";
      title.value = project.name;
      title.oninput = () => { savedData.projects[pIndex].name = title.value; saveData(); };
    } else title.textContent = project.name;
    container.appendChild(title);

    const allSubtasks = [];
    project.tasks.forEach((task, tIndex) => {
      task.subtasks.forEach((_, sIndex) => allSubtasks.push(`task_${pIndex}_${tIndex}_${sIndex}`));
    });
    project.materials.forEach((mat, mIndex) => {
      mat.subtasks.forEach((_, sIndex) => allSubtasks.push(`mat_${pIndex}_${mIndex}_${sIndex}`));
    });

    const progress = document.createElement("progress");
    progress.max = allSubtasks.length;
    progress.value = allSubtasks.reduce((total, key) => {
      const val = savedData.progress[key];
      if (typeof val === "number") {
        if (key.startsWith("mat_")) return total + materialStages[val].value;
        else return total + (val ? 1 : 0);
      }
      return total;
