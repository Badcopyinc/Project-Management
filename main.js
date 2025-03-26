
fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiqtKsta7fndkeQKjWivVrAhBlgBFntMB74F9TkSRYAdG4Zd6SFFnad-6NEWK45uKDn5OlADFgWo66oE2n0t8OKSGbg594iDm_MqHgNfpLIpxbImrLaoT_brbmifOLzKEMAlMeA-eew4fHBE1VUBqyxJUMTaSqbQJcqigeNZjjwI7X9dF3nXi_mOSbJYh8VmIKti4ppwZuuHSUm_IfRrZnAWa4Cf-AerYmZ06F2SmBODjL6sctccCCjHBPKdRH5PUdh5PK7osu1w5MPvEBa9988XvdCs5IziMwbqlvK&lib=MkkaF6ErJhfhPZ-5m-D1_YuXGf20AjjVP')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('tech-container');
    container.innerHTML = '';
    Object.keys(data).forEach(tech => {
      const techCard = document.createElement('div');
      techCard.className = 'tech-card';
      const title = document.createElement('h2');
      title.textContent = tech;
      techCard.appendChild(title);
      container.appendChild(techCard);
    });
  })
  .catch(err => {
    console.error("Failed to load data:", err);
    document.getElementById('tech-container').innerHTML = "<p>Error loading data.</p>";
  });
