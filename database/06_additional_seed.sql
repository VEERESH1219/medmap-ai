-- MedMap AI — Additional Seed Data
-- Common Indian medicines frequently seen in prescriptions

INSERT INTO medicines
  (brand_name, generic_name, strength, form, category, is_combination, manufacturer)
VALUES
  -- ── NSAIDs / Pain ──────────────────────────────
  ('Diclofenac', 'Diclofenac Sodium', '50mg', 'Tablet', 'NSAID', false, 'Various'),
  ('Voveran 50', 'Diclofenac Sodium', '50mg', 'Tablet', 'NSAID', false, 'Novartis'),
  ('Voveran SR 100', 'Diclofenac Sodium', '100mg', 'Tablet', 'NSAID', false, 'Novartis'),
  ('Voveran D', 'Diclofenac Potassium', '50mg', 'Tablet', 'NSAID', false, 'Novartis'),
  ('Rolenac', 'Diclofenac Sodium', '75mg/3ml', 'Injection', 'NSAID', false, 'Rolfin'),
  ('Rolenac D', 'Diclofenac Sodium + Paracetamol', '50mg + 325mg', 'Tablet', 'NSAID', true, 'Rolfin'),
  ('Ultrafine Plus', 'Aceclofenac + Paracetamol', '100mg + 325mg', 'Tablet', 'NSAID', true, 'Fine Cure'),
  ('Aceclofenac', 'Aceclofenac', '100mg', 'Tablet', 'NSAID', false, 'Various'),
  ('Zerodol SP', 'Aceclofenac + Serratiopeptidase + Paracetamol', '100mg + 15mg + 325mg', 'Tablet', 'NSAID', true, 'IPCA'),
  ('Zerodol P', 'Aceclofenac + Paracetamol', '100mg + 325mg', 'Tablet', 'NSAID', true, 'IPCA'),
  ('Hifenac P', 'Aceclofenac + Paracetamol', '100mg + 325mg', 'Tablet', 'NSAID', true, 'Intas'),
  ('Ibuprofen', 'Ibuprofen', '400mg', 'Tablet', 'NSAID', false, 'Various'),
  ('Brufen 400', 'Ibuprofen', '400mg', 'Tablet', 'NSAID', false, 'Abbott'),
  ('Flexon', 'Ibuprofen + Paracetamol', '400mg + 325mg', 'Tablet', 'NSAID', true, 'Panacea'),

  -- ── Bone & Joint / Orthopedic ──────────────────
  ('Bonmax', 'Calcium Carbonate + Vitamin D3', '500mg + 250IU', 'Capsule', 'Supplement', true, 'Zydus Cadila'),
  ('Bonmax D', 'Calcium + Vitamin D3 + Magnesium', '500mg + 250IU + 50mg', 'Tablet', 'Supplement', true, 'Zydus Cadila'),
  ('Ultreal D', 'Ultrareal D3 / Cholecalciferol', '60000IU', 'Tablet', 'Supplement', false, 'Macleods'),
  ('Ultreal-D', 'Cholecalciferol (Vitamin D3)', '60000IU', 'Tablet', 'Supplement', false, 'Macleods'),
  ('Cartilax', 'Glucosamine + Diacerein', '750mg + 50mg', 'Tablet', 'Joint Supplement', true, 'Alkem'),
  ('Cartigen', 'Glucosamine + Diacerein', '750mg + 50mg', 'Tablet', 'Joint Supplement', true, 'Cadila'),
  ('Calcimax D3', 'Calcium + Vitamin D3', '500mg + 250IU', 'Tablet', 'Supplement', true, 'Meyer'),
  ('Uprise D3', 'Cholecalciferol (Vitamin D3)', '60000IU', 'Capsule', 'Supplement', false, 'Alkem'),

  -- ── PPIs / Gastric ─────────────────────────────
  ('Omepraz', 'Omeprazole', '20mg', 'Capsule', 'PPI', false, 'Cipla'),
  ('Razo 20', 'Rabeprazole', '20mg', 'Tablet', 'PPI', false, 'Dr Reddys'),
  ('Razo D', 'Rabeprazole + Domperidone', '20mg + 30mg', 'Capsule', 'PPI', true, 'Dr Reddys'),
  ('Nexpro 40', 'Esomeprazole', '40mg', 'Tablet', 'PPI', false, 'Torrent'),
  ('Nexpro RD', 'Esomeprazole + Domperidone', '40mg + 30mg', 'Capsule', 'PPI', true, 'Torrent'),
  ('Pan D', 'Pantoprazole + Domperidone', '40mg + 30mg', 'Capsule', 'PPI', true, 'Alkem'),
  ('Rantac 150', 'Ranitidine', '150mg', 'Tablet', 'PPI', false, 'J&J'),

  -- ── Antibiotics ────────────────────────────────
  ('Monocef', 'Ceftriaxone', '1g', 'Injection', 'Antibiotic', false, 'Aristo'),
  ('Monocef O 200', 'Cefpodoxime', '200mg', 'Tablet', 'Antibiotic', false, 'Aristo'),
  ('Taxim O 200', 'Cefixime', '200mg', 'Tablet', 'Antibiotic', false, 'Alkem'),
  ('Cifran 500', 'Ciprofloxacin', '500mg', 'Tablet', 'Antibiotic', false, 'Sun Pharma'),
  ('Moxclav 625', 'Amoxicillin + Clavulanic acid', '500mg + 125mg', 'Tablet', 'Antibiotic', true, 'Sun Pharma'),
  ('Azee 500', 'Azithromycin', '500mg', 'Tablet', 'Antibiotic', false, 'Cipla'),
  ('Oflox 200', 'Ofloxacin', '200mg', 'Tablet', 'Antibiotic', false, 'Cipla'),
  ('Norflox 400', 'Norfloxacin', '400mg', 'Tablet', 'Antibiotic', false, 'Cipla'),
  ('Levoflox 500', 'Levofloxacin', '500mg', 'Tablet', 'Antibiotic', false, 'Cipla'),
  ('Doxycycline 100', 'Doxycycline', '100mg', 'Capsule', 'Antibiotic', false, 'Various'),

  -- ── Steroids ───────────────────────────────────
  ('Wysolone 10', 'Prednisolone', '10mg', 'Tablet', 'Steroid', false, 'Pfizer'),
  ('Wysolone 5', 'Prednisolone', '5mg', 'Tablet', 'Steroid', false, 'Pfizer'),
  ('Omnacortil 10', 'Prednisolone', '10mg', 'Tablet', 'Steroid', false, 'Macleods'),
  ('Betnesol 0.5', 'Betamethasone', '0.5mg', 'Tablet', 'Steroid', false, 'GSK'),
  ('Defcort 6', 'Deflazacort', '6mg', 'Tablet', 'Steroid', false, 'Macleods'),

  -- ── Muscle Relaxants / Pain ────────────────────
  ('Thiocolchicoside 4', 'Thiocolchicoside', '4mg', 'Capsule', 'Muscle Relaxant', false, 'Various'),
  ('Myoril 4', 'Thiocolchicoside', '4mg', 'Capsule', 'Muscle Relaxant', false, 'Sanofi'),
  ('Acemiz SP', 'Aceclofenac + Paracetamol + Serratiopeptidase', '100mg + 325mg + 15mg', 'Tablet', 'NSAID', true, 'Emcure'),
  ('Trypsin Chymotrypsin', 'Trypsin + Chymotrypsin', '50000IU', 'Tablet', 'Anti-inflammatory Enzyme', true, 'Various'),

  -- ── Vitamins / Supplements ─────────────────────
  ('Neurobion Forte', 'Vitamin B1 + B6 + B12', '10mg + 3mg + 15mcg', 'Tablet', 'Supplement', true, 'Merck'),
  ('Methylcobalamin 1500', 'Methylcobalamin', '1500mcg', 'Tablet', 'Supplement', false, 'Various'),
  ('Mecobalamin', 'Methylcobalamin', '1500mcg', 'Tablet', 'Supplement', false, 'Various'),
  ('Nurokind Plus', 'Methylcobalamin + Alpha Lipoic Acid + Folic Acid', '1500mcg + 100mg + 1.5mg', 'Tablet', 'Supplement', true, 'Mankind'),
  ('Zincovit', 'Multivitamin + Multimineral', 'Standard', 'Tablet', 'Supplement', true, 'Apex'),
  ('Limcee', 'Vitamin C', '500mg', 'Tablet', 'Supplement', false, 'Abbott'),
  ('Revital H', 'Multivitamin + Ginseng', 'Standard', 'Capsule', 'Supplement', true, 'Sun Pharma'),
  ('Evion 400', 'Vitamin E', '400mg', 'Capsule', 'Supplement', false, 'Merck'),

  -- ── Antihypertensive / Cardiac ─────────────────
  ('Amlodac 5', 'Amlodipine', '5mg', 'Tablet', 'Antihypertensive', false, 'Zydus'),
  ('Telmikind 40', 'Telmisartan', '40mg', 'Tablet', 'Antihypertensive', false, 'Mankind'),
  ('Telmikind H', 'Telmisartan + Hydrochlorothiazide', '40mg + 12.5mg', 'Tablet', 'Antihypertensive', true, 'Mankind'),
  ('Atenolol 50', 'Atenolol', '50mg', 'Tablet', 'Beta Blocker', false, 'Various'),
  ('Metolar 50', 'Metoprolol', '50mg', 'Tablet', 'Beta Blocker', false, 'Cipla'),
  ('Cardivas 3.125', 'Carvedilol', '3.125mg', 'Tablet', 'Beta Blocker', false, 'Sun Pharma'),
  ('Atorva 10', 'Atorvastatin', '10mg', 'Tablet', 'Statin', false, 'Zydus'),
  ('Atorva 20', 'Atorvastatin', '20mg', 'Tablet', 'Statin', false, 'Zydus'),
  ('Rosuvas 10', 'Rosuvastatin', '10mg', 'Tablet', 'Statin', false, 'Sun Pharma'),

  -- ── Antidiabetic ───────────────────────────────
  ('Glyciphage 500', 'Metformin', '500mg', 'Tablet', 'Antidiabetic', false, 'Franco Indian'),
  ('Janumet 50/500', 'Sitagliptin + Metformin', '50mg + 500mg', 'Tablet', 'Antidiabetic', true, 'MSD'),
  ('Galvus Met', 'Vildagliptin + Metformin', '50mg + 500mg', 'Tablet', 'Antidiabetic', true, 'Novartis'),
  ('Amaryl 2', 'Glimepiride', '2mg', 'Tablet', 'Antidiabetic', false, 'Sanofi'),

  -- ── Respiratory ────────────────────────────────
  ('Asthalin', 'Salbutamol', '100mcg', 'Inhaler', 'Bronchodilator', false, 'Cipla'),
  ('Foracort 200', 'Formoterol + Budesonide', '6mcg + 200mcg', 'Inhaler', 'Bronchodilator', true, 'Cipla'),
  ('Budecort', 'Budesonide', '200mcg', 'Inhaler', 'Steroid', false, 'Sun Pharma'),
  ('Alex', 'Phenylephrine + Chlorpheniramine + Dextromethorphan', '5mg + 2mg + 10mg', 'Syrup', 'Cough Suppressant', true, 'Glenmark'),
  ('Grilinctus', 'Terbutaline + Guaifenesin + Bromhexine', '1.25mg + 50mg + 4mg', 'Syrup', 'Expectorant', true, 'Franco Indian'),
  ('Cheston Cold', 'Cetirizine + Paracetamol + Pseudoephedrine', '5mg + 325mg + 30mg', 'Tablet', 'Cold', true, 'Cipla'),
  ('Sinarest', 'Paracetamol + Phenylephrine + Chlorpheniramine', '500mg + 10mg + 2mg', 'Tablet', 'Cold', true, 'Centaur'),

  -- ── Anti-emetics / GI ──────────────────────────
  ('Perinorm', 'Metoclopramide', '10mg', 'Tablet', 'Antiemetic', false, 'IPCA'),
  ('Ondem 4', 'Ondansetron', '4mg', 'Tablet', 'Antiemetic', false, 'Alkem'),
  ('Mucaine Gel', 'Oxetacaine + Aluminium + Magnesium', '10mg + 291mg + 98mg', 'Syrup', 'Antacid', true, 'Pfizer'),
  ('Cyclopam', 'Dicyclomine + Paracetamol', '20mg + 325mg', 'Tablet', 'Antispasmodic', true, 'Indoco'),

  -- ── Antihistamines ─────────────────────────────
  ('Okacet', 'Cetirizine', '10mg', 'Tablet', 'Antihistamine', false, 'Cipla'),
  ('Alerid', 'Cetirizine', '10mg', 'Tablet', 'Antihistamine', false, 'Cipla'),
  ('Avil 25', 'Pheniramine', '25mg', 'Tablet', 'Antihistamine', false, 'Sanofi'),
  ('Levocetirizine 5', 'Levocetirizine', '5mg', 'Tablet', 'Antihistamine', false, 'Various'),
  ('Fexofenadine 120', 'Fexofenadine', '120mg', 'Tablet', 'Antihistamine', false, 'Various'),

  -- ── Antifungal ─────────────────────────────────
  ('Fluconazole 150', 'Fluconazole', '150mg', 'Tablet', 'Antifungal', false, 'Various'),
  ('Zocon 150', 'Fluconazole', '150mg', 'Tablet', 'Antifungal', false, 'FDC'),

  -- ── Anxiolytics / Neuro ────────────────────────
  ('Pregabalin 75', 'Pregabalin', '75mg', 'Capsule', 'Neuropathic Pain', false, 'Various'),
  ('Pregalin 75', 'Pregabalin', '75mg', 'Capsule', 'Neuropathic Pain', false, 'Torrent'),
  ('Gabapentin 300', 'Gabapentin', '300mg', 'Capsule', 'Neuropathic Pain', false, 'Various')
ON CONFLICT DO NOTHING;
