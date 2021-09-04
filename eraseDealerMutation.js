function erase_dealer_initial(){
    let post_table = fw.document.querySelectorAll('#main-area > div.article-board.m-tcol-c')[1];
    if(post_table !== undefined){
        let ls = post_table.querySelectorAll('div.article-board.m-tcol-c > table > tbody > tr');

        let idx;
        let dealer_link = 'https://cafe.pstatic.net/levelicon/1/1_150.gif';

        chrome.storage.local.get(['eraseList', 'eraseVIP'], function(data){
            var eraseList = data['eraseList'];
            var isDeleteVIP = data['eraseVIP'];

            for(idx=ls.length-1; idx>=0; idx--){
                let src = ls[idx].querySelector('td.td_name > div > table > tbody > tr > td > span > img').getAttribute('src');
                let nickName = ls[idx].querySelector('td.td_name > div > table > tbody > tr > td > a').textContent;
                if(isDeleteVIP && src === dealer_link){
                    ls[idx].setAttribute('style', 'display: none;');
                } else if(eraseList.includes(nickName)){
                    ls[idx].setAttribute('style', 'display: none;');
                }
            }
        });
    }
}

var SEL = '.td_name img[src="https://cafe.pstatic.net/levelicon/1/1_150.gif"]';
var NAME = '.td_name a'
var fw = document.querySelector('#cafe_main').contentWindow;
erase_dealer_initial();
fw.addEventListener('unload', check_frame_ready);

function check_frame_ready(e) {
    if (!e.type) {
        // DOMException occur until iframe is identified as same-origin as main frame
        try {
            start_observer(new fw.MutationObserver(erase_dealer));
            fw.addEventListener('unload', check_frame_ready);
            return; // to prevent unlimited recursive function call
        } catch (e) {}
    }
    // If DOMException occur, check_frame_ready is called again.
    requestAnimationFrame(check_frame_ready);
}

function erase_dealer(mutations, observer) {
    let stopped;
    // mutations have changes as a list of MutationRecord https://javascript.info/mutation-observer
    // addedNodes is nodes that added
    if(typeof mutations === 'undefined') return
    chrome.storage.local.get(['eraseList', 'eraseVIP'], function(data) {
        var eraseList = data['eraseList'];
        var isDeleteVIP = data['eraseVIP'];
        for (const { addedNodes } of mutations) {
            for (const n of addedNodes) {
                // pass when encounter text
                // ex) If there are <div>hi</div>, 'hi' text can be addedNoes
                if (!n.tagName){
                    continue;
                }
                // check addedNode is correct to what want to erase
                // if n is element what want to erase or n has grand child element what want to erase if n has child element
                const elems = isDeleteVIP && ( n.matches(SEL) && [n] || n.firstElementChild && n.querySelectorAll(SEL) ) ||
                    n.matches(NAME) && eraseList.includes(n.text) && [n];
                if (!elems || !elems.length) continue;
                if (!stopped) { stopped = true; observer.disconnect(); }
                elems.forEach(el => el.closest('.td_name').closest('tr').setAttribute('style', 'display: none;'));
            }
        }
        if (stopped) start_observer(observer);
    });
}

function start_observer(observer) {
    observer.observe(fw.document.body || fw.document.documentElement,
        {childList: true, subtree: true});
}