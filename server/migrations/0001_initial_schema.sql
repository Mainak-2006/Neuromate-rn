create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  grade text,
  subjects text[],
  created_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  source_url text,
  created_at timestamptz not null default now()
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  title text not null,
  summary text,
  bullets text[],
  key_terms text[],
  created_at timestamptz not null default now()
);

create table if not exists quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  questions jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  answers jsonb not null,
  score integer,
  created_at timestamptz not null default now()
);

create table if not exists flashcards (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  front text not null,
  back text not null,
  hint text,
  created_at timestamptz not null default now(),
  next_review_date date,
  review_count integer not null default 0
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  flashcard_id uuid not null references flashcards(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  review_date date not null default current_date,
  quality integer not null,
  new_interval numeric,
  new_ef numeric
);

create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  lessons_completed integer not null default 0,
  quizzes_taken integer not null default 0,
  avg_score numeric,
  flashcards_created integer not null default 0,
  streak_days integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists idx_documents_user on documents (user_id);
create index if not exists idx_lessons_document on lessons (document_id);
create index if not exists idx_quizzes_lesson on quizzes (lesson_id);
create index if not exists idx_quiz_attempts_user on quiz_attempts (user_id);
create index if not exists idx_flashcards_user on flashcards (user_id);
create index if not exists idx_reviews_flashcard on reviews (flashcard_id);
