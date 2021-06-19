chrome.webNavigation.onCommitted.addListener(function(tab) {

    // 값을 가져오기
    chrome.storage.sync.get(['eraseCheckBox'], function (data) {

        let eraseDoChecked = data.eraseCheckBox;
        if (eraseDoChecked) {
            chrome.webNavigation.getAllFrames({tabId: tab.tabId}, function(res){
                for(let idx=0; idx<res.length; idx++){
                    console.log(res[idx].frameId);
                }
                chrome.scripting.executeScript({
                    target: {tabId: tab.tabId, frameIds: [0]},
                    files: ['eraseDealer.js']
                });
            })
            // chrome.scripting.executeScript({
            //     target: {tabId: tab.tabId, frameIds: []},
            //     files: ['eraseDealer.js']
            // });
        } else {
            chrome.scripting.executeScript({
                target: {tabId: tab.tabId, allFrames: true},
                files: ['recoverDealer.js']
            });
        }
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
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
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



