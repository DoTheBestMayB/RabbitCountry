function clickTab(evt, tabName) {
    // Declare all variables
    let i, tabContent, tabLinks;

    // Get all elements with class="tabcontent" and hide them
    tabContent = document.getElementsByClassName("tabContent");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tabLinks = document.getElementsByClassName("tabLinks");
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

document.addEventListener('DOMContentLoaded', function() {
    // 이 부분 storage 이용해서 이전에 클릭했던 마지막 tab 클릭하도록 수정해야 함
    clickTab(event, 'Home');

    let homeTab = document.getElementById('HomeTab');
    homeTab.addEventListener('click', function () {
        clickTab(event, 'Home');
    });

    let blockTab = document.getElementById('BlockTab');
    blockTab.addEventListener('click', function () {
        clickTab(event, 'BlockList');
    });

    let siteTab = document.getElementById('SiteTab');
    siteTab.addEventListener('click', function () {
        clickTab(event, 'Site');
    });

    let etcTab = document.getElementById('EtcTab');
    etcTab.addEventListener('click', function () {
        clickTab(event, 'Etc');
    });
});

document.getElementById('goGithub').addEventListener("click", function(){
    window.open('https://github.com/DoTheBestMayB/RabbitCountry');
});