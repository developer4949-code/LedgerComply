-- LedgerComply Seed Data
-- Run AFTER schema.sql in the Supabase SQL editor

-- Insert sample clients
insert into clients (id, company_name, country, entity_type) values
  ('11111111-1111-1111-1111-111111111111', 'Acme Corp', 'India', 'Private Limited'),
  ('22222222-2222-2222-2222-222222222222', 'BlueSky Ventures', 'India', 'LLP'),
  ('33333333-3333-3333-3333-333333333333', 'TechNova Solutions', 'India', 'Private Limited'),
  ('44444444-4444-4444-4444-444444444444', 'Greenfield Exports', 'India', 'Partnership Firm');

-- Insert sample tasks (mix of statuses and due dates including overdue ones)
insert into tasks (client_id, title, description, category, due_date, status, priority) values
  -- Acme Corp tasks
  ('11111111-1111-1111-1111-111111111111', 'Q3 GST Filing', 'File GSTR-3B for Q3', 'GST', '2026-01-20', 'Completed', 'High'),
  ('11111111-1111-1111-1111-111111111111', 'TDS Return Q3', 'Submit TDS return for Oct-Dec quarter', 'Tax Filing', '2026-01-31', 'Pending', 'High'),
  ('11111111-1111-1111-1111-111111111111', 'Annual Audit 2025', 'Statutory audit for FY 2024-25', 'Audit', '2026-04-30', 'In Progress', 'High'),
  ('11111111-1111-1111-1111-111111111111', 'Payroll Compliance Jan', 'PF and ESI payment for January', 'Payroll', '2026-02-15', 'Pending', 'Medium'),

  -- BlueSky Ventures tasks
  ('22222222-2222-2222-2222-222222222222', 'GST Annual Return', 'File GSTR-9 for FY 2024-25', 'GST', '2025-12-31', 'Pending', 'High'),
  ('22222222-2222-2222-2222-222222222222', 'ROC Annual Filing', 'File annual returns with Registrar of Companies', 'Annual Return', '2026-02-28', 'Pending', 'Medium'),
  ('22222222-2222-2222-2222-222222222222', 'Advance Tax Q4', 'Pay Q4 advance tax instalment', 'Tax Filing', '2026-03-15', 'Pending', 'High'),

  -- TechNova Solutions tasks
  ('33333333-3333-3333-3333-333333333333', 'GSTR-1 February', 'File GSTR-1 for February sales', 'GST', '2026-03-11', 'Pending', 'Medium'),
  ('33333333-3333-3333-3333-333333333333', 'Internal Audit Q1', 'Conduct internal audit for Jan-Mar quarter', 'Audit', '2026-04-15', 'Pending', 'Low'),
  ('33333333-3333-3333-3333-333333333333', 'Payroll Feb', 'Process payroll compliance for February', 'Payroll', '2026-02-28', 'Completed', 'Medium'),
  ('33333333-3333-3333-3333-333333333333', 'MSME Compliance', 'Annual MSME form filing', 'Regulatory', '2026-01-15', 'Pending', 'Low'),

  -- Greenfield Exports tasks
  ('44444444-4444-4444-4444-444444444444', 'Export Documentation', 'Ensure all export compliance filings are up to date', 'Regulatory', '2026-02-10', 'Pending', 'High'),
  ('44444444-4444-4444-4444-444444444444', 'GST Refund Claim', 'File GST refund claim for export zero-rated supplies', 'GST', '2026-01-25', 'Pending', 'Medium'),
  ('44444444-4444-4444-4444-444444444444', 'TDS Q3 Return', 'Q3 TDS return filing', 'Tax Filing', '2026-01-31', 'Completed', 'High');
