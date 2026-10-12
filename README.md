# 세일사이드 홈페이지 배포 가이드

## 폴더 구성
- `index.html` — 공식 홈페이지 (홈 / 카드매출 선정산 / 장래매출채권 유동화 / 회사소개)
- `consult/index.html` — 상담 랜딩페이지 (주소: /consult/)
- `assets/` — 실행 스크립트(support.js)와 이미지
- `netlify.toml`, `robots.txt`, `404.html` — 배포 설정

관리자 CRM, 데모 로그인, 샘플 고객 DB, 백업·기획 문서는 이 폴더에 포함되어 있지 않습니다.

## 현재 공개 상태 (반드시 읽어 주세요)
- 랜딩의 상담 폼은 **접수되지 않습니다.** 화면에 준비 중 안내가 표시되고, 제출 버튼은 비활성화되어 있으며, 입력한 정보는 어디에도 전송·저장되지 않습니다. 광고·SNS 유입을 시작하기 전에 상담 접수 서버와 개인정보 처리방침 페이지가 먼저 필요합니다.
- 회사 확인 전 문구(카드매출 "다음 날 오전 중" 지급, "은행권 근무 경험")는 이 배포본의 소스에서도 제거된 중립 문구입니다. 회사 확인이 끝나면 원본 파일(Salesaid Site.dc.html, Salesaid Landing.dc.html)의 확정 문구로 다시 배포용 파일을 만들어야 하므로 알려 주세요.
- 랜딩은 접수 시스템이 준비되기 전까지 검색에 노출되지 않도록 `noindex`가 걸려 있습니다. 운영을 시작할 때 `consult/index.html`에서 `<meta name="robots" content="noindex">` 줄을 지우세요.

## GitHub Pages 프로젝트 주소(/salesaid/)에서 쓰는 경우
- 모든 경로는 상대 경로라서 `https://계정.github.io/salesaid/` 주소에서 그대로 동작합니다. 말풍선은 `consult/`로 이동합니다(→ `/salesaid/consult/`).
- 업로드 후 저장소 루트에 **index.html, consult 폴더, assets 폴더**가 모두 보여야 합니다. 폴더가 안 보이면 파일만 올라간 것입니다. 압축을 푼 폴더 **안의 항목 전체를 선택해 끌어다 놓거나**, GitHub Desktop 사용을 권장합니다.
- Settings → Pages → Branch: main / (root) 로 지정합니다.
- 공유 미리보기 주소(og)는 `https://3428suni.github.io/salesaid`로 설정되어 있습니다. 다른 주소로 옮기면 두 html의 해당 주소를 바꾸세요.

## 1. ZIP 풀기
salesaid-deploy.zip을 풀면 위 폴더 구성이 나옵니다.

## 2. GitHub 비공개 저장소 만들기
1. github.com 로그인 → 오른쪽 위 **+** → **New repository**
2. 이름 입력(예: salesaid-site), **Private** 선택 → **Create repository**
3. 저장소 화면의 **uploading an existing file** 클릭
4. 풀어 둔 폴더 **안의 내용 전체**(index.html, consult, assets, netlify.toml 등)를 끌어다 놓고 **Commit changes**
   (폴더 자체가 아니라 폴더 안의 내용을 올려야 합니다)

## 3. Netlify 연결
1. app.netlify.com 가입/로그인 → **Add new site** → **Import an existing project**
2. **GitHub** 선택 → 권한 허용 → 위 저장소 선택
3. 설정: Build command는 **비워 두고**, Publish directory는 **.** (점 하나). netlify.toml에 이미 들어 있습니다.
4. **Deploy** 클릭

## 4. 임시 주소 확인과 공유 미리보기 설정
1. 배포가 끝나면 `https://무작위이름.netlify.app` 주소가 생깁니다. 접속해서 홈페이지와 말풍선(→ /consult/)을 확인하세요.
2. 카카오톡·SNS 공유 미리보기용 주소를 채워야 합니다. `index.html`과 `consult/index.html`에서 `__SITE_URL__`을 모두 실제 주소(예: `https://무작위이름.netlify.app`, 끝에 슬래시 없이)로 바꾸세요. 이 값이 바뀌기 전에는 공유 미리보기 이미지가 나오지 않습니다.
3. 공유 이미지는 `assets/img/og-image.png`입니다. 사용 권한이 확인된 대표 이미지(권장 1200×630)로 같은 이름으로 교체하는 것을 권장합니다.

## 5. 정식 도메인 연결
1. 도메인을 구매합니다(가비아, 후이즈 등).
2. Netlify → **Domain management** → **Add a domain** → 안내에 따라 네임서버 또는 DNS 레코드를 설정합니다.
3. 연결된 뒤 `__SITE_URL__`로 바꿨던 주소를 정식 도메인(https://...)으로 다시 바꿔 재배포합니다.

## 6. 수정 후 재배포
GitHub 저장소에서 파일을 열어 연필(Edit) 아이콘으로 수정하거나 새 파일을 업로드하고 **Commit** 하면 Netlify가 자동으로 다시 배포합니다.

## 참고
- 폰트(Pretendard)는 외부 CDN에서 불러옵니다.
- 홈페이지 화면 전환은 `#home`, `#products/card-sales` 같은 해시 주소 방식입니다. 상품별 독립 주소(SEO)는 포함되어 있지 않습니다.
- 상담 접수 서버를 연결하면 원본 파일(Salesaid Landing.dc.html)에 보관된 접수 코드를 사용해 활성화합니다.
