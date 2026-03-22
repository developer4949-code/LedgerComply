-- LedgerComply Database Schema
-- Run this in the Supabase SQL editor to set up the tables

-- Clients table
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  country text not null,
  entity_type text not null,
  created_at timestamptz default now()
);

-- Compliance tasks table
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null,
  due_date date not null,
  status text not null default 'Pending' check (status in ('Pending', 'In Progress', 'Completed')),
  priority text not null default 'Medium' check (priority in ('Low', 'Medium', 'High')),
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table clients enable row level security;
alter table tasks enable row level security;

-- Public read/write policies (adjust for production auth)
create policy "Allow all on clients" on clients for all using (true) with check (true);
create policy "Allow all on tasks" on tasks for all using (true) with check (true);
