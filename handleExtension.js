// 원본 코드

// let inner_iframe = document.getElementById('cafe_main').contentWindow;
// let post_table = inner_iframe.document.querySelectorAll('#main-area > div.article-board.m-tcol-c')[1];
// let ls = post_table.querySelectorAll('div.article-board.m-tcol-c > table > tbody > tr');

// let idx;
// let dealer_link = 'https://cafe.pstatic.net/levelicon/1/1_150.gif';

// for(idx=ls.length-1; idx>=0; idx--){
//     let src = ls[idx].querySelector('td.td_name > div > table > tbody > tr > td > span > img').getAttribute('src');
    
//     if(src == dealer_link){
//         ls[idx].remove();
//     }
// }

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
