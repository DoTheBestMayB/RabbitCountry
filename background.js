chrome.webNavigation.onCompleted.addListener(function(tab) {
    // 값을 가져오기
    chrome.storage.sync.get(['eraseCheckBox'], function (data) {
        // getFrameId("ArticleList", data.eraseCheckBox, tab);
        let includeStr = "MyCafeIntro";
        let notIncludeStr = "ArticleList";
        let file_name = "";
        chrome.webNavigation.getAllFrames({tabId: tab.tabId}, function (res) {
            let frames = [];
            for (let idx = 0; idx < res.length; idx++) {
                if (data.eraseCheckBox){
                    file_name = "eraseDealer.js";
                } else {
                    file_name = "recoverDealer.js";
                }
                if ( res[idx].url.includes(includeStr) && !res[idx].url.includes(notIncludeStr)){
                    console.log(res[idx].url);
                    console.log("Do and Id: " + res[idx].frameId);
                    frames.push(res[idx].frameId);
                }
            }
            // console.log("frames: " + frames);
            if(frames && file_name !== ""){
                chrome.scripting.executeScript({
                    target: {tabId: tab.tabId, frameIds: frames},
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



