function recoverDealer(){
    let inner_iframe = document.getElementById('cafe_main').contentWindow;
    let post_table = inner_iframe.document.querySelectorAll('#main-area > div.article-board.m-tcol-c')[1];
    if(post_table !== undefined){
        let ls = post_table.querySelectorAll('div.article-board.m-tcol-c > table > tbody > tr');

        for(let idx=ls.length-1; idx>=0; idx--){
            let src = ls[idx].querySelector('td.td_name > div > table > tbody > tr > td > span > img').getAttribute('src');

            if (ls[idx].getAttribute('style')) {
                ls[idx].setAttribute('style', '');
            }
        }
    }
}

let dealer_link = 'https://cafe.pstatic.net/levelicon/1/1_150.gif';

recoverDealer();

try {
    fw.removeEventListener('unload', check_frame_ready);
} catch(e) {}