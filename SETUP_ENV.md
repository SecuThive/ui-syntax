# 환경변수 설정 가이드

## Vercel 프로젝트 환경변수
프로젝트 Settings → Environment Variables에 다음을 추가:

```
DATABASE_URL=postgresql://postgres.fprfcnkyvlasrzbcmkxa:0907Aass%21%40%21%40@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
```

**중요**: 비밀번호의 특수문자 URL 인코딩 확인:
- `!` → `%21`
- `@` → `%40`
- 원본: `0907Aass!@!@`
- 인코딩: `0907Aass%21%40%21%40`

---

## GitHub Repository Secrets
Repository → Settings → Secrets and variables → Actions → New repository secret

### 필수 시크릿:

1. **DATABASE_URL**
   ```
   postgresql://postgres.fprfcnkyvlasrzbcmkxa:0907Aass%21%40%21%40@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
   ```

2. **GOOGLE_API_KEY**
   ```
   AIzaSyCjm_5Qi8o2t7ImWQi0ixpfgAumnGS-aNg
   ```

3. **API_BASE** (Vercel 배포 후 얻은 URL)
   ```
   https://your-app.vercel.app
   ```
   예시: `https://ui-syntax.vercel.app` 또는 커스텀 도메인

4. **GEMINI_MODEL** (선택사항, 기본값: gemini-2.0-flash-exp)
   ```
   gemini-2.0-flash-exp
   ```

---

## Gemini 모델명 참고
- `gemini-2.0-flash-exp` (실험 버전, 빠르고 최신)
- `gemini-1.5-flash` (안정 버전)
- `gemini-1.5-pro` (고성능 버전)

"2.5-flash"는 아직 공식 모델명이 아니므로 `gemini-2.0-flash-exp`를 권장합니다.
실제 사용 가능한 모델은 Google AI Studio에서 확인하세요:
https://aistudio.google.com/

---

## 설정 순서

1. **Vercel 배포**
   - GitHub 리포(`SecuThive/ui-syntax`)를 Vercel에 연결
   - 자동 배포 대기
   - 배포 완료 후 URL 확인 (예: https://ui-syntax-xyz.vercel.app)

2. **Vercel 환경변수 설정**
   - `DATABASE_URL` 추가 (위 값 사용)
   - 저장 후 재배포(Redeploy)

3. **GitHub Secrets 설정**
   - 위 4개 시크릿 추가
   - `API_BASE`는 1단계에서 얻은 Vercel URL 사용

4. **워크플로우 실행**
   - Actions 탭 → "Prisma Migrate Deploy" → Run workflow (마이그레이션 적용)
   - Actions 탭 → "Daily Designs" → Run workflow (첫 디자인 생성 테스트)

5. **확인**
   - 배포된 앱의 `/docs/button/outlined` 등에서 새 디자인 코드 표시 확인
