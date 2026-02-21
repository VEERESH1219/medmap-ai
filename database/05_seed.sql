-- MedMap AI — Seed Data (Expanded)
-- 40 real Indian medicines for hackathon demo

INSERT INTO medicines
  (brand_name, generic_name, strength, form, category, is_combination, manufacturer)
VALUES
  -- ── Antibiotics ─────────────────────────────────
  ('Augmentin 625',   'Amoxicillin + Clavulanic Acid', '500mg + 125mg',   'Tablet',    'Antibiotic',        true,  'GSK'),
  ('Augmentin 1.2g',  'Amoxicillin + Clavulanic Acid', '1000mg + 200mg',  'Injection', 'Antibiotic',        true,  'GSK'),
  ('Amoxiclav 625',   'Amoxicillin + Clavulanic Acid', '500mg + 125mg',   'Tablet',    'Antibiotic',        true,  'Cipla'),
  ('Azithral 500',    'Azithromycin',                  '500mg',           'Tablet',    'Antibiotic',        false, 'Alembic'),
  ('Ciplox 500',      'Ciprofloxacin',                 '500mg',           'Tablet',    'Antibiotic',        false, 'Cipla'),
  ('Cefixime 200',    'Cefixime',                      '200mg',           'Tablet',    'Antibiotic',        false, 'Mankind'),

  -- ── Analgesics / Anti-inflammatories ────────────
  ('Calpol 500',      'Paracetamol',                   '500mg',           'Tablet',    'Analgesic',         false, 'GSK'),
  ('Calpol DS',       'Paracetamol',                   '250mg/5ml',       'Syrup',     'Analgesic',         false, 'GSK'),
  ('Dolo 650',        'Paracetamol',                   '650mg',           'Tablet',    'Analgesic',         false, 'Micro Labs'),
  ('Combiflam',       'Ibuprofen + Paracetamol',       '400mg + 325mg',   'Tablet',    'Analgesic',         true,  'Sanofi'),

  -- ── PPIs (Proton Pump Inhibitors) ──────────────
  ('Pantop 40',       'Pantoprazole',                  '40mg',            'Tablet',    'PPI',               false, 'Sun Pharma'),
  ('Pantocid 40',     'Pantoprazole',                  '40mg',            'Tablet',    'PPI',               false, 'Sun Pharma'),
  ('Omez 20',         'Omeprazole',                    '20mg',            'Capsule',   'PPI',               false, 'Dr Reddys'),
  ('Ocid 20',         'Omeprazole',                    '20mg',            'Capsule',   'PPI',               false, 'Zydus Cadila'),
  ('Ocid 40',         'Omeprazole',                    '40mg',            'Capsule',   'PPI',               false, 'Zydus Cadila'),
  ('Rablet 20',       'Rabeprazole',                   '20mg',            'Tablet',    'PPI',               false, 'Cadila'),

  -- ── Antihistamines / Anti-allergic ─────────────
  ('Montair LC',      'Montelukast + Levocetirizine',  '10mg + 5mg',     'Tablet',    'Antiallergic',      true,  'Cipla'),
  ('Allegra 120',     'Fexofenadine',                  '120mg',           'Tablet',    'Antihistamine',     false, 'Sanofi'),
  ('Cetrizine 10',    'Cetirizine',                    '10mg',            'Tablet',    'Antihistamine',     false, 'GSK'),
  ('Levocet M',       'Levocetirizine + Montelukast',  '5mg + 10mg',     'Tablet',    'Antiallergic',      true,  'Sun Pharma'),

  -- ── Antidiabetic ───────────────────────────────
  ('Glycomet 500',    'Metformin',                     '500mg',           'Tablet',    'Antidiabetic',      false, 'USV'),
  ('Glycomet GP 2',   'Glimepiride + Metformin',       '2mg + 500mg',    'Tablet',    'Antidiabetic',      true,  'USV'),

  -- ── Antihypertensive ──────────────────────────
  ('Telma 40',        'Telmisartan',                   '40mg',            'Tablet',    'Antihypertensive',  false, 'Glenmark'),
  ('Stamlo 5',        'Amlodipine',                    '5mg',             'Tablet',    'Antihypertensive',  false, 'Dr Reddys'),
  ('Amlong 5',        'Amlodipine',                    '5mg',             'Tablet',    'Antihypertensive',  false, 'Micro Labs'),

  -- ── Antiplatelet / Cardiovascular ──────────────
  ('Ecosprin 75',     'Aspirin',                       '75mg',            'Tablet',    'Antiplatelet',      false, 'USV'),
  ('Ecosprin 150',    'Aspirin',                       '150mg',           'Tablet',    'Antiplatelet',      false, 'USV'),

  -- ── Supplements ────────────────────────────────
  ('Shelcal 500',     'Calcium + Vitamin D3',          '500mg + 250IU',   'Tablet',    'Supplement',        true,  'Torrent'),
  ('Becosules',       'Vitamin B Complex + C',         'Standard',        'Capsule',   'Supplement',        true,  'Pfizer'),

  -- ── Muscle Relaxants ──────────────────────────
  ('Myospaz',         'Chlorzoxazone',                 '500mg',           'Tablet',    'Muscle Relaxant',   false, 'FDC'),
  ('Myospaz Forte',   'Chlorzoxazone + Paracetamol',   '500mg + 500mg',  'Tablet',    'Muscle Relaxant',   true,  'FDC'),
  ('Myorax',          'Chlorzoxazone + Diclofenac + Paracetamol', '250mg + 50mg + 325mg', 'Tablet', 'Muscle Relaxant', true, 'Intas'),

  -- ── Steroids / Anti-inflammatory ──────────────
  ('Petcid',          'Pantoprazole',                  '40mg',            'Tablet',    'PPI',               false, 'Mankind'),
  ('Deflazacort 6',   'Deflazacort',                   '6mg',             'Tablet',    'Steroid',           false, 'Macleods'),

  -- ── Antacids ──────────────────────────────────
  ('Digene',          'Magaldrate + Simethicone',      '480mg + 20mg',   'Tablet',    'Antacid',           true,  'Abbott'),
  ('Gelusil MPS',     'Magaldrate + Simethicone',      '400mg + 20mg',   'Syrup',     'Antacid',           true,  'Pfizer'),

  -- ── Antispasmodics ────────────────────────────
  ('Meftal Spas',     'Mefenamic Acid + Dicyclomine',  '250mg + 10mg',   'Tablet',    'Antispasmodic',     true,  'Blue Cross'),
  ('Drotin DS',       'Drotaverine',                   '80mg',            'Tablet',    'Antispasmodic',     false, 'Sun Pharma'),

  -- ── Anti-emetics ──────────────────────────────
  ('Emeset 4',        'Ondansetron',                   '4mg',             'Tablet',    'Antiemetic',        false, 'Cipla'),
  ('Vomistop',        'Domperidone',                   '10mg',            'Tablet',    'Antiemetic',        false, 'Cipla'),

  -- ── Bronchodilators ───────────────────────────
  ('Deriphyllin',     'Theophylline + Etophylline',    '23mg + 77mg',    'Tablet',    'Bronchodilator',    true,  'Zydus')
ON CONFLICT DO NOTHING;
