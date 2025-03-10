
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "extractImageTable") {
        fetchImage(info.srcUrl, tab.id);
    }
});

// Fetch image and send to content script as Blob
function fetchImage(imageUrl, tabId) {
    fetch(imageUrl)
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch image");
            return response.blob();
        })
        .then(blob => {
            // Blob'u content.js'ye gönder
            chrome.tabs.sendMessage(tabId, { action: "processImage", imageBlob: blob }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error sending message:", chrome.runtime.lastError);
                }
            });
        })
        .catch(error => {
            console.error("Error fetching image:", error);
            chrome.tabs.sendMessage(tabId, { action: "error", message: error.message });
        });
}
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "extractTable",
        title: "Extract Table from Image",
        contexts: ["image"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "extractTable") {
        chrome.tabs.sendMessage(tab.id, { action: "processImage", imageUrl: info.srcUrl });
    }
});
