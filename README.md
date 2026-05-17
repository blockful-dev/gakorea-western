# 지에이코리아 웨스턴지사

서울 강서구 소재 GA(General Agency) 보험대리점 회사소개 홈페이지.
모바일 우선 반응형 정적 사이트.

## 스택

- **Astro 6** — 정적 사이트 생성 (SSG)
- **Tailwind CSS v4** — `@tailwindcss/vite` 플러그인 + `@theme` 토큰
- **Pretendard Variable** — jsDelivr CDN, 한글 본문 가독성
- **TypeScript strict**

## 디렉터리 구조

```
src/
├── components/
│   ├── Header.astro       — 데스크톱 nav + 모바일 햄버거
│   ├── Footer.astro       — 회사 정보, 영업시간, 사업자번호
│   └── StickyCTA.astro    — 모바일 하단 고정 전화/카톡 CTA
├── config/
│   └── site.ts            — 회사 정보, 연락처, 제휴 보험사 목록 (단일 진실 소스)
├── layouts/
│   └── Layout.astro       — 공통 레이아웃 (head, header, footer, sticky CTA)
├── pages/
│   ├── index.astro        — 홈 (hero, 서비스 6개, 강점 3개, CTA)
│   ├── about.astro        — 회사소개 (가치, 취급 보험사 26개, 연혁, 오시는 길)
│   ├── services.astro     — 보험상품 6개 카테고리 + 상담 절차 3단계
│   └── contact.astro      — 연락처 + mailto 폼
└── styles/
    └── global.css         — Tailwind import, Pretendard @font-face, 컬러 토큰
```

## 명령어

| 명령어            | 동작                            |
| :---------------- | :------------------------------ |
| `npm install`     | 의존성 설치                     |
| `npm run dev`     | 개발 서버 (`localhost:4321`)    |
| `npm run build`   | 프로덕션 빌드 → `dist/`         |
| `npm run preview` | 빌드 결과 로컬 미리보기         |

## 콘텐츠 수정 가이드

회사 정보, 제휴 보험사, 영업시간 등 텍스트는 모두 **`src/config/site.ts`** 에서 관리합니다.
페이지 마크업을 손대지 말고 config 만 갈아끼우면 전체 사이트에 반영됩니다.

```ts
// 예: 전화번호 변경
contact: {
  phone: "02-XXXX-XXXX",
  phoneHref: "tel:+8202XXXXXXXX",
  ...
}

// 예: 제휴 보험사 추가
partners: {
  life: [
    { name: "신규생명", domain: "newco.co.kr" },
    ...
  ],
}
```

### 보험사 로고

`/about` 의 "취급 보험사" 섹션은 [Clearbit Logo CDN](https://clearbit.com/logo) 에서 도메인 기반으로 로고를 동적 로드합니다.
- 도메인이 Clearbit DB 에 없으면 자동으로 회사명 텍스트로 폴백
- 특정 로고를 직접 호스팅하려면 `public/logos/{slug}.svg` 추가 후 `about.astro` 의 `img src` 를 로컬 경로로 변경

### 색상 테마 (브랜드 CI 적용)

`src/styles/global.css` 의 `@theme` 블록 내 `--color-brand-*` 50~950 값만 교체하면 사이트 전반의 brand 색상이 일괄 적용됩니다.

### 네이버 지도

`src/config/site.ts` 의 `contact.naverMapUrl` 에 네이버 지도 place URL 입력. `/about` 의 "오시는 길" 카드 클릭 시 새 창으로 열립니다.

## 미해결 항목 (placeholder 사용 중)

| 항목                  | 현재 값                          | 변경 위치                       |
| :-------------------- | :------------------------------- | :------------------------------ |
| 대표 전화번호         | `02-1234-5678`                   | `site.ts` › `contact.phone`     |
| 대표 이메일           | `contact@gakorea-western.com`    | `site.ts` › `contact.email`     |
| 대표자명              | `홍길동`                         | `site.ts` › `business.representative` |
| 사업자등록번호        | `000-00-00000`                   | `site.ts` › `business`          |
| 보험대리점 등록번호   | `0000000000`                     | `site.ts` › `business`          |
| KakaoTalk 채널        | `null` (비활성)                  | `site.ts` › `contact.kakaoChannelId` |
| 회사 연혁             | 2018-2025 더미 마일스톤          | `src/pages/about.astro`         |
| 문의 폼 백엔드        | `mailto:` action                 | `src/pages/contact.astro`       |

## 배포 (Vercel)

GitHub repo 와 Vercel 을 연동하면 `main` 푸시마다 자동 배포됩니다.

1. **GitHub repo 생성 후 push**
   ```bash
   git remote add origin git@github.com:<org>/<repo>.git
   git push -u origin main
   ```
2. **Vercel 에서 import** — [vercel.com/new](https://vercel.com/new) → GitHub repo 선택
3. **빌드 설정** — Vercel 이 Astro 를 자동 감지합니다. 수동 입력이 필요하면:
   - Framework Preset: `Astro`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. **Deploy** 클릭 → 자동으로 `*.vercel.app` 도메인 발급. 이후 커스텀 도메인은 Project Settings → Domains 에서 연결.

다른 정적 호스팅 (Netlify / Cloudflare Pages) 도 동일하게 `npm run build` → `dist/` 로 배포 가능합니다.
