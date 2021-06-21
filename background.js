// function getFrameId(includeStr, eraseDoChecked, tab){
//     chrome.webNavigation.getAllFrames({tabId: tab.tabId}, function (res) {
//         for (let idx = 0; idx < res.length; idx++) {
//             if (res[idx].url.includes(includeStr)) {
//                 let file_name = '';
//
//                 if (eraseDoChecked){
//                     file_name = 'eraseDealer.js';
//                 } else {
//                     file_name = 'recoverDealer.js';
//                 }
//                 console.log("Do and Id: " + res[idx].frameId);
//                 chrome.scripting.executeScript({
//                     target: {tabId: tab.tabId, frameIds: [res[idx].frameId]},
//                     files: ['eraseDealer.js']
//                 });
//                 return
//             }
//         }
//
//     });
//     // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
//     //     let currTab = tabs[0];
//     //     if (currTab) { // Sanity check
//     //         chrome.webNavigation.getAllFrames({tabId: currTab.id}, function (res) {
//     //             for (let idx = 0; idx < res.length; idx++) {
//     //                 if (res[idx].url.includes(includeStr)) {
//     //                     let file_name = '';
//     //
//     //                     if (eraseDoChecked){
//     //                         file_name = 'eraseDealer.js';
//     //                     } else {
//     //                         file_name = 'recoverDealer.js';
//     //                     }
//     //                     console.log("Do and Id: " + res[idx].frameId);
//     //                     chrome.scripting.executeScript({
//     //                         target: {tabId: currTab.id, frameIds: [res[idx].frameId]},
//     //                         files: ['eraseDealer.js']
//     //                     });
//     //                     return
//     //                 }
//     //             }
//     //
//     //         });
//     //     }
//     // });
// }

chrome.webNavigation.onCommitted.addListener(function(tab) {
    // 값을 가져오기
    chrome.storage.sync.get(['eraseCheckBox'], function (data) {
        // getFrameId("ArticleList", data.eraseCheckBox, tab);
        let includeStr = "MyCafeIntro";
        let file_name = '';
        chrome.webNavigation.getAllFrames({tabId: tab.tabId}, function (res) {
            for (let idx = 0; idx < res.length; idx++) {
                console.log(res[idx].url);

                if (data.eraseCheckBox){
                    file_name = "eraseDealer.js";
                } else {
                    file_name = "recoverDealer.js";
                }
                console.log("Do and Id: " + res[idx].frameId);
                chrome.scripting.executeScript({
                    target: {tabId: tab.tabId, frameIds: [0]},
                    files: [file_name]
                });
            }

        });
    })
// }, {
//     url: [
//         {urlPrefix: 'https://cafe.naver.com/joonggonara'},
//     ]
});

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if(message.msg === "eraseDo") {
            // console.log("ERASE");
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                let currTab = tabs[0];
                if (currTab) { // Sanity check
                    chrome.scripting.executeScript({
                        target: {tabId: currTab.id, frameIds: [0]},
                        files: ['eraseDealer.js']
                    });
                }
            });
        } else if (message.msg === "recoverDo") {
            // console.log("RECOVER");
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                let currTab = tabs[0];
                if (currTab) { // Sanity check
                    chrome.scripting.executeScript({
                        target: {tabId: currTab.id, frameIds: [0]},
                        files: ['recoverDealer.js']
                    });
                }
            });
        }
    }
)



