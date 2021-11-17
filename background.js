function injectScript(tabId){
    chrome.storage.local.get(['eraseCheckBox'], function (data) {
        chrome.scripting.executeScript({
            target: {tabId: tabId, frameIds: [0]},
            files: [data.eraseCheckBox ? "eraseDealerMutation.js" : "recoverDealerMutation.js"]
        });
    });
}

chrome.webNavigation.onDOMContentLoaded.addListener(function(tab){
    if(tab.frameId === 0) {
        chrome.storage.local.get(['hostNameList'], function(data){
            if(data['hostNameList'] !== undefined) {
                for(let idx=0; idx<data['hostNameList'].length; idx++){
                    if(tab.url.includes(data['hostNameList'][idx])) {
                        injectScript(tab.tabId);
                        break;
                    }
                }
            }
        });
    }
});

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if(message.msg === "handleExtension") {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0]) { // Sanity check
                    injectScript(tabs[0].id);
                }
            });
        }
    }
)
