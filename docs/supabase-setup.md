# 방명록 · RSVP 영속화 (Supabase)

방명록/참석여부를 하객들과 **공유·영구 보존**하려면 Supabase(무료)에 연결합니다.
설정 안 해도 페이지는 동작하며, 이 경우 데이터는 접속한 기기에만 저장됩니다(미리보기용).

## 1) 프로젝트 생성
1. https://supabase.com 접속 → 로그인 → **New project**
2. 이름/비밀번호/리전(Northeast Asia (Seoul) 권장) 설정 후 생성 (약 2분)

## 2) 테이블 · 정책 만들기 (SQL 붙여넣기)
좌측 메뉴 **SQL Editor → New query** 에 아래를 **그대로 붙여넣고 Run**:

```sql
-- 방명록
create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  password text,
  created_at timestamptz not null default now()
);

-- 참석여부(RSVP)
create table if not exists public.rsvp (
  id uuid primary key default gen_random_uuid(),
  side text,
  name text not null,
  attend text,
  count int default 1,
  meal text,
  phone text,
  created_at timestamptz not null default now()
);

-- RLS 켜기
alter table public.guestbook enable row level security;
alter table public.rsvp enable row level security;

-- 방명록: 누구나 읽기 + 쓰기
create policy "guestbook read"  on public.guestbook for select to anon using (true);
create policy "guestbook write" on public.guestbook for insert to anon with check (true);

-- RSVP: 누구나 쓰기만 (읽기는 막아 개인정보 보호 → 신랑신부는 Table Editor에서 확인)
create policy "rsvp write" on public.rsvp for insert to anon with check (true);

-- 방명록 삭제(비밀번호 확인) 함수
create or replace function public.delete_guestbook(p_id uuid, p_password text)
returns void language sql security definer set search_path = public as $$
  delete from public.guestbook where id = p_id and password = p_password;
$$;
grant execute on function public.delete_guestbook(uuid, text) to anon;
```

## 3) 키 복사해서 config 에 입력
좌측 **Project Settings → API** 에서 두 값을 복사:

- **Project URL** (예: `https://xxxxxxxx.supabase.co`)
- **anon public** key

`src/config.js`:

```js
supabase: {
  url: 'https://xxxxxxxx.supabase.co',
  anonKey: 'eyJhbGciOi...(anon public key)',
},
```

커밋/푸시하면 자동 배포되고, 이제 방명록/RSVP가 Supabase 에 영구 저장됩니다.

## 데이터 확인
- 방명록/RSVP 명단: Supabase 좌측 **Table Editor → guestbook / rsvp**
- CSV 내보내기: Table Editor 상단의 Export 사용

## 참고 (보안)
- `anon public` key 는 클라이언트에 노출되는 공개 키라 커밋해도 안전합니다.
  실제 접근 제어는 위의 RLS 정책(insert/select 허용 범위)으로 이루어집니다.
- RSVP 는 읽기 정책이 없어 하객 화면에서 명단이 조회되지 않습니다.
