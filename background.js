chrome.webNavigation.onCommitted.addListener(function(tab) {
    // 값을 가져오기
    chrome.storage.sync.get(['eraseCheckBox'], function (data) {
        let eraseDoChecked = data.eraseCheckBox;
        if (eraseDoChecked) {
            chrome.scripting.executeScript({
                target: {tabId: tab.tabId, allFrames: true},
                files: ['eraseDealer.js']
            });
        }
    })
// }, {
//     url: [
//         {urlPrefix: 'https://cafe.naver.com/joonggonara'},
//     ]
});

