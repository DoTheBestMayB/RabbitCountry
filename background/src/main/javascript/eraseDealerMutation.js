function eraseDealerInitial(){
    const postTable = frameWindow.document.querySelectorAll('#main-area > div.article-board.m-tcol-c')[1];
    const dealerLink = 'https://cafe.pstatic.net/levelicon/1/1_150.gif';

    if(postTable !== undefined){
        let postElements = postTable.querySelectorAll('div.article-board.m-tcol-c > table > tbody > tr');

        chrome.storage.local.get(['eraseList', 'eraseVIP'], function(data){
            const isDeleteVIP = data['eraseVIP'];

            for(let idx=postElements.length-1; idx>=0; idx--){
                const src = postElements[idx].querySelector('td.td_name > div > table > tbody > tr > td > span > img').getAttribute('src');
                const nickName = postElements[idx].querySelector('td.td_name > div > table > tbody > tr > td > a').textContent;

                if(isDeleteVIP && src === dealerLink){
                    postElements[idx].setAttribute('style', 'display: none;');
                } else if(data['eraseList'] && data['eraseList'].includes(nickName)){
                    postElements[idx].setAttribute('style', 'display: none;');
                }
            }
        });
    }
}

function checkFrameReady(e) {
    if (!e.type) {
        // DOMException occur until iframe is identified as same-origin as main frame
        try {
            start_observer(new frameWindow.MutationObserver(eraseDealer));
            frameWindow.addEventListener('unload', checkFrameReady);
            return; // to prevent unlimited recursive function call
        } catch (e) {}
    }
    // If DOMException occur, checkFrameReady is called again.
    requestAnimationFrame(checkFrameReady);
}

function eraseDealer(mutations, observer) {
    const SEL = '.td_name img[src="https://cafe.pstatic.net/levelicon/1/1_150.gif"]';
    const NAME = '.td_name a'
    let stopped;

    // mutations have changes as a list of MutationRecord https://javascript.info/mutation-observer
    if(typeof mutations === 'undefined') return
    chrome.storage.local.get(['eraseList', 'eraseVIP'], function(data) {
        const isDeleteVIP = data['eraseVIP'];

        for (const { addedNodes } of mutations) {
            for (const n of addedNodes) {
                // pass when encounter text
                // ex) If there are <div>hi</div>, 'hi' text can be addedNoes
                if (!n.tagName){
                    continue;
                }

                // check addedNode is correct to what want to erase
                // if n is element what want to erase or n has grand child element what want to erase if n has child element
                const elems = isDeleteVIP && n.matches(SEL) && [n] ||
                    n.matches(NAME) && data['eraseList'] && data['eraseList'].includes(n.text) && [n];
                if (!elems) {
                    continue
                }

                if (!stopped) { stopped = true; observer.disconnect(); }
                elems.forEach(el => el.closest('.td_name').closest('tr').setAttribute('style', 'display: none;'));

            }
        }
        if (stopped) start_observer(observer);
    });
}

function start_observer(observer) {
    observer.observe(frameWindow.document.body || frameWindow.document.documentElement,
        {childList: true, subtree: true});
}


var frameWindow = document.querySelector('#cafe_main').contentWindow;

eraseDealerInitial();
frameWindow.addEventListener('unload', checkFrameReady);