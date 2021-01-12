chrome.webNavigation.onCompleted.addListener(function(){
    // 값을 가져오기
    chrome.storage.sync.get(function(data){
        let eraseDoChecked = data.eraseCheckBox;

        if(eraseDoChecked){
            chrome.tabs.executeScript({
                file: 'eraseDealer.js'
            });
        }
    })
}, {
    url: [
        {urlPrefix: 'https://cafe.naver.com/joonggonara'},
    ]
});