
// START OF WORKING FINAL main.js
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
  { label: "Picked up / On Van", color: "orange", value: 1 / 3 },
  { label: "On Site", color: "red", value: 2 / 3 },
  { label: "Installed/Used", color: "green", value: 1 },
  { label: "Unused Returning to Office", color: "blue", value: 1 }
];

// Full render and logic continues below...
