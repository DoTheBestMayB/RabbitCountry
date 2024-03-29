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

function alertPopup(msg) {
    alert(msg);
}

function addBookMark(sendResponse, is_alert=false) {
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
                                                if (sendResponse !== null) sendResponse({responseMsg: true});
                                                if (is_alert) {
                                                    chrome.scripting.executeScript({
                                                        target: {tabId: tabs[0].id, frameIds: [0]},
                                                        func: alertPopup,
                                                        args: ["'당근나라' 폴더에 추가되었습니다!"]
                                                    });
                                                }
                                                return true;
                                            }
                                        }

                                        chrome.bookmarks.create(
                                            {'parentId': mainFolder.id, 'title': '당근나라'},
                                            function(newFolder) {
                                                chrome.bookmarks.create(
                                                    {'parentId': newFolder.id, 'title': injectionResults[0].result[0], 'url': injectionResults[0].result[1]},
                                                );
                                                if (sendResponse !== null) sendResponse({responseMsg: true});
                                                if (is_alert) {
                                                    chrome.scripting.executeScript({
                                                        target: {tabId: tabs[0].id, frameIds: [0]},
                                                        func: alertPopup,
                                                        args: ["'당근나라' 폴더에 추가되었습니다!"]
                                                    });
                                                }
                                            },
                                        );
                                    });
                                });
                            break;
                        }
                    }
                    if (!isFind) {
                        if (sendResponse !== null) sendResponse({responseMsg: false});
                        if (is_alert) {
                            chrome.scripting.executeScript({
                                target: {tabId: tabs[0].id, frameIds: [0]},
                                func: alertPopup,
                                args: ["현재 카페 게시물을 보고 있지 않습니다!"]
                            });
                        }
                    }
                }
            )
        } else {
            if (sendResponse !== null) sendResponse({responseMsg: false});
            // 네이버 카페 주소가 아닌 경우, 사용자가 잘못 눌러도 alert 하지 않는게 사용성에 좋아보여서 주석 처리
            // if (is_alert) {
            //     chrome.scripting.executeScript({
            //         target: {tabId: tabs[0].id, frameIds: [0]},
            //         func: alertPopup,
            //         args: ["네이버 카페 게시물이 아닙니다."]
            //     });
            // }
        }
    });
}

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
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
            addBookMark(sendResponse);
        }
        return true;
    }
)

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, function(tab){
        const currentUrl = tab.url;

        chrome.storage.local.get(['eraseCheckBox'], function(data){
            if (data.eraseCheckBox) {
                chrome.storage.local.get(['hostNameList'], function(data){
                    let isOn = false;

                    if(data['hostNameList'] !== undefined) {
                        for(let idx=0; idx<data['hostNameList'].length; idx++){
                            if(currentUrl.includes(data['hostNameList'][idx])) {
                                // 동작 중임을 표시하는 아이콘 표시
                                chrome.action.setBadgeText({text: 'ON'});
                                chrome.action.setBadgeBackgroundColor({color: '#4688F1'});
                                isOn = true;
                                break;
                            }
                        }
                    }
                    if (!isOn) {
                        // 동작 중임을 표시하는 아이콘 지우기
                        chrome.action.setBadgeText({text: ''});
                        chrome.action.setBadgeBackgroundColor({color: '#00000000'});
                    }
                });
            } else {
                // 동작 중임을 표시하는 아이콘 지우기
                chrome.action.setBadgeText({text: ''});
                chrome.action.setBadgeBackgroundColor({color: '#00000000'});
            }
        });
    });
})

chrome.commands.onCommand.addListener((command) => {
    if (command.toString() === 'add-bookmark') {
        addBookMark(null, true);
    }
});


/*
처음 설치시 확인할 것들
1. 단축키가 겹쳐서 동작하지 않는지
2. 확장프로그램 사용법과 관련된 페이지 뛰우기
 */
// chrome.runtime.onInstalled.addListener((reason) => {
//     if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
//         checkCommandShortcuts();
//     }
// });
//
// function checkCommandShortcuts() {
//     chrome.commands.getAll((commands) => {
//         let missingShortcuts = [];
//
//         for (let {name, shortcut} of commands) {
//             if (shortcut === '') {
//                 missingShortcuts.push(name);
//             }
//         }
//
//         if (missingShortcuts.length > 0) {
//             // Update the extension UI to inform the user that one or more
//             // commands are currently unassigned.
//
//         }
//     });
// }