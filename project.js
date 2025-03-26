const urlParams = new URLSearchParams(window.location.search);
const tech = urlParams.get('tech');
const project = urlParams.get('project');
fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiqtKsta7fndkeQKjWivVrAhBlgBFntMB74F9TkSRYAdG4Zd6SFFnad-6NEWK45uKDn5OlADFgWo66oE2n0t8OKSGbg594iDm_MqHgNfpLIpxbImrLaoT_brbmifOLzKEMAlMeA-eew4fHBE1VUBqyxJUMTaSqbQJcqigeNZjjwI7X9dF3nXi_mOSbJYh8VmIKti4ppwZuuHSUm_IfRrZnAWa4Cf-AerYmZ06F2SmBODjL6sctccCCjHBPKdRH5PUdh5PK7osu1w5MPvEBa9988XvdCs5IziMwbqlvK&lib=MkkaF6ErJhfhPZ-5m-D1_YuXGf20AjjVP')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('project-container');
    container.innerHTML = `<h2>${project}</h2>`;
    const taskList = data[tech][project].tasks.map(t => `
      <div><input type="checkbox" ${t.complete ? 'checked' : ''}/> ${t.name}</div>`).join('');
    const materialList = data[tech][project].materials.map(m => `
      <div>${m.name} (Stage ${m.stage})</div>`).join('');
    container.innerHTML += `<h3>Tasks</h3>${taskList}<h3>Materials</h3>${materialList}`;
  });
