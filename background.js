function injectScript2(tabId, isMutation=true){
    let file_name;
    // 값을 가져오기
    chrome.storage.local.get(['eraseCheckBox'], function (data) {
        if (isMutation) {
            file_name = data.eraseCheckBox ? "eraseDealerMutation.js" : "recoverDealerMutation.js";
        } else {
            file_name = data.eraseCheckBox ? "eraseDealer.js" : "recoverDealer.js";
        }
        chrome.scripting.executeScript({
            target: {tabId: tabId, frameIds: [0]},
            files: [file_name]
        });
    });
}

chrome.webNavigation.onDOMContentLoaded.addListener(function(tab){
    if(tab.frameId == 0) {
        chrome.storage.local.get(['hostNameList'], function(data){
            let hostList = data['hostNameList'];
            if(hostList != undefined) {
                for(let idx=0; idx<hostList.length; idx++){
                    if(tab.url.includes(hostList[idx])) {
                        injectScript2(tab.tabId);
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
            // console.log("getMessage");
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                let currTab = tabs[0];
                if (currTab) { // Sanity check
                    injectScript2(currTab.id, message.mutation);
                }
            });
        }
    }
)
