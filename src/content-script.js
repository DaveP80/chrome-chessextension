function scrapeMovesFromPage() {
  function getNotation(wm, bm) {
    let wfig = null;
    let bfig = null;
    if (wm) {
      wfig = wm.getElementsByTagName("span");
    }
    if (bm) {
      bfig = bm.getElementsByTagName("span");
    }
    if (wfig) {
      if (wfig.length > 1) wfig = wfig[1].getAttribute("data-figurine");
      else wfig = null;
    }
    if (bfig) {
      if (bfig.length > 1) bfig = bfig[1].getAttribute("data-figurine");
      else bfig = null;
    }
    return [wfig, bfig];
  }
  let wmoves = document.body.getElementsByClassName(
    "node white-move main-line-ply",
  );
  let bmoves = document.body.getElementsByClassName(
    "node black-move main-line-ply",
  );
  if (!wmoves || wmoves.length == 0) {
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
  let finalarr = movearray.map((item) => item.replaceAll(/\s/g, ""));
  chrome.runtime.sendMessage({
    data: finalarr,
    action: "scrapedData",
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "scrapeData") {
    scrapeMovesFromPage();
  }
});
