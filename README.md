# Tinder-Clone-coding
![image](https://user-images.githubusercontent.com/72438873/184149855-bf69d19e-46e0-41a5-8655-96b267fe0e7b.png)

- 시연 영상 : https://youtu.be/_2nsTVwVXRk

<br>

## 😃 Tinder-Clone-coding 소개
소셜 디스커버리 어플리케이션 Tinder를 clone-coding 해보았습니다.

<br>

## ⏰개발기간
2022년 6월 17일 ~ 2022년 6월 23일(1주)

<br>

## ⚒️ BE개발 스택
![](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)
![](https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white)
![](https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![](https://img.shields.io/badge/amazonaws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)\
<img src="https://img.shields.io/badge/mongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white">
![](https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

<br>

## 📖 라이브러리

라이브러리 | 설명
---|:---:
<img src='https://img.shields.io/badge/bcrypt-5.0.1-lightgrey'> | 비밀번호 암호화
<img src='https://img.shields.io/badge/dotenv-16.0.1-lightgrey'>  | 환경변수 관리
<img src='https://img.shields.io/badge/joi-17.6.0-lightgrey'>  | 입력데이터 검출
<img src='https://img.shields.io/badge/multer--s3-2.10.0-lightgrey'>  | 서버내 이미지 저장

<br>

## 🖊 서비스의 주요기능

#### ✅ **추천 알고리즘 조건**
- 자신을 좋아요 누른사람 우선 순위 추천 
- 자신을 싫어요 누른사람은 추천 안함
- 양쪽이 좋아요 눌렀을 경우 추천 안함
- 내가 좋아요 누른사람은 추천 목록에 안뜸
- 위의 모든 조건을 충족한 사람중 2명 랜덤 추천
- 추천할 사람이 없을 경우 '추천할 사람이 없습니다' 예외처리

#### ✅ **좋아요, 싫어요 기능**
#### ✅ **개인정보 수정, 카테고리 등록 수정**
#### ✅ **실시간 채팅기능**

<br>

## ❗ 구현 후 개선한 부분

### ✔️ 추천 알고리즘 개선

- **문제상황**

  - 추천 알고리즘 구현 시 모든 유저의 정보를 불러와 추천 조건에 맞지 않는 인원을\
   filter를 이용하여 전부 배제하고, 난수를 이용해 랜덤 2명 추천을 구현함
  
  - 가독성도 떨어지고, 리소스적인 면에서도 비효율적이라고 판단

- **해결방안**

  - aggregate(집계) 기능을 이용하여, 주어진 조건 검색과 함께 랜덤 2명 검색도 같이 진행
  
    - 가독성 향상 및 리소스 낭비 개선
 

<br>

## 📌 팀원소개 및 역할

### 백엔드
|Name|Github|맡은 역할|
|:---:|:---:|:---:|
| 김형근 | https://github.com/fnvkd5316 | 메인페이지( 추천 알고리즘 ), 개인정보 페이지 |
| 윤형진 | https://github.com/engin9803 | 회원가입, 로그인 페이지 |
| 유승완 | https://github.com/avo1032 | 실시간 채팅 구현 |
