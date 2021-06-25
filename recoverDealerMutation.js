function recoverDealer(){
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


if(typeof(observerErase) != 'undefined'){
    observerErase.disconnect();
}

// console.log("Recover Mutation");
recoverDealer();

var config = { attributes: true, childList: true, subtree: true, characterData: false };
var htmlBody = document.querySelector('#main-area');

var observerRecover = new MutationObserver(function(mutations, observer) {
    mutations.forEach(function(mutation) {
        // console.log("Mutation call - recover");
        let target = document.getElementById('content-area');
        if (target){
            // console.log("Yes, find");
            recoverDealer();
        }

        // observer.disconnect()

    });
});

observerRecover.observe(htmlBody, config);
