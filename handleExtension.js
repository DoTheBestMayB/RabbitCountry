// 코드 적용할 카페 주소 추가
function addCafeName(cafeName) {
    if (cafeName === '') {
        showToastMessage('값을 입력해 주세요.');
        return
    }
    chrome.storage.local.get(['hostNameList'], function(data){
        let hostNameList = [];

        if(data['hostNameList'] !== undefined){
            hostNameList = data['hostNameList'];
        }

        if(hostNameList.includes(cafeName)){
            showToastMessage(cafeName + ' 이미 등록되었습니다!');
        } else {
            hostNameList.push(cafeName);
            chrome.storage.local.set({
                'hostNameList': hostNameList
            });
            showToastMessage(cafeName + ' 등록되었습니다!');

            document.querySelector('#cafeName').value = '';
            document.querySelector('#cafeName').focus();

            let row = document.querySelector('#siteTbody').insertRow(document.querySelector('#siteTbody').rows.length);
            row.insertCell(0).innerHTML = cafeName;
            row.insertCell(1).innerHTML = '<td>' + '<input type="checkbox" class="hostN"/><button type="button" class="hostElement">삭제</button></td> </td>';
            addDeleteListener('hostElement', 'hostNameList');
        }
    })
}

function addDeleteListener(className, listName) {
    let buttonList = document.querySelectorAll('.'+className);

    for(let button of buttonList) {
        button.addEventListener('click', function() {
            let element = this.parentElement.parentElement;
            let name = element.children[0].textContent;

            chrome.storage.local.get([listName], function(data){
                let nameList = data[listName];
                nameList.splice(nameList.indexOf(name), 1);
                element.remove();
                chrome.storage.local.set({
                    [listName]: nameList
                });
            });
        })
    }
}

function showToastMessage(message) {
    let barElement = document.getElementById('snackbar');
    barElement.innerHTML = message;
    barElement.className = 'show';
    setTimeout(function(){ barElement.className = barElement.className.replace('show', ''); }, 1000);
}

// 유저 테이블 생성
function makeTable(){
    chrome.storage.local.get(['eraseList'], function(data) {
        let eraseList = [];

        if(data['eraseList'] !== undefined){
            eraseList = data['eraseList'];
            for(let idx=0; idx<eraseList.length; idx++){
                let row = document.querySelector('#blockTbody').insertRow(document.querySelector('#blockTbody').rows.length);
                row.insertCell(0).innerHTML = eraseList[idx];
                row.insertCell(1).innerHTML = '<td>' + '<input type="checkbox" class="userN"/> <button type="button" class="userElement">삭제</button></td>';
            }
        }
        addDeleteListener('userElement', 'eraseList');
    });

    chrome.storage.local.get(['hostNameList'], function(data) {
        let hostNameList = [];

        if(data['hostNameList'] !== undefined){
            hostNameList = data['hostNameList'];
            for(let idx=0; idx<hostNameList.length; idx++){
                let row = document.querySelector('#siteTbody').insertRow(document.querySelector('#siteTbody').rows.length);
                row.insertCell(0).innerHTML = hostNameList[idx];
                row.insertCell(1).innerHTML = '<td>' + '<input type="checkbox" class="hostN"/><button type="button" class="hostElement">삭제</button></td> </td>';
            }
        }
        addDeleteListener('hostElement', 'hostNameList');
    });
}

// 값을 가져오기
chrome.storage.local.get(['eraseCheckBox', 'eraseVIP'], function(data){
    document.querySelector('#eraseButton').checked = data.eraseCheckBox;
    document.querySelector('#blockVipUser').checked = data.eraseVIP;
});

// 업자, 등록된 유저 삭제하기
document.getElementById('eraseButton').addEventListener('change', function() {
    if(this.checked){
        // 동작 중임을 표시하는 아이콘 표시
        chrome.action.setBadgeText({text: 'ON'});
        chrome.action.setBadgeBackgroundColor({color: '#4688F1'});
        // 크롬 스토리지에 상태 저장
        chrome.storage.local.set({
            'eraseCheckBox': this.checked
        }, _ => {
            chrome.runtime.sendMessage({ msg: 'eraseDealer'});
        });
    } else{
        // 동작 중임을 표시하는 아이콘 지우기
        chrome.action.setBadgeText({text: ''});
        chrome.action.setBadgeBackgroundColor({color: '#00000000'});
        // 크롬 스토리지에 상태 저장
        chrome.storage.local.set({
            'eraseCheckBox': this.checked
        }, _ => {
            chrome.runtime.sendMessage({ msg: 'eraseDealer'});
        });
    }
});

// 최고등급 유저 차단 반영
document.getElementById('blockVipUser').addEventListener('change', function() {
    // 크롬 스토리지에 상태 저장
    chrome.storage.local.set({
        'eraseVIP': this.checked
    });
});

//차단하고 싶은 유저를 입력하고 버튼을 눌렀을 때, 차단하는 유저 반영
document.getElementById('userAddButton').addEventListener('click', function() {
    const sellerName = document.querySelector('#sellerName').value;

    if (sellerName === '') {
        showToastMessage('값을 입력해 주세요.');
        return
    }

    chrome.storage.local.get(['eraseList'], function(data){
        let eraseList = [];

        if(data['eraseList'] !== undefined){
            eraseList = data['eraseList'];
        }

        if(eraseList.includes(sellerName)){
            showToastMessage(sellerName + ' 이미 등록되었습니다!');
        } else {
            eraseList.push(sellerName);
            chrome.storage.local.set({
                'eraseList': eraseList
            });
            showToastMessage(sellerName + ' 등록되었습니다!');

            document.querySelector('#sellerName').value = '';
            document.querySelector('#sellerName').focus();

            let row = document.querySelector('#blockTbody').insertRow(document.querySelector('#blockTbody').rows.length);
            row.insertCell(0).innerHTML = sellerName;
            row.insertCell(1).innerHTML = '<td>' + '<input type="checkbox" class="userN"/> <button type="button" class="userElement">삭제</button></td>';
            addDeleteListener('userElement', 'eraseList');
        }
    })
});

// 차단 유저 삭제하기
document.getElementById('eraseUser').addEventListener('click', function() {
    let uList = document.getElementsByClassName('userN');
    if (uList.length > 0) {
        chrome.storage.local.get(['eraseList'], function(data){
            let eraseList = data['eraseList'];
            for(let idx=uList.length - 1; idx>=0; idx--){
                if(uList[idx].checked){
                    eraseList.splice(idx, 1);
                    uList[idx].parentElement.parentElement.remove();
                }
            }
            chrome.storage.local.set({
                'eraseList': eraseList
            });
        });
    }
});

// 유저 모두 선택/해제
document.getElementById('selectAllUser').addEventListener('click', function() {
    const uList = document.getElementsByClassName('userN');

    if (uList.length > 0) {
        for (const userElement of uList) {
            userElement.checked = !userElement.checked;
        }
    }
});

// 호스트 주소 모두 선택/해제
document.getElementById('selectAllSite').addEventListener('click', function() {
    const uList = document.getElementsByClassName('hostN');

    if (uList.length > 0) {
        for (const hostElement of uList) {
            hostElement.checked = !hostElement.checked;
        }
    }
});

// 코드 적용 가능한 카페 리스트에 현재 카페 주소 추가하기
document.getElementById('nowCafeAddButton').addEventListener('click', function() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        if(tabs[0].url.includes('cafe.naver.com')) {
            addCafeName(tabs[0].url.split('/').at(3));
        } else {
            showToastMessage('네이버 카페 주소가 아닙니다!');
        }
    });
});

// 코드 적용 가능한 카페 리스트에 입려한 카페 주소 추가하기
document.getElementById('cafeAddButton').addEventListener('click', function() {
    addCafeName(document.querySelector('#cafeName').value);
});

// checkBox로 선택된 카페를 코드 적용 가능한 카페 리스트에서 제거 하기
document.getElementById('eraseSite').addEventListener('click', function() {
    let uList = document.getElementsByClassName('hostN');
    if(uList.length > 0){
        chrome.storage.local.get(['hostNameList'], function(data){
            let hostNameList = data['hostNameList'];
            for(let idx=uList.length - 1; idx>=0; idx--){
                if(uList[idx].checked){
                    hostNameList.splice(idx, 1);
                    uList[idx].parentElement.parentElement.remove();
                }
            }
            chrome.storage.local.set({
                'hostNameList': hostNameList
            });
        });
    }
});

// 현재 보고 있는 게시물 북마크 추가
document.getElementById('addBookMark').addEventListener('click', function() {
    chrome.runtime.sendMessage({ msg: 'addBookMark'}, (response) => {
        console.log("result is " + response.responseMsg);
        if (response.responseMsg === true) {
            showToastMessage("'당근나라' 폴더에 추가되었습니다!");
        } else {
            showToastMessage("북마크 추가가 되지 않았습니다.");
        }
    });
})

window.onload = makeTable;