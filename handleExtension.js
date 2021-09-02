// 코드 적용할 카페 주소 추가
function add_cafe_name(cafeName) {
    if (cafeName == '') {
        show_toast_message('값을 입력해 주세요.');
        return
    }
    chrome.storage.local.get(['hostNameList'], function(data){
        var hostNameList = [];

        if(data['hostNameList'] != undefined){
            hostNameList = data['hostNameList'];
        }

        if(hostNameList.includes(cafeName)){
            show_toast_message(cafeName + ' 이미 등록되었습니다!');
        } else {
            hostNameList.push(cafeName);
            chrome.storage.local.set({
                'hostNameList': hostNameList
            });
            show_toast_message(cafeName + ' 등록되었습니다!');
            document.querySelector('#cafeName').value = '';
            document.querySelector('#cafeName').focus();
            var tbody = document.querySelector('#siteTbody');
            var row = document.querySelector('#siteTbody').insertRow(tbody.rows.length);
            var cellName = row.insertCell(0);
            var cellButton = row.insertCell(1);
            cellName.innerHTML = cafeName;
            cellButton.innerHTML = '<td>' + '<input type="checkbox" class="hostN"/><button type="button" class="hostElement">삭제</button></td> </td>';
            add_delete_listener('hostElement');
        }
    })
}

function add_delete_listener(className) {
    var buttonList = document.querySelectorAll('.'+className);
    for(var button of buttonList) {
        button.addEventListener('click', function() {
            var element = this.parentElement.parentElement
            var name = element.children[0].textContent
            chrome.storage.local.get(['eraseList'], function(data){
                var eraseList = data['eraseList'];
                eraseList.splice(eraseList.indexOf(name), 1);
                element.remove();
                chrome.storage.local.set({
                    'eraseList': eraseList
                });
            });
        })
    }
}

function show_toast_message(message) {
    var barElement = document.getElementById('snackbar');
    barElement.innerHTML = message;

    barElement.className = 'show';
    setTimeout(function(){ barElement.className = barElement.className.replace('show', ''); }, 1000);

}

// 값을 가져오기
chrome.storage.local.get(['eraseCheckBox'], function(data){
    document.querySelector('#eraseButton').checked = data.eraseCheckBox;
})

// 업자, 등록된 유저 삭제하기
document.getElementById('eraseButton').addEventListener('change', function() {
    if(this.checked){
        // 크롬 스토리지에 상태 저장
        chrome.storage.local.set({
            'eraseCheckBox': this.checked
        }, _ => {
            chrome.runtime.sendMessage({ msg: 'handleExtension', mutation: true});
        });
    } else{
        // 크롬 스토리지에 상태 저장
        chrome.storage.local.set({
            'eraseCheckBox': this.checked
        }, _ => {
            chrome.runtime.sendMessage({ msg: 'handleExtension', mutation: false});
        });
    }
});

//차단하고 싶은 유저를 입력하고 버튼을 눌렀을 때, 차단하는 유저 반영
document.getElementById('userAddButton').addEventListener('click', function() {
    let sellerName = document.querySelector('#sellerName').value;

    if (sellerName == '') {
        show_toast_message('값을 입력해 주세요.');
        return
    }

    chrome.storage.local.get(['eraseList'], function(data){
        var eraseList = [];

        if(data['eraseList'] != undefined){
            // eraseList = data['eraseList'];
            eraseList = data['eraseList'];
        }

        if(eraseList.includes(sellerName)){
            show_toast_message(sellerName + ' 이미 등록되었습니다!');
        } else {
            eraseList.push(sellerName);
            chrome.storage.local.set({
                'eraseList': eraseList
            });
            show_toast_message(sellerName + ' 등록되었습니다!');
            document.querySelector('#sellerName').value = '';
            document.querySelector('#sellerName').focus();
            var tbody = document.querySelector('#blockTbody');
            var row = document.querySelector('#blockTbody').insertRow(tbody.rows.length);
            var cellName = row.insertCell(0);
            var cellButton = row.insertCell(1);
            cellName.innerHTML = sellerName;
            cellButton.innerHTML = '<td>' + '<input type="checkbox" class="userN"/> <button type="button" class="userElement">삭제</button></td>';
            add_delete_listener('userElement');
        }
    })
});

// 차단 유저 삭제하기
document.getElementById('eraseUser').addEventListener('click', function() {
    var uList = document.getElementsByClassName('userN');
    if (uList.length > 0) {
        chrome.storage.local.get(['eraseList'], function(data){
            var eraseList = data['eraseList'];
            for(var idx=uList.length - 1; idx>=0; idx--){
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
    var uList = document.getElementsByClassName('userN');

    if (uList.length > 0) {
        for (const userElement of uList) {
            userElement.checked = !userElement.checked;
        }
    }
})

// 호스트 주소 모두 선택/해제
document.getElementById('selectAllSite').addEventListener('click', function() {
    var uList = document.getElementsByClassName('hostN');

    if (uList.length > 0) {
        for (const hostElement of uList) {
            hostElement.checked = !hostElement.checked;
        }
    }
})

// 코드 적용 가능한 카페 리스트에 현재 카페 주소 추가하기
document.getElementById('nowCafeAddButton').addEventListener('click', function() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        if(url.includes('cafe.naver.com')) {
            add_cafe_name(url.split('/').at(3));
        } else {
            show_toast_message('네이버 카페 주소가 아닙니다!');
        }
    });
});

// 코드 적용 가능한 카페 리스트에 입려한 카페 주소 추가하기
document.getElementById('cafeAddButton').addEventListener('click', function() {
    var cafeName = document.querySelector('#cafeName').value;
    add_cafe_name(cafeName);
});

// checkBox로 선택된 카페를 코드 적용 가능한 카페 리스트에서 제거 하기
document.getElementById('eraseSite').addEventListener('click', function() {
    var uList = document.getElementsByClassName('hostN');
    if(uList.length > 0){
        chrome.storage.local.get(['hostNameList'], function(data){
            var hostNameList = data['hostNameList'];
            for(var idx=uList.length - 1; idx>=0; idx--){
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

// 유저 테이블 생성
function makeTable(){
    chrome.storage.local.get(['eraseList'], function(data) {
        var eraseList = [];

        if(data['eraseList'] != undefined){
            eraseList = data['eraseList'];
            var tbody = document.querySelector('#blockTbody');
            for(var idx=0; idx<eraseList.length; idx++){
                var row = document.querySelector('#blockTbody').insertRow(tbody.rows.length);
                var cellName = row.insertCell(0);
                var cellButton = row.insertCell(1);
                cellName.innerHTML = eraseList[idx];
                cellButton.innerHTML = '<td>' + '<input type="checkbox" class="userN"/> <button type="button" class="userElement">삭제</button></td>';
            }

        }

        add_delete_listener('userElement');
    });



    chrome.storage.local.get(['hostNameList'], function(data) {
        var hostNameList = [];

        if(data['hostNameList'] != undefined){
            hostNameList = data['hostNameList'];
            var tbody = document.querySelector('#siteTbody');
            for(var idx=0; idx<hostNameList.length; idx++){
                var row = document.querySelector('#siteTbody').insertRow(tbody.rows.length);
                var cellName = row.insertCell(0);
                var cellButton = row.insertCell(1);
                cellName.innerHTML = hostNameList[idx];
                cellButton.innerHTML = '<td>' + '<input type="checkbox" class="hostN"/><button type="button" class="hostElement">삭제</button></td> </td>';
            }

        }

        add_delete_listener('hostElement');
    });

}

window.onload = makeTable;