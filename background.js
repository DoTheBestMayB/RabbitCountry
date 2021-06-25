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

chrome.webNavigation.onCompleted.addListener(function(tab) {
    if(tab.frameId == 0){
        // console.log("webNavigation Calling");
        injectScript2(tab.tabId);
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

// function injectScript(tabId){
//     let includeStr = "cafe";
//     let notIncludeStr = "ArticleList";
//     let file_name = "";
//     // 값을 가져오기
//     chrome.storage.local.get(['eraseCheckBox'], function (data) {
//         chrome.webNavigation.getAllFrames({'tabId': tabId}, function(res) {
//             let frames = [];
//             for (let idx = 0; idx < res.length; idx++) {
//                 file_name = data.eraseCheckBox ? "eraseDealer.js" : "recoverDealer.js";
//
//                 if (res[idx].url.includes(includeStr) && !res[idx].url.includes(notIncludeStr) && res[idx].frameId != 0) {
//                     // console.log(res[idx].url);
//                     console.log("Do and Id: " + res[idx].frameId);
//                     frames.push(res[idx].frameId);
//                 }
//             }
//             console.log("frames: " + frames);
//             if(frames && file_name !== ""){
//                 chrome.scripting.executeScript({
//                     target: {tabId: tabId, frameIds: frames},
//                     files: [file_name]
//                 });
//             }
//         });
//     });
// }

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
//     if (changeInfo.status == 'complete') {
//         console.log("onUpdated Calling");
//         injectScript2(tabId);
//     }
// });
