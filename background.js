function injectScript(tabId){
    chrome.storage.local.get(['eraseCheckBox'], function (data) {
        chrome.scripting.executeScript({
            target: {tabId: tabId, frameIds: [0]},
            files: [data.eraseCheckBox ? "eraseDealerMutation.js" : "recoverDealerMutation.js"]
        });
    });
}

function getUrl(){
    let org_url = document.querySelector('#app > div > div > div.ArticleContentBox > div.article_header > div.ArticleTool > a.button_url');
    let title = document.querySelector('#app > div > div > div.ArticleContentBox > div.article_header > div.ArticleTitle > div > h3').textContent.trim();
    let url = 'https://cafe.naver.com/joonggonara/' + org_url.href.split('/')[7].split('?')[0];

    return [title, url];
}

chrome.webNavigation.onDOMContentLoaded.addListener(function(tab){
    if(tab.frameId === 0) {
        chrome.storage.local.get(['hostNameList'], function(data){
            if(data['hostNameList'] !== undefined) {
                for(let idx=0; idx<data['hostNameList'].length; idx++){
                    if(tab.url.includes(data['hostNameList'][idx])) {
                        injectScript(tab.tabId);
                        break;
                    }
                }
            }
        });
    }
});

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if (message.msg === "eraseDealer") {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0]) {
                    injectScript(tabs[0].id);
                }
            });
        } else if (message.msg === "addBookMark") {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0] && tabs[0].url.includes('cafe.naver.com')) {
                    chrome.webNavigation.getAllFrames({tabId: tabs[0].id},
                        function(details) {
                            let isFind = false;
                            for (let idx=0; idx < details.length; idx ++) {
                                if (details[idx].url.includes('cafe.naver.com/ca-fe')) {
                                    isFind = true;
                                    chrome.scripting.executeScript({
                                            target: {tabId: tabs[0].id, frameIds: [details[idx].frameId]},
                                            func: getUrl
                                        },
                                        (injectionResults) => {
                                            chrome.bookmarks.getTree(function(results) {
                                                let mainFolder = results[0].children[0];
                                                let childFolders = results[0].children[0].children;

                                                for (let childIdx=0; childIdx < childFolders.length; childIdx++) {
                                                    if (childFolders[childIdx].hasOwnProperty('children') && childFolders[childIdx].title === '당근나라') {
                                                        chrome.bookmarks.create(
                                                            {'parentId': childFolders[childIdx].id, 'title': injectionResults[0].result[0], 'url': injectionResults[0].result[1]}
                                                        );
                                                        sendResponse({responseMsg: true});
                                                        return true;
                                                    }
                                                }

                                                chrome.bookmarks.create(
                                                    {'parentId': mainFolder.id, 'title': '당근나라'},
                                                    function(newFolder) {
                                                        chrome.bookmarks.create(
                                                            {'parentId': newFolder.id, 'title': injectionResults[0].result[0], 'url': injectionResults[0].result[1]},
                                                        );
                                                        sendResponse({responseMsg: true});
                                                    },
                                                );
                                            });
                                        });
                                    break;
                                }
                            }
                            if (!isFind) {
                                sendResponse({responseMsg: false});
                            }
                        }
                    )
                } else {
                    sendResponse({responseMsg: false});
                }
            });
        }
        return true;
    }
)

chrome.storage.local.get(['eraseCheckBox'], function(data){
    if (data.eraseCheckBox) {
        // 동작 중임을 표시하는 아이콘 표시
        chrome.action.setBadgeText({text: 'ON'});
        chrome.action.setBadgeBackgroundColor({color: '#4688F1'});
    } else {
        // 동작 중임을 표시하는 아이콘 지우기
        chrome.action.setBadgeText({text: ''});
        chrome.action.setBadgeBackgroundColor({color: '#00000000'});
    }
});