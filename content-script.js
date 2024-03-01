function scrapeMovesFromPage() {
  function getNotation(wm, bm) {
    let wfig = null;
    let bfig = null;
    if (wm) {
      wfig = wm.getElementsByTagName("span")[0];
    }
    if (bm) {
      bfig = bm.getElementsByTagName("span")[0];
    }
    if (wfig) {
      wfig = wfig.getAttribute("data-figurine");
    }
    if (bfig) {
      bfig = bfig.getAttribute("data-figurine");
    }
    return [wfig, bfig];
  }
  let wmoves = document.body.getElementsByClassName("white node");
  let bmoves = document.body.getElementsByClassName("black node");
  let om = document.body.getElementsByClassName("eco-opening-name");
  om = Array.from(om);
  wmoves = Array.from(wmoves);
  bmoves = Array.from(bmoves);
  om = om.some(
    (item) =>
      item.textContent.includes("Starting") ||
      item.textContent.includes("Starting Position"),
  );
  if (om) {
    chrome.runtime.sendMessage({ data: ["newgame"], action: "scrapedData" });
    return;
  }
  let movearray = [];
  if (wmoves.length || bmoves.length) {
    let l = Math.min(wmoves.length, bmoves.length);
    for (let i = 0; i < l; i++) {
      let [z, y] = getNotation(wmoves[i], bmoves[i]);

      movearray.push(`${z || ""}${wmoves[i].textContent.replace("+", "")}`);
      movearray.push(`${y || ""}${bmoves[i].textContent.replace("+", "")}`);
    }
    if (movearray.length < wmoves.length + bmoves.length) {
      if (wmoves.length < bmoves.length) {
        let [g, c] = getNotation(null, bmoves[bmoves.length - 1]);
        movearray.push(
          `${c || ""}${bmoves[bmoves.length - 1].textContent.replace("+", "")}`,
        );
      } else if (wmoves.length > bmoves.length) {
        let [e, v] = getNotation(wmoves[wmoves.length - 1], null);
        movearray.push(
          `${e || ""}${wmoves[wmoves.length - 1].textContent.replace("+", "")}`,
        );
      }
    }
  }
  chrome.runtime.sendMessage({ data: movearray, action: "scrapedData" });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "scrapeData") {
    scrapeMovesFromPage();
  }
});
