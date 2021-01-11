// 값을 가져오기
chrome.storage.sync.get(function(data){
    let eraseDoChecked = data.eraseCheckBox;

    document.querySelector('#eraseButton').checked = eraseDoChecked;

    if(eraseDoChecked){
        chrome.tabs.executeScript({
            file: 'eraseDealer.js'
        });
    }
})

//차단하고 싶은 유저를 입력하고 버튼을 눌렀을 때, 차단하는 유저 반영
document.getElementById('userAddButton').addEventListener("click", function(){
    let seler_name = document.querySelector('#seler_id').value;

});

// 업자, 등록된 유저 삭제하기
document.getElementById('eraseButton').addEventListener("change", function(){
    if(this.checked){
        // 크롬 스토리지에 상태 저장
        chrome.storage.sync.set({
            'eraseCheckBox': true
        });

        chrome.tabs.executeScript({
            file: 'eraseDealer.js'
        });
    } else{
        // 크롬 스토리지에 상태 저장
        chrome.storage.sync.set({
            'eraseCheckBox': false
        });

        chrome.tabs.executeScript({
            file: 'recoverDealer.js'
        });
    }
});