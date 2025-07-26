# 감정 테스트 게임 (Emotion Test Game)

아름다운 감정의 나라에서 펼쳐지는 인터랙티브 감정 테스트 게임입니다.

## 빠른 시작

### 필수 요구사항

- **Node.js**: 18.19.0 이상
- **npm**: 9.0.0 이상

### 설치 및 실행

1. **프로젝트 클론**
   ```bash
   git clone [repository-url]
   cd Emotion-Front
   ```

2. **Node.js 버전 확인 및 설정**
   ```bash
   # nvm 사용 시 (권장)
   nvm use
   
   # 또는 수동으로 버전 확인
   node --version  # 18.19.0 이상이어야 함
   ```

3. **의존성 설치**
   ```bash
   npm run setup
   # 또는
   npm install
   ```

4. **개발 서버 실행**
   ```bash
   npm start
   # 또는
   npm run dev
   ```

5. **브라우저에서 확인**
   ```
   http://localhost:5173
   ```

## 사용 가능한 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm start` | 개발 서버 실행 (기본 포트: 5173) |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드된 파일 미리보기 |
| `npm run lint` | 코드 린팅 |
| `npm run setup` | 의존성 설치 |
| `npm run clean` | node_modules 삭제 후 재설치 |

## 문제 해결

### 의존성 문제가 발생하는 경우
```bash
# 캐시 삭제 후 재설치
npm cache clean --force
npm run clean
```

### Node.js 버전 문제
```bash
# nvm으로 올바른 버전 설치
nvm install 18.19.0
nvm use 18.19.0
```

### 포트 충돌 문제
```bash
# 다른 포트로 실행
npm run dev -- --port 3000
```

## 기술 스택

- **Frontend**: React 19.1.0, TypeScript
- **Build Tool**: Vite 7.0.4
- **Styling**: Tailwind CSS 3.4.3
- **Animation**: Framer Motion 12.23.9
- **Routing**: React Router DOM 7.7.1
- **Charts**: Recharts 3.1.0
- **Confetti**: Canvas Confetti 1.9.3

## 프로젝트 구조

```
Emotion-Front/
├── src/
│   ├── components/     # 재사용 가능한 컴포넌트
│   ├── pages/         # 페이지 컴포넌트
│   ├── assets/        # 이미지, 사운드 등 정적 파일
│   ├── utils/         # 유틸리티 함수
│   └── main.tsx       # 앱 진입점
├── public/            # 공개 정적 파일
├── package.json       # 프로젝트 설정 및 의존성
├── .nvmrc            # Node.js 버전 설정
└── README.md         # 프로젝트 문서
```

## 게임 특징

- **감정 인식 테스트**: 다양한 감정을 학습하고 테스트
- **인터랙티브 UI**: 부드러운 애니메이션과 시각적 효과
- **진행도 추적**: 실시간 진행 상황 표시
- **결과 분석**: 상세한 테스트 결과 제공
- **반응형 디자인**: 다양한 화면 크기에 최적화

## 개발 환경 설정

### VS Code 추천 확장 프로그램
- ESLint
- Prettier
- TypeScript Importer
- Tailwind CSS IntelliSense

### 환경 변수 설정
```bash
# .env.local 파일 생성 (필요시)
VITE_API_URL=your_api_url_here
```

## 빌드 및 배포

### 프로덕션 빌드
```bash
npm run build
```

### 빌드 결과 확인
```bash
npm run preview
```

### 배포
빌드된 `dist` 폴더의 내용을 웹 서버에 업로드하세요.

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해주세요.

---

즐거운 감정 테스트 되세요!
