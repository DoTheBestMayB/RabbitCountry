# RabbitCountry
네이버 카페 게시물 필터링을 도와주는 크롬 확장프로그램 입니다.

[크롬 웹스토어](https://chrome.google.com/webstore/detail/%EB%8B%B9%EA%B7%BC%EB%82%98%EB%9D%BC/efdhlhlgcmepgdejhbnkegfgikopifnm?hl=ko&gl=001&authuser=3)에서도 설치 가능합니다.

문의 사항이 있을 경우 [Issues](https://github.com/DoTheBestMayB/RabbitCountry/issues)에 남겨주세요.

# 안내
[직접 설치방법](https://github.com/DoTheBestMayB/RabbitCountry/blob/master/doc/HowToInstall.md)

[사용방법](https://github.com/DoTheBestMayB/RabbitCountry/blob/master/doc/HowToUse.md)


# 개발 내역

## 2023.04.10
게시물 북마크 단축키 기능 Ctrl+B에서 Ctrl+Shift+E로 수정

[관련 내용](https://github.com/DoTheBestMayB/RabbitCountry/issues/2)

## 2021.12.29
뱃지ON 로직 수정

(필터링 버튼 ON/OFF -> 필터링 버튼 ON/OFF + 현재 탭이 등록된 URL에 속하는지 여부)
## 2021.12.16
게시물 북마크 단축키 기능 구현

## 2021.12.06
작동 ON/OFF 표시하는 뱃지 추가

현재 보고 있는 게시물 북마크 추가 기능 구현 

## 2021.11.10
전역변수 var 없애고 let으로 수정

SiteList 삭제 버튼 오류 수정

## 2021.09.02
alert 대신 snackbar 사용

유저, 카페 목록 추가/삭제 기능 개선

## 2021.08.30
수정된 코드에서 닉네임에 기반한 유저 차단 추가

하지만 chrome.storage에서 차단할 닉네임이 담긴 list를 꺼내오고 비교할때 시간이 소요되어 미세한 깜빡임이 생김

## 2021.08.29
글이 지워질때 깜빡이는 현상 수정

첫번째 글은 적용되지 않는 버그 존재

helped with Stackoverflow user wOxxOm <br/>
[관련 질문](https://stackoverflow.com/questions/68888784/how-to-prevent-hide-and-show-flickering-of-mutationobserver-for-iframe/68891354#68891354) <br/>
[관련 내용](https://github.com/DoTheBestMayB/RabbitCountry/issues/1)

## 2021.06.28
적용 가능한 카페 추가/삭제 구현

## 2021.06.27
닉네임에 기반한 유저 차단 구현

## 2021.06.25
셀러회원으로 등록한 유저의 게시물만 삭제 가능합니다.
- 차단하고자 하는 유저의 닉네임 등록은 추후 추가될 예정
