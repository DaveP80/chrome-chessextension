chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: "openSidePanel",
    title: "chess helper",
    contexts: ["all"],
  });
  chrome.tabs.create({ url: "page.html" });
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openSidePanel") {
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getCurrentUrl") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = tabs[0].url;
      sendResponse({ currentUrl });
    });
    return true;
  }
  if (message.action === "open_main") {
    chrome.tabs.create({ url: "page.html" });
  }
  if (message.action === "open_table") {
    chrome.tabs.create({ url: "data_table.html" });
  }
  (async () => {
    if (message.type === "open_side_panel") {
      await chrome.sidePanel.open({ tabId: sender.tab.id });
      await chrome.sidePanel.setOptions({
        tabId: sender.tab.id,
        path: "index.html",
        enabled: true,
      });
    }
  })();
  if (message.action === "scrapeData") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "scrapeData" });
    });
  }
  if (message.action === "inj") {
    const contentScriptDetails = {
      matches: ["*://*.chess.com/*", "*://*.lichess.org/*"],
      js: ["content-script.js"],
    };
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      let checkurl = tab?.url;
      if (checkurl && checkurl.includes("chess.com")) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            files: contentScriptDetails.js,
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error(
                "Error injecting content script:",
                chrome.runtime.lastError.message,
              );
            } else {
              console.log("Content script injected successfully");
            }
          },
        );
      }
    });
  }
});
