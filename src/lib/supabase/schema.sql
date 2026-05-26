-- CITIES
create table cities (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text unique not null,
  gym_count    int default 0,
  is_active    boolean default true,
  wave         int default 1,
  created_at   timestamptz default now()
);

-- LOCALITIES
create table localities (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text unique not null,
  city_slug    text not null references cities(slug),
  gym_count    int default 0,
  search_volume int default 0,
  is_active    boolean default true,
  created_at   timestamptz default now()
);

-- GYMS
create table gyms (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text unique not null,
  city_slug       text not null references cities(slug),
  locality_slug   text references localities(slug),
  address         text not null,
  lat             float8,
  lng             float8,
  phone           text,
  whatsapp        text,
  amenities       text[] default '{}',
  gender          text default 'mixed',
  price_range     text default 'mid',
  price_monthly   int,
  price_annually  int,
  ac              boolean default false,
  timing_open     text,
  timing_close    text,
  is_247          boolean default false,
  rating          float4 default 0,
  review_count    int default 0,
  images          text[] default '{}',
  is_featured     boolean default false,
  is_partner      boolean default false,
  is_verified     boolean default false,
  is_active       boolean default true,
  featured_until  timestamptz,
  order_index     int default 0,
  partner_logo    text,
  created_at      timestamptz default now()
);

-- BLOG POSTS
create table blog_posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text unique not null,
  excerpt      text,
  content      text,
  category     text,
  tags         text[] default '{}',
  is_published boolean default false,
  published_at timestamptz,
  created_at   timestamptz default now()
);

-- INDEXES
create index gyms_city_slug_idx on gyms(city_slug);
create index gyms_locality_slug_idx on gyms(locality_slug);
create index gyms_is_featured_idx on gyms(is_featured);
create index gyms_is_partner_idx on gyms(is_partner);
create index gyms_is_active_idx on gyms(is_active);

-- SEED cities
insert into cities (name, slug, wave) values
  ('Mumbai',    'mumbai',    1),
  ('Delhi',     'delhi',     1),
  ('Bangalore', 'bangalore', 1),
  ('Pune',      'pune',      1),
  ('Hyderabad', 'hyderabad', 2),
  ('Chennai',   'chennai',   2),
  ('Kolkata',   'kolkata',   2),
  ('Ahmedabad', 'ahmedabad', 2);

-- SEED localities
insert into localities (name, slug, city_slug, search_volume) values
  ('Mira Road',      'mira-road',         'mumbai',    450),
  ('Chembur',        'chembur',           'mumbai',    400),
  ('Ghatkopar East', 'ghatkopar-east',    'mumbai',    350),
  ('Andheri West',   'andheri-west',      'mumbai',    250),
  ('Borivali West',  'borivali-west',     'mumbai',    250),
  ('Malad West',     'malad-west',        'mumbai',    250),
  ('Vashi',          'vashi',             'mumbai',    250),
  ('Kharghar',       'kharghar',          'mumbai',    250),
  ('Dwarka',         'dwarka',            'delhi',     350),
  ('Saket',          'saket',             'delhi',     250),
  ('Janakpuri',      'janakpuri',         'delhi',     250),
  ('Paschim Vihar',  'paschim-vihar',     'delhi',     250),
  ('Laxmi Nagar',    'laxmi-nagar',       'delhi',     250),
  ('Karol Bagh',     'karol-bagh',        'delhi',     200),
  ('Lajpat Nagar',   'lajpat-nagar',      'delhi',     200),
  ('Rajouri Garden', 'rajouri-garden',    'delhi',     200),
  ('Indiranagar',    'indiranagar',       'bangalore', 350),
  ('HSR Layout',     'hsr-layout',        'bangalore', 300),
  ('Koramangala',    'koramangala',       'bangalore', 250),
  ('RR Nagar',       'rr-nagar',          'bangalore', 150),
  ('Baner',          'baner',             'pune',      300),
  ('Kharadi',        'kharadi',           'pune',      300),
  ('Kothrud',        'kothrud',           'pune',      250),
  ('Viman Nagar',    'viman-nagar',       'pune',      200),
  ('Wakad',          'wakad',             'pune',      200),
  ('Kalyani Nagar',  'kalyani-nagar',     'pune',      200),
  ('Pimple Saudagar','pimple-saudagar',   'pune',      200),
  ('Hinjewadi',      'hinjewadi-phase-1', 'pune',      150);
