//차단하고 싶은 유저를 입력하고 버튼을 눌렀을 때, 차단하는 유저 반영
document.getElementById('userAddButton').addEventListener("click", function(){
    let seler_name = document.querySelector('#seler_id').value;

});

// 업자, 등록된 유저 삭제하기
document.getElementById('eraseButton').addEventListener("click", function(){
    chrome.tabs.executeScript({
        file: 'erase_dealer.js'
    });
});
