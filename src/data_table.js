document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document
    .getElementById("lichessTable")
    .querySelector("tbody");

  let skeystor = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    let g = key.substring(0, key.length - 8);
    let b = new Date(g);
    if (b.toString() == "Invalid Date") continue;

    if (key.includes("lichess")) {
      const data = JSON.parse(localStorage.getItem(key));

      if (Array.isArray(data)) {
        skeystor.push([g, data]);
      }
    }
  }
  skeystor.sort((a, b) => new Date(a[0]) - new Date(b[0]));
  skeystor.forEach((key) => {
    const row = document.createElement("tr");
    const keyCell = document.createElement("td");
    keyCell.textContent = key[0];
    row.appendChild(keyCell);
    const dataCell = document.createElement("td");
    let data = key[1];
    data.forEach((item) => {
      const link = document.createElement("a");
      link.href = "https://lichess.org/" + item;
      link.textContent = item;
      dataCell.appendChild(link);
    });
    row.appendChild(dataCell);

    tableBody.appendChild(row);
  });
});

var profiletoggle = document.getElementById("profilelnk");
profiletoggle.addEventListener("click", function () {
  chrome.runtime.sendMessage({ action: "open_main" });
});
