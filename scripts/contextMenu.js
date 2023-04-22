// Callback reads runtime.lastError to prevent an unchecked error from being 
// logged when the extension attempt to register the already-registered menu 
// again. Menu registrations in event pages persist across extension restarts.
chrome.contextMenus.create({
    id: "jira-snippet",
    title: "Copy IssueId and Title to Clipboard",
    contexts: ["link"],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
if (info.menuItemId === "jira-snippet") {
    if(info.linkUrl.includes("/browse/"))
    {
        let issueId = info.linkUrl.split("/browse/")[1];

        chrome.tabs.sendMessage(tab.id, {issueId: issueId});
    }
}
});