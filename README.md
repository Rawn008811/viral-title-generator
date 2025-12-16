# Viral Title Generator (후킹 제목 뽑기)

유튜브 영상 스크립트를 분석하여 알고리즘 친화적이고 클릭률(CTR)이 높은 "후킹 제목"을 생성해주는 AI 웹 서비스입니다.
구글의 **Gemini AI**를 활용하여 심리학적 원리(손실 회피, 호기심 등)가 적용된 고효율 제목을 제안합니다.

![Project Preview](./public/preview.png)
*(미리보기 이미지가 있다면 public 폴더에 추가해주세요)*

## ✨ 주요 기능
- **AI 스크립트 분석**: 영상 대본만 넣으면 내용을 완벽하게 파악합니다.
- **4가지 제목 스타일 제안**:
  - 🚨 긴박형 / 손실회피
  - 🧪 실험형 / 호기심
  - 📊 비교형 / 분석형
  - ⚡ 어그로형 / 비법공개
- **썸네일 문구 추천**: 클릭을 유도하는 짧고 강렬한 텍스트 제안.
- **실시간 미리보기**: 깔끔하고 직관적인 UI.

## 🚀 사용 방법
1. 웹사이트에 접속합니다.
2. 우측 상단 **[API 설정]** 버튼을 누릅니다.
3. 본인의 **Google Gemini API Key**를 입력합니다. (키 발급 방법은 아래 참조, 무료입니다!)
4. 스크립트를 업로드하거나 내용을 복사-붙여넣기 합니다.
5. **[제목 분석하기]** 버튼을 클릭하면 5초 뒤에 결과가 나옵니다!

## 🔑 Gemini API Key 발급 방법 (무료)
1. [Google AI Studio](https://aistudio.google.com/app/apikey)에 접속합니다.
2. 구글 계정으로 로그인합니다.
3. **"Create API key"** 버튼을 클릭합니다.
4. 생성된 키를 복사하여 이 웹사이트 설정창에 붙여넣으세요.
   *(키는 브라우저에만 저장되며 서버로 전송되지 않아 안전합니다.)*

## 🛠️ 기술 스택
- **Framework**: React + Vite
- **Language**: JavaScript
- **Styling**: Tailwind CSS, Framer Motion
- **AI**: Google Gemini Pro API

---
Made with ❤️ by Anjunhyeon
