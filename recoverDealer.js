if (document.getElementById('cafe_main') !== null){
    // console.log("Recover");
    let inner_iframe = document.getElementById('cafe_main').contentWindow;
    let post_table = inner_iframe.document.querySelectorAll('#main-area > div.article-board.m-tcol-c')[1];
    if(post_table !== undefined){
        let ls = post_table.querySelectorAll('div.article-board.m-tcol-c > table > tbody > tr');

        let idx;
        let dealer_link = 'https://cafe.pstatic.net/levelicon/1/1_150.gif';

        for(idx=ls.length-1; idx>=0; idx--){
            let src = ls[idx].querySelector('td.td_name > div > table > tbody > tr > td > span > img').getAttribute('src');

            if(src === dealer_link){
                ls[idx].setAttribute('style', '');
            }
        }
    }
}

// function recoverDealer(){
//     let inner_iframe = document.getElementById('cafe_main').contentWindow;
//     let post_table = inner_iframe.document.querySelectorAll('#main-area > div.article-board.m-tcol-c')[1];
//     let ls = post_table.querySelectorAll('div.article-board.m-tcol-c > table > tbody > tr');
//
//     let idx;
//     let dealer_link = 'https://cafe.pstatic.net/levelicon/1/1_150.gif';
//
//     for(idx=ls.length-1; idx>=0; idx--){
//         let src = ls[idx].querySelector('td.td_name > div > table > tbody > tr > td > span > img').getAttribute('src');
//
//         if(src === dealer_link){
//             ls[idx].setAttribute('style', '');
//         }
//     }
// }

// try{
//     recoverDealer();
//     document.getElementById('cafe_main').addEventListener('load', recoverDealer, false);
//
//     // let re = /https*:\/\/cafe.naver.com\/joonggonara/;
//     // if(window.location.href.match(re)){
//     //     recoverDealer();
//     //     // document.querySelector('#cafe_main').removeEventListener('change', eraseDealer);
//     //
//     //     // removeEventListener 가 적용되지 않아 EventListener 를 추가해 덮음으로써 해결함
//     //     // 나중에 이 부분 해결해야 함
//     //     // document.getElementById('cafe_main').removeEventListener('load', eraseDealer, false);
//     //     document.getElementById('cafe_main').addEventListener('load', recoverDealer, false);
//     // }
// } catch (e){
//     if(e instanceof TypeError){
//         // console.log("TypeErr");
//     } else{
//         throw e;
//     }
// }
