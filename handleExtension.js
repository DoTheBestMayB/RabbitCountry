// 값을 가져오기
chrome.storage.local.get(['eraseCheckBox'], function(data){
    document.querySelector('#eraseButton').checked = data.eraseCheckBox;
})

// 업자, 등록된 유저 삭제하기
document.getElementById('eraseButton').addEventListener("change", function(){
    if(this.checked){
        // 크롬 스토리지에 상태 저장
        chrome.storage.local.set({
            'eraseCheckBox': this.checked
        }, _ => {
            chrome.runtime.sendMessage({ msg: "handleExtension", mutation: true});
        });
    } else{
        // 크롬 스토리지에 상태 저장
        chrome.storage.local.set({
            'eraseCheckBox': this.checked
        }, _ => {
            chrome.runtime.sendMessage({ msg: "handleExtension", mutation: false});
        });
    }
});

//차단하고 싶은 유저를 입력하고 버튼을 눌렀을 때, 차단하는 유저 반영
document.getElementById('userAddButton').addEventListener("click", function(){
    let sellerName = document.querySelector('#sellerName').value;

    chrome.storage.local.get(['eraseList'], function(data){
        var eraseList = [];

        console.log(data);
        if(data['eraseList'] != undefined){
            // eraseList = data['eraseList'];
            eraseList = data['eraseList'];
            console.log("There's eraseList");
            console.log(eraseList);
        }

        if(eraseList.includes(sellerName)){
            alert(sellerName + " 이미 등록되었습니다!");
        } else {
            eraseList.push(sellerName);
            chrome.storage.local.set({
                'eraseList': eraseList
            });
            alert(sellerName + " 등록되었습니다!");
            var tbody = document.querySelector('#blockTbody');
            var row = document.querySelector('#blockTbody').insertRow(tbody.rows.length);
            var cellName = row.insertCell(0);
            var cellButton = row.insertCell(1);
            cellName.innerHTML = sellerName;
            cellButton.innerHTML = '<td>' + '<input type="checkbox" id="tableN' + sellerName + '">삭제</input> </td>';
        }
    })
});

// 차단 유저 삭제하기
document.getElementById('eraseUser').addEventListener("click", function(){
    var uList = document.getElementsByClassName('tableN');
    if(uList.length > 0){
        chrome.storage.local.get(['eraseList'], function(data){
            var eraseList = data['eraseList'];
            for(var idx=uList.length - 1; idx>=0; idx--){
                console.log(idx);
                console.log(uList[idx]);
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

// 유저 테이블 생성
function makeTable(){
    chrome.storage.local.get(['eraseList'], function(data){
        var eraseList = [];
        var html = '';

        if(data['eraseList'] != undefined){
            eraseList = data['eraseList'];
            var tbody = document.querySelector('#blockTbody');
            for(var idx=0; idx<eraseList.length; idx++){
                var row = document.querySelector('#blockTbody').insertRow(tbody.rows.length);
                var cellName = row.insertCell(0);
                var cellButton = row.insertCell(1);
                cellName.innerHTML = eraseList[idx];
                cellButton.innerHTML = '<td>' + '<input type="checkbox" class="tableN">삭제</input> </td>';
            }


            // $("#blockTbody").empty();
            // $("#blockTbody").append(html);
        }
    });
}

window.onload = makeTable;