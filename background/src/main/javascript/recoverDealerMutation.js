function recoverDealer(){
    let inner_iframe = document.getElementById('cafe_main').contentWindow;
    let post_table = inner_iframe.document.querySelectorAll('#main-area > div.article-board.m-tcol-c')[1];
    if(post_table !== undefined){
        let postElements = post_table.querySelectorAll('div.article-board.m-tcol-c > table > tbody > tr');

        for(let idx=postElements.length-1; idx>=0; idx--){
            if (postElements[idx].getAttribute('style')) {
                postElements[idx].setAttribute('style', '');
            }
        }
    }
}

recoverDealer();

try {
    frameWindow.removeEventListener('unload', checkFrameReady);
} catch(e) {}