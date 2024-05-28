const keys = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
};

let board =
  "r n b q k b n r\np p p p p p p p\n. . . . . . . .\n. . . . . . . .\n. . . . . . . .\n. . . . . . . .\nP P P P P P P P\nR N B Q K B N R";

let boardview = localStorage.getItem("boardview");

let orient = "white";

class CustomSet extends Set {
  constructor(storageKey, ...args) {
    super(...args);
    this.storageKey = storageKey;
    this.loadFromStorage();
  }

  add(value) {
    if (!this.has(value)) {
      super.add(value);
      this.saveToStorage();
    }
    return this;
  }

  loadFromStorage() {
    const storedData = localStorage.getItem(this.storageKey);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      parsedData.forEach((item) => super.add(item));
    }
  }

  saveToStorage() {
    const data = Array.from(this);
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
}

const mySet = new CustomSet(`${new Date().toLocaleDateString()}-lichess`);

let hh = document.getElementsByClassName("loading-spinner");
let gmvtog = document.getElementById("gameview");

chrome.runtime.sendMessage({ action: "inj" });
document.addEventListener("DOMContentLoaded", function () {
  renderBoard({ board });
  let [hc, uc] = coordinates();
  gmvtog.appendChild(uc);
  gmvtog.appendChild(hc);
});

let button = document.getElementById("chessBtn");
button.addEventListener("click", async function () {
  // Send a message to the background script to get the current URL
  chrome.runtime.sendMessage({ action: "getCurrentUrl" }, async (response) => {
    const currentUrl = response.currentUrl;

    if (
      typeof currentUrl == "string" &&
      !currentUrl.includes("lichess") &&
      !currentUrl.includes("chess.com")
    ) {
      document.getElementById("bestmove").textContent =
        "Visit lichess or chess.com";
      return;
    }
    if (currentUrl.includes("lichess.org")) {
      try {
        let gameid = currentUrl.split("/");
        gameid = gameid[gameid.length - 1];

        if (gameid.length > 2) {
          document.getElementById("bestmove").textContent = "";
          let nn = document.getElementById("bestmove");
          hh[0].style.display = "block";
          nn.style.paddingTop = "0";
          let cloudfuncjson = await cloudFunction(gameid);
          nn.style.paddingTop = "0.25rem";

          if (cloudfuncjson.hasOwnProperty("data")) {
            mySet.add(gameid);
            let [movestring, bstmvfromsqr, bstmvtosqr] = formatMoveString(
              cloudfuncjson.data,
            );
            nn.textContent = movestring;
            if (cloudfuncjson.hasOwnProperty("board")) {
              renderBoard(cloudfuncjson, bstmvfromsqr, bstmvtosqr);
              let viewv = cloudfuncjson.turn;
              let dynamstate = document.getElementById("dynamicView").checked;

              if (viewv == "black" && dynamstate) {
                flipBoard();
              }
              if (!dynamstate) {
                if (orient == "black") {
                  flipBoard();
                }
              }
            }
          } else {
            nn.textContent = "No suggestion";
          }
        }
      } catch (error) {
        console.error("Error:", error);
        nn.textContent = "Error occurred";
      } finally {
        hh[0].style.display = "none";
      }
    } else if (currentUrl.includes("chess.com")) {
      chrome.runtime.sendMessage({ action: "scrapeData" });
    } else {
      return;
    }
  });
});

let z = document.getElementById("app-avatar");
let si = localStorage.getItem("chesshelper");
let qm = document.getElementById("bestmove-container");
let q = document.getElementById("bestmove");
if (si) {
  si = JSON.parse(si);
  z.setAttribute("src", si["img"]);
  z.style.display = "block";
  qm.style = "margin: 5px 0";
}
if (!si) {
  hh[0].style = "width: 55px, height: auto";
  q.style.marginLeft = "0rem";
  q.style.paddingTop = "0rem";
  qm.style =
    "min-height: 4rem, margin-bottom: 5px, display: flex, flex-direction: column, justify-content: center";
}
// Add event listener for storage events
window.addEventListener("storage", function (event) {
  if (event.key === "chesshelper") {
    let jsonobj = JSON.parse(event.newValue) || {};
    if (jsonobj.hasOwnProperty("img")) {
      z.setAttribute("src", jsonobj["img"]);
      z.style.display = "block";
      hh[0].style = "width: 75px, height: auto";
      qm.style = "margin: 0 0";
    }
  }
  if (event.key === "boardview") {
    boardview = event.newValue || "lichess";
    renderBoard({ board });
  }
});

document
  .getElementById("fenForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    let inputValue = document.getElementById("textInput");

    if (!inputValue.value.length) {
      return;
    }
    if (inputValue.value == "hide") {
      document.getElementById("app-avatar").style.display = "none";
      q.style.marginLeft = "0rem";
      q.style.paddingTop = "0rem";
      qm.style =
        "min-height: 4rem, margin-bottom: 5px, display: flex, flex-direction: column, justify-content: center";
      document.getElementById("fenForm").reset();
      return;
    }
    try {
      document.getElementById("feneval").style.display = "block";
      document.getElementById("besteval").textContent = "";
      hh[1].style.display = "block";
      const response = await evalFen(inputValue.value);

      if (response.hasOwnProperty("data")) {
        let [evalstring, bstmvfromsqr, bstmvtosqr] = formatMoveString(
          response.data,
        );
        document.getElementById("besteval").textContent = evalstring;
        if (response.hasOwnProperty("board")) {
          renderBoard(response, bstmvfromsqr, bstmvtosqr);
        }
      } else {
        document.getElementById("besteval").textContent = "paste new FEN";
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("besteval").textContent = "Error occurred";
    } finally {
      hh[1].style.display = "none";
    }
  });

var flipboardelem = document.getElementById("flipboard");
flipboardelem.addEventListener("change", function () {
  flipBoard();
});

var toggleboard = document.getElementById("showboard");
toggleboard.addEventListener("change", function () {
  let gameboard = document.getElementById("gameview");
  let switchmove = document.getElementById("vis-container");
  if (toggleboard.checked) {
    gameboard.style.display = "grid";
    switchmove.style.marginTop = "5px";
  } else if (!toggleboard.checked) {
    gameboard.style.display = "none";
    switchmove.style.marginTop = "10px";
  }
});

var profiletoggle = document.getElementById("profilelnk");
profiletoggle.addEventListener("click", function () {
  chrome.runtime.sendMessage({ action: "open_main" });
});

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === "scrapedData") {
    let appendto = null;
    if (message.data[0] == "newgame") {
      appendto = "newgame";
    } else if (message.data.length) {
      appendto = message.data.join("%20");
    }
    try {
      let nn = document.getElementById("bestmove");
      if (appendto) {
        document.getElementById("bestmove").textContent = "";
        hh[0].style.display = "block";
        nn.style.paddingTop = "0";

        let cloudfuncjson = await chesscom(appendto);
        nn.style.paddingTop = "0.25rem";

        if (cloudfuncjson.hasOwnProperty("data")) {
          let [movestring, bstmvfromsqr, bstmvtosqr] = formatMoveString(
            cloudfuncjson.data,
          );
          nn.textContent = movestring;
          if (cloudfuncjson.hasOwnProperty("board")) {
            renderBoard(cloudfuncjson, bstmvfromsqr, bstmvtosqr);
            let viewv = cloudfuncjson.turn;
            let dynamstate = document.getElementById("dynamicView").checked;

            if (viewv == "black" && dynamstate) {
              flipBoard();
            }
            if (!dynamstate) {
              if (orient == "black") {
                flipBoard();
              }
            }
          }
        } else {
          nn.textContent = "No suggestion";
        }
      } else {
        nn.textContent = "please try again";
      }
    } catch (e) {
      console.error(e);
    } finally {
      hh[0].style.display = "none";
    }
  }
});

function getImageMap() {
  const imagemap = {
    p:
      boardview == "lichess"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`
        : `<img id="chesscompiece" src="./com-blackpawn.png"/>`,
    n:
      boardview == "lichess"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#000"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#000"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#ececec" stroke="#ececec"/><path d="M24.55 10.4l-.45 1.45.5.15c3.15 1 5.65 2.49 7.9 6.75S35.75 29.06 35.25 39l-.05.5h2.25l.05-.5c.5-10.06-.88-16.85-3.25-21.34-2.37-4.49-5.79-6.64-9.19-7.16l-.51-.1z" fill="#ececec" stroke="none"/></g></svg>`
        : `<img id="chesscompiece" src="./com-blacknight.png"/>`,
    r:
      boardview == "lichess"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45"><g fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3.5-7l1.5-2.5h17l1.5 2.5h-20zm-.5 4v-4h21v4H12z" stroke-linecap="butt"/><path d="M14 29.5v-13h17v13H14z" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" stroke-linecap="butt"/><path d="M12 35.5h21m-20-4h19m-18-2h17m-17-13h17M11 14h23" fill="none" stroke="#ececec" stroke-width="1" stroke-linejoin="miter"/></g></svg>`
        : `<img id="chesscompiece" src="./com-blackrook.png"/>`,
    b:
      boardview == "lichess"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#000" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#ececec" stroke-linejoin="miter"/></g></svg>`
        : `<img id="chesscompiece" src="./com-blackbishop.png"/>`,
    q:
      boardview == "lichess"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45"><g fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g stroke="none"><circle cx="6" cy="12" r="2.75"/><circle cx="14" cy="9" r="2.75"/><circle cx="22.5" cy="8" r="2.75"/><circle cx="31" cy="9" r="2.75"/><circle cx="39" cy="12" r="2.75"/></g><path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/><path d="M11 38.5a35 35 1 0 0 23 0" fill="none" stroke-linecap="butt"/><path d="M11 29a35 35 1 0 1 23 0m-21.5 2.5h20m-21 3a35 35 1 0 0 22 0m-23 3a35 35 1 0 0 24 0" fill="none" stroke="#ececec"/></g></svg>`
        : `<img id="chesscompiece" src="./com-blackqueen.png"/>`,
    k:
      boardview == "lichess"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#000" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#000"/><path d="M20 8h5" stroke-linejoin="miter"/><path d="M32 29.5s8.5-4 6.03-9.65C34.15 14 25 18 22.5 24.5l.01 2.1-.01-2.1C20 18 9.906 14 6.997 19.85c-2.497 5.65 4.853 9 4.853 9" stroke="#ececec"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#ececec"/></g></svg>`
        : `<img id="chesscompiece" src="./com-blacking.png"/>`,
    P:
      boardview == "lichess"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`
        : `<img id="chesscompiece" src="./com-whitepawn.png"/>`,
    R:
      boardview == "lichess"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3-3v-4h21v4H12zm-1-22V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5H14V17" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><path d="M11 14h23" fill="none" stroke-linejoin="miter"/></g></svg>`
        : `<img id="chesscompiece" src="./com-whiterook.png"/>`,
    N:
      boardview == "lichess"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#000"/></g></svg>`
        : `<img id="chesscompiece" src="./com-whiteknight.png"/>`,
    B:
      boardview == "lichess"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#fff" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke-linejoin="miter"/></g></svg>`
        : `<img id="chesscompiece" src="./com-whitebishop.png"/>`,
    Q:
      boardview == "lichess"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/></g></svg>`
        : `<img id="chesscompiece" src="./com-whitequeen.png"/>`,
    K:
      boardview == "lichess"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g></svg>`
        : `<img id="chesscompiece" src="./com-whiteking.png"/>`,
  };
  return imagemap;
}

function coordinates() {
  let divh = document.createElement("div");
  let across =
    orient == "white" ? Object.keys(keys) : Object.keys(keys).reverse();
  let downn =
    orient == "white" ? Object.values(keys).reverse() : Object.values(keys);
  across.map((item, i) => {
    var cr = document.createElement("div");
    cr.innerHTML = `<i>${item}</i>`;
    cr.style.maxWidth = "fit-content";
    cr.style.textAlign = "center";
    cr.id = `cr${i}y`;
    divh.appendChild(cr);
  });
  divh.id = "xylookup";

  let divu = document.createElement("div");
  downn.map((item, i) => {
    var cru = document.createElement("div");
    cru.innerHTML = `<i>${item + 1}</i>`;
    cru.style =
      "display: flex, flex-direction: column, justify-content: center";
    cru.style.maxWidth = "fit-content";
    cru.id = `cr${i}x`;
    divu.appendChild(cru);
  });
  divu.id = "numlookup";
  return [divh, divu];
}

async function chesscom(args) {
  try {
    const response = await fetch(
      `https://stockfishapi-jh4a3z47hq-uk.a.run.app/chesscom/?moves=${args}`,
    );

    if (!response.ok) {
      throw new Error("cloud function not working");
    }

    return response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function evalFen(args) {
  try {
    const response = await fetch(
      `https://stockfishapi-jh4a3z47hq-uk.a.run.app/evaluation/?fen=${args}`,
    );

    if (!response.ok) {
      throw new Error("cloud function not working");
    }

    return response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function cloudFunction(args) {
  try {
    const response = await fetch(
      `https://stockfishapi-jh4a3z47hq-uk.a.run.app/suggest-move/${args}`,
    );

    if (!response.ok) {
      throw new Error("cloud function not working");
    }

    return response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

function renderBoard(cfj, bstmvfromsqr, bstmvtosqr) {
  let f = cfj.board.split("\n");
  board = cfj.board;
  const imagemap = getImageMap();
  //board from API response
  let g = f.map((item) => item.split(" "));
  let x = 0;
  let y = 0;
  let bmfromx;
  let bmfromy;
  let bmtox;
  let bmtoy;
  //original state/orientation of board
  if (bstmvfromsqr && bstmvtosqr) {
    bmfromx = Math.abs(+bstmvfromsqr[bstmvfromsqr.length - 1] - 1 - 7);
    bmfromy = keys[bstmvfromsqr[0]];
    bmtox = Math.abs(+bstmvtosqr[bstmvtosqr.length - 1] - 1 - 7);
    bmtoy = keys[bstmvtosqr[0]];
  }

  const parentDiv = document.getElementById("chessboard");
  const childDivs = parentDiv.querySelectorAll("div");

  childDivs.forEach((item) => {
    if (x == 0 && y == 7) {
      item.setAttribute("id", 8);
    }
    if (x == 7 && y == 0) {
      item.id = "";
    }
    if (x == bmfromx && y == bmfromy) {
      item.classList.add("highlight");
    } else if (x == bmtox && y == bmtoy) {
      item.classList.add("highlight");
    } else {
      item.classList.remove("highlight");
    }
    switch (g[x][y]) {
      case "p":
        item.innerHTML = imagemap["p"];
        break;
      case "n":
        item.innerHTML = imagemap["n"];
        break;
      case "r":
        item.innerHTML = imagemap["r"];
        break;
      case "b":
        item.innerHTML = imagemap["b"];
        break;
      case "q":
        item.innerHTML = imagemap["q"];
        break;
      case "k":
        item.innerHTML = imagemap["k"];
        break;
      case "P":
        item.innerHTML = imagemap["P"];
        break;
      case "R":
        item.innerHTML = imagemap["R"];
        break;
      case "N":
        item.innerHTML = imagemap["N"];
        break;
      case "B":
        item.innerHTML = imagemap["B"];
        break;
      case "Q":
        item.innerHTML = imagemap["Q"];
        break;
      case "K":
        item.innerHTML = imagemap["K"];
        break;
      default:
        item.innerHTML = ``;
    }
    y++;
    if (y == 8) {
      y = 0;
      x++;
    }
  });
  let whtsqr = Array.from(document.getElementsByClassName("white"));
  let blacksqr = Array.from(document.getElementsByClassName("black"));
  whtsqr.forEach((item) => {
    if (item.classList.contains("highlight")) {
      if (boardview == "lichess") {
        item.backgroundColor = "none";
      }
      item.style.background = `rgb(255,238,227)`;
      item.style.background = `radial-gradient(circle, rgba(255,238,227,1) 0%, rgba(255,219,203,1) 100%)`;
    } else if (boardview == "lichess") {
      item.style.background = "none";
      item.style.backgroundColor = "#af9361";
    } else if (boardview == "chess.com") {
      item.style.background = `rgb(249,255,191)`;
      item.style.background = `radial-gradient(circle, rgba(249,255,191,1) 100%, rgba(249,255,195,1) 100%)`;
    }
  });
  blacksqr.forEach((item) => {
    if (item.classList.contains("highlight")) {
      if (boardview == "lichess") {
        item.style.backgroundColor = "none";
      }
      item.style.background = `rgb(255,238,227)`;
      item.style.background = `radial-gradient(circle, rgba(255,238,227,1) 0%, rgba(255,219,203,1) 100%)`;
    } else if (boardview == "lichess") {
      item.style.backgroundColor = "none";
      item.style.background = "rgb(82, 55, 40)";
      item.style.background = `linear-gradient(
          252deg,
          rgba(82, 55, 40, 0.9483568075117371) 0%,
          rgba(82, 55, 40, 1) 100%`;
    } else if (boardview == "chess.com") {
      item.style.background = `rgb(23,145,45)`;
      item.style.background = `radial-gradient(circle, rgba(23,145,45,1) 93%, rgba(25,129,30,1) 100%)`;
    }
  });
}

function flipBoard() {
  const parentDiv = document.getElementById("chessboard");
  const childDivs = parentDiv.querySelectorAll("div");

  let temp = [];
  let subarr = [];
  childDivs.forEach((item) => {
    subarr.push(item);
    if (subarr.length == 8) {
      temp.push(subarr);
      subarr = [];
    }
  });

  temp.reverse();

  temp = temp.map((item) => {
    item = item.reverse();
    return item;
  });
  parentDiv.innerHTML = null;
  temp.forEach((node, i) => {
    node.forEach((element, j) => {
      if (i == 7 && j == 0) {
        let divId = element.id;
        if (divId && divId == 8) {
          orient = "black";
        }
      }
      if (i == 0 && j == 7) {
        let divId = element.id;
        if (divId && divId == 8) {
          orient = "white";
        }
      }
      parentDiv.appendChild(element);
    });
  });
  let [hcz, ucz] = coordinates();
  document.getElementById("xylookup").remove();
  document.getElementById("numlookup").remove();
  gmvtog.appendChild(ucz);
  gmvtog.appendChild(hcz);
}

function formatMoveString(moveString) {
  const parts = moveString.split(/\s+/);
  const formattedParts = [];
  let bmfromsq = "";
  let bmtosq = "";
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === "bestmove" || part === "ponder") {
      formattedParts.push(part);
    } else {
      if (part.length === 4 || part.length === 5) {
        const fromSquare = part.substring(0, 2);
        const toSquare = part.substring(2, 4);
        const promotion = part.length === 5 ? part.charAt(4) : null;
        if (!parts.slice(0, i).includes("ponder")) {
          bmfromsq = fromSquare;
          bmtosq = toSquare;
        }
        formattedParts.push(
          fromSquare + " ⇾ " + toSquare + (promotion ? `*${promotion}*` : ""),
        );
      } else {
        formattedParts.push(part);
      }
    }
  }
  return [formattedParts.join("\n"), bmfromsq, bmtosq];
}
