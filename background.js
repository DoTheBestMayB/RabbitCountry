function injectScript(tabId){
    let includeStr = "cafe";
    let notIncludeStr = "ArticleList";
    let file_name = "";
    // 값을 가져오기
    chrome.storage.local.get(['eraseCheckBox'], function (data) {
        chrome.webNavigation.getAllFrames({'tabId': tabId}, function(res) {
            let frames = [];
            for (let idx = 0; idx < res.length; idx++) {
                file_name = data.eraseCheckBox ? "eraseDealer.js" : "recoverDealer.js";
                console.log(res[idx].url);

                if (res[idx].url.includes(includeStr) && !res[idx].url.includes(notIncludeStr) && res[idx].frameId != 0) {
                    // console.log(res[idx].url);
                    console.log("Do and Id: " + res[idx].frameId);
                    frames.push(res[idx].frameId);
                }
            }
            console.log("frames: " + frames);
            if(frames && file_name !== ""){
                chrome.scripting.executeScript({
                    target: {tabId: tabId, frameIds: frames},
                    files: [file_name]
                });
            }
        });
    });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (changeInfo.status == 'complete') {
        injectScript(tabId);
    }
});

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if(message.msg === "do") {
            console.log("getMessage");
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                let currTab = tabs[0];
                if (currTab) { // Sanity check
                    injectScript(currTab.id);
                }
            });
        }
    }
)



