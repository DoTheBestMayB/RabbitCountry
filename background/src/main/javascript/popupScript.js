function clickTab(evt, tabName) {
    // Get all elements with class="tabContent" and hide them
    let tabContent = document.getElementsByClassName("tabContent");
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    // Get all elements with class="tabLinks" and remove the class "active"
    let tabLinks = document.getElementsByClassName("tabLinks");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

document.addEventListener('DOMContentLoaded', function() {
    // 이 부분 storage 이용해서 이전에 클릭했던 마지막 tab 클릭하도록 수정해야 함
    clickTab(event, 'Home');

    document.getElementById('HomeTab').addEventListener('click', function () {
        clickTab(event, 'Home');
    });

    document.getElementById('BlockTab').addEventListener('click', function () {
        clickTab(event, 'BlockList');
    });

    document.getElementById('SiteTab').addEventListener('click', function () {
        clickTab(event, 'Site');
    });

    document.getElementById('EtcTab').addEventListener('click', function () {
        clickTab(event, 'Etc');
    });
});

document.getElementById('goGithub').addEventListener("click", function(){
    window.open('https://github.com/DoTheBestMayB/RabbitCountry');
});