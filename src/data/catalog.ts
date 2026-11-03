import type { Category, Product, Testimonial } from '../lib/types'

export const categories: Category[] = [
  { slug: 'tablets', name: 'Tablets', short: 'Tb', form: 'tablet', description: 'Cardiac, diabetic, thyroid and gastro tablets in strip, box and bottle packs.' },
  { slug: 'capsules', name: 'Capsules', short: 'Cp', form: 'capsule', description: 'Antibiotic, gastro and neuro capsules from licensed manufacturers.' },
  { slug: 'injections', name: 'Injections', short: 'Inj', form: 'injection', description: 'Vials and ampoules for hospitals, nursing homes and critical care.' },
  { slug: 'syrups', name: 'Syrups & Suspensions', short: 'Sy', form: 'syrup', description: 'Paediatric and adult oral liquids in standard bottle sizes.' },
  { slug: 'creams', name: 'Creams & Ointments', short: 'Cr', form: 'cream', description: 'Topical antifungal, antibiotic and analgesic preparations.' },
  { slug: 'drops', name: 'Eye & Ear Drops', short: 'Dr', form: 'drops', description: 'Ophthalmic and otic drops in sterile dropper bottles.' },
  { slug: 'cardiac-diabetic', name: 'Cardiac & Diabetic', short: 'Cv', form: 'cardiac', description: 'Chronic-therapy medicines for cardiovascular and diabetes care.' },
  { slug: 'oncology', name: 'Oncology', short: 'On', form: 'oncology', description: 'Speciality oncology medicines sourced on request.' },
]

type Seed = Omit<Product, 'slug' | 'price'> & { price?: number | null }

const seed: Seed[] = [
  // Tablets
  { name: 'Atorvastatin 10 mg Tablets', category: 'tablets', strength: '10 mg', pack: '10 × 10 tablets', unit: 'Box', composition: 'Atorvastatin calcium', therapy: ['Cardiac'], packaging: 'Box', featured: true, moq: 20 },
  { name: 'Metformin 500 mg Tablets', category: 'tablets', strength: '500 mg', pack: '1 × 10 tablets', unit: 'Strip', composition: 'Metformin hydrochloride', therapy: ['Diabetic'], packaging: 'Strip', featured: true },
  { name: 'Amlodipine 5 mg Tablets', category: 'tablets', strength: '5 mg', pack: '1 × 10 tablets', unit: 'Strip', composition: 'Amlodipine besylate', therapy: ['Cardiac'], packaging: 'Strip', featured: true },
  { name: 'Levothyroxine 50 mcg Tablets', category: 'tablets', strength: '50 mcg', pack: '100 tablets', unit: 'Bottle', composition: 'Levothyroxine sodium', therapy: ['Thyroid'], packaging: 'Bottle', featured: true },
  { name: 'Telmisartan 40 mg Tablets', category: 'tablets', strength: '40 mg', pack: '1 × 15 tablets', unit: 'Strip', composition: 'Telmisartan', therapy: ['Cardiac'], packaging: 'Strip' },
  { name: 'Rosuvastatin 10 mg Tablets', category: 'tablets', strength: '10 mg', pack: '1 × 10 tablets', unit: 'Strip', composition: 'Rosuvastatin calcium', therapy: ['Cardiac'], packaging: 'Strip' },
  { name: 'Clopidogrel 75 mg Tablets', category: 'tablets', strength: '75 mg', pack: '1 × 10 tablets', unit: 'Strip', composition: 'Clopidogrel bisulfate', therapy: ['Cardiac'], packaging: 'Strip' },
  { name: 'Metoprolol 50 mg Tablets', category: 'tablets', strength: '50 mg', pack: '1 × 10 tablets', unit: 'Strip', composition: 'Metoprolol succinate', therapy: ['Cardiac'], packaging: 'Strip' },
  { name: 'Glimepiride 2 mg Tablets', category: 'tablets', strength: '2 mg', pack: '1 × 10 tablets', unit: 'Strip', composition: 'Glimepiride', therapy: ['Diabetic'], packaging: 'Strip' },
  { name: 'Pantoprazole 40 mg Tablets', category: 'tablets', strength: '40 mg', pack: '1 × 15 tablets', unit: 'Strip', composition: 'Pantoprazole sodium', therapy: ['Gastro'], packaging: 'Strip' },
  { name: 'Thyroxine 100 mcg Tablets', category: 'tablets', strength: '100 mcg', pack: '100 tablets', unit: 'Bottle', composition: 'Levothyroxine sodium', therapy: ['Thyroid'], packaging: 'Bottle' },
  { name: 'Domperidone 10 mg Tablets', category: 'tablets', strength: '10 mg', pack: '10 × 10 tablets', unit: 'Box', composition: 'Domperidone', therapy: ['Gastro'], packaging: 'Box' },
  { name: 'Losartan 50 mg Tablets', category: 'tablets', strength: '50 mg', pack: '10 × 10 tablets', unit: 'Box', composition: 'Losartan potassium', therapy: ['Cardiac'], packaging: 'Box' },
  { name: 'Vildagliptin 50 mg Tablets', category: 'tablets', strength: '50 mg', pack: '1 × 15 tablets', unit: 'Strip', composition: 'Vildagliptin', therapy: ['Diabetic'], packaging: 'Strip' },

  // Capsules
  { name: 'Omeprazole 20 mg Capsules', category: 'capsules', strength: '20 mg', pack: '1 × 15 capsules', unit: 'Strip', composition: 'Omeprazole', therapy: ['Gastro'], packaging: 'Strip', featured: true },
  { name: 'Amoxicillin 500 mg Capsules', category: 'capsules', strength: '500 mg', pack: '1 × 10 capsules', unit: 'Strip', composition: 'Amoxicillin trihydrate', therapy: ['Anti-infective'], packaging: 'Strip', featured: true },
  { name: 'Doxycycline 100 mg Capsules', category: 'capsules', strength: '100 mg', pack: '1 × 10 capsules', unit: 'Strip', composition: 'Doxycycline hyclate', therapy: ['Anti-infective'], packaging: 'Strip' },
  { name: 'Pregabalin 75 mg Capsules', category: 'capsules', strength: '75 mg', pack: '1 × 10 capsules', unit: 'Strip', composition: 'Pregabalin', therapy: ['Neuro'], packaging: 'Strip' },
  { name: 'Esomeprazole 40 mg Capsules', category: 'capsules', strength: '40 mg', pack: '10 × 10 capsules', unit: 'Box', composition: 'Esomeprazole magnesium', therapy: ['Gastro'], packaging: 'Box' },

  // Injections
  { name: 'Ceftriaxone 1 g Injection', category: 'injections', strength: '1 g', pack: '1 vial', unit: 'Vial', composition: 'Ceftriaxone sodium', therapy: ['Anti-infective'], packaging: 'Vial', featured: true },
  { name: 'Pantoprazole 40 mg Injection', category: 'injections', strength: '40 mg', pack: '1 vial', unit: 'Vial', composition: 'Pantoprazole sodium', therapy: ['Gastro'], packaging: 'Vial' },
  { name: 'Ondansetron 2 ml Injection', category: 'injections', strength: '2 mg/ml', pack: '2 ml ampoule', unit: 'Piece', composition: 'Ondansetron hydrochloride', therapy: ['Gastro'], packaging: 'Vial' },
  { name: 'Enoxaparin 40 mg Injection', category: 'injections', strength: '40 mg', pack: '0.4 ml prefilled syringe', unit: 'Piece', composition: 'Enoxaparin sodium', therapy: ['Cardiac'], packaging: 'Vial' },

  // Syrups
  { name: 'Paracetamol 250 mg/5 ml Suspension', category: 'syrups', strength: '250 mg/5 ml', pack: '60 ml bottle', unit: 'Bottle', composition: 'Paracetamol', therapy: ['Analgesic'], packaging: 'Bottle' },
  { name: 'Cetirizine 5 mg/5 ml Syrup', category: 'syrups', strength: '5 mg/5 ml', pack: '60 ml bottle', unit: 'Bottle', composition: 'Cetirizine dihydrochloride', therapy: ['Anti-allergic'], packaging: 'Bottle' },
  { name: 'Lactulose Solution 200 ml', category: 'syrups', strength: '10 g/15 ml', pack: '200 ml bottle', unit: 'Bottle', composition: 'Lactulose', therapy: ['Gastro'], packaging: 'Bottle' },
  { name: 'Antacid Suspension 170 ml', category: 'syrups', strength: '—', pack: '170 ml bottle', unit: 'Bottle', composition: 'Aluminium hydroxide, Magnesium hydroxide, Simethicone', therapy: ['Gastro'], packaging: 'Bottle' },

  // Creams
  { name: 'Clotrimazole 1% Cream', category: 'creams', strength: '1%', pack: '15 g tube', unit: 'Tube', composition: 'Clotrimazole', therapy: ['Dermatology'], packaging: 'Tube' },
  { name: 'Mupirocin 2% Ointment', category: 'creams', strength: '2%', pack: '5 g tube', unit: 'Tube', composition: 'Mupirocin', therapy: ['Dermatology'], packaging: 'Tube' },
  { name: 'Diclofenac Gel 30 g', category: 'creams', strength: '1.16%', pack: '30 g tube', unit: 'Tube', composition: 'Diclofenac diethylamine', therapy: ['Analgesic'], packaging: 'Tube' },
  { name: 'Silver Sulfadiazine Cream', category: 'creams', strength: '1%', pack: '25 g tube', unit: 'Tube', composition: 'Silver sulfadiazine', therapy: ['Dermatology'], packaging: 'Tube' },

  // Drops
  { name: 'Moxifloxacin 0.5% Eye Drops', category: 'drops', strength: '0.5%', pack: '5 ml bottle', unit: 'Piece', composition: 'Moxifloxacin hydrochloride', therapy: ['Ophthalmic'], packaging: 'Bottle', featured: true },
  { name: 'Carboxymethylcellulose Eye Drops', category: 'drops', strength: '0.5%', pack: '10 ml bottle', unit: 'Piece', composition: 'Carboxymethylcellulose sodium', therapy: ['Ophthalmic'], packaging: 'Bottle' },
  { name: 'Ciprofloxacin Ear Drops', category: 'drops', strength: '0.3%', pack: '5 ml bottle', unit: 'Piece', composition: 'Ciprofloxacin hydrochloride', therapy: ['Otic'], packaging: 'Bottle' },
  { name: 'Timolol 0.5% Eye Drops', category: 'drops', strength: '0.5%', pack: '5 ml bottle', unit: 'Piece', composition: 'Timolol maleate', therapy: ['Ophthalmic'], packaging: 'Bottle' },

  // Cardiac & diabetic
  { name: 'Telmisartan 40 mg + Amlodipine 5 mg Tablets', category: 'cardiac-diabetic', strength: '40 mg / 5 mg', pack: '1 × 15 tablets', unit: 'Strip', composition: 'Telmisartan, Amlodipine besylate', therapy: ['Cardiac'], packaging: 'Strip' },
  { name: 'Glimepiride 2 mg + Metformin 500 mg Tablets', category: 'cardiac-diabetic', strength: '2 mg / 500 mg', pack: '1 × 15 tablets', unit: 'Strip', composition: 'Glimepiride, Metformin hydrochloride', therapy: ['Diabetic'], packaging: 'Strip' },
  { name: 'Rosuvastatin 20 mg Tablets', category: 'cardiac-diabetic', strength: '20 mg', pack: '1 × 10 tablets', unit: 'Strip', composition: 'Rosuvastatin calcium', therapy: ['Cardiac'], packaging: 'Strip' },
  { name: 'Sitagliptin 100 mg Tablets', category: 'cardiac-diabetic', strength: '100 mg', pack: '1 × 7 tablets', unit: 'Strip', composition: 'Sitagliptin phosphate', therapy: ['Diabetic'], packaging: 'Strip' },

  // Oncology — placeholders until the client shares the range
  { name: '[Oncology product 1]', category: 'oncology', strength: '[Strength]', pack: '[Pack]', unit: 'Vial', composition: '[Composition]', therapy: ['Oncology'], packaging: 'Vial' },
  { name: '[Oncology product 2]', category: 'oncology', strength: '[Strength]', pack: '[Pack]', unit: 'Box', composition: '[Composition]', therapy: ['Oncology'], packaging: 'Box' },
  { name: '[Oncology product 3]', category: 'oncology', strength: '[Strength]', pack: '[Pack]', unit: 'Vial', composition: '[Composition]', therapy: ['Oncology'], packaging: 'Vial' },
  { name: '[Oncology product 4]', category: 'oncology', strength: '[Strength]', pack: '[Pack]', unit: 'Box', composition: '[Composition]', therapy: ['Oncology'], packaging: 'Box' },
]

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const products: Product[] = seed.map((p) => ({ ...p, price: p.price ?? null, slug: slugify(p.name) }))

// Placeholder reviews from the mockup — swap for real buyer feedback.
export const testimonials: Testimonial[] = [
  { id: 't1', name: '[Buyer name]', role: 'Retail pharmacy, [City]', initials: 'RP', rating: 5, date: '[Date]', topic: 'Product quality', text: '[Buyer’s testimonial — two to four lines about product quality, pricing or delivery.]' },
  { id: 't2', name: '[Buyer name]', role: 'Hospital purchase dept., [City]', initials: 'HD', rating: 5, date: '[Date]', topic: 'Delivery', text: '[Buyer’s testimonial — two to four lines about product quality, pricing or delivery.]' },
  { id: 't3', name: '[Buyer name]', role: 'Distributor, [Country]', initials: 'DS', rating: 5, date: '[Date]', topic: 'Response', text: '[Buyer’s testimonial — two to four lines about product quality, pricing or delivery.]' },
  { id: 't4', name: '[Buyer name]', role: 'Chemist, [City]', initials: 'CM', rating: 5, date: '[Date]', topic: 'Product quality', text: '[Buyer’s testimonial — two to four lines about product quality, pricing or delivery.]' },
  { id: 't5', name: '[Buyer name]', role: 'Nursing home, [City]', initials: 'NH', rating: 5, date: '[Date]', topic: 'Delivery', text: '[Buyer’s testimonial — two to four lines about product quality, pricing or delivery.]' },
  { id: 't6', name: '[Buyer name]', role: 'Wholesaler, [City]', initials: 'WS', rating: 5, date: '[Date]', topic: 'Response', text: '[Buyer’s testimonial — two to four lines about product quality, pricing or delivery.]' },
  { id: 't7', name: '[Buyer name]', role: 'Retail pharmacy, [City]', initials: 'RP', rating: 5, date: '[Date]', topic: 'Response', text: '[Buyer’s testimonial — two to four lines about product quality, pricing or delivery.]' },
  { id: 't8', name: '[Buyer name]', role: 'Distributor, [Country]', initials: 'DS', rating: 4, date: '[Date]', topic: 'Delivery', text: '[Buyer’s testimonial — two to four lines about product quality, pricing or delivery.]' },
  { id: 't9', name: '[Buyer name]', role: 'Hospital purchase dept., [City]', initials: 'HD', rating: 5, date: '[Date]', topic: 'Product quality', text: '[Buyer’s testimonial — two to four lines about product quality, pricing or delivery.]' },
]
