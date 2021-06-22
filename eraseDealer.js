function eraseDealer(){
    console.log("Erase");
    console.log(document.URL);
    // let inner_iframe = document.getElementById('cafe_main').contentWindow;
    let post_table = document.querySelectorAll('#main-area > div.article-board.m-tcol-c')[1];
    console.log(post_table);
    if(post_table !== undefined){
        let ls = post_table.querySelectorAll('div.article-board.m-tcol-c > table > tbody > tr');

        let idx;
        let dealer_link = 'https://cafe.pstatic.net/levelicon/1/1_150.gif';

        for(idx=ls.length-1; idx>=0; idx--){
            let src = ls[idx].querySelector('td.td_name > div > table > tbody > tr > td > span > img').getAttribute('src');

            if(src === dealer_link){
                ls[idx].setAttribute('style', 'display: none;');
            }
        }
    }
}

let config = { attributes: true, childList: true, subtree: true, characterData: false };
let htmlBody = document.querySelector('body');

let observer = new MutationObserver(function(mutations, observer) {
    mutations.forEach(function(mutation) {
        console.log("Mutation call");
        let target = document.getElementById('content-area');
        if (target){
            console.log("Yes, find");
            eraseDealer();
        }

        // observer.disconnect()

    });
});

observer.observe(htmlBody, config);

