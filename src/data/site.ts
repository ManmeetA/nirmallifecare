// Company details, taken from Nirmal Lifecare's GST certificate (REG-06), drug licences
// (Forms 20B / 21B), Udyam certificate and trade-mark application. Values still in
// [brackets] were not in those documents — fill them in when the client confirms them.
export const site = {
  name: 'Nirmal Lifecare',
  tagline: 'Licensed pharmaceutical wholesaler',
  blurb: 'Licensed wholesale distributor of pharmaceutical tablets, capsules, injections and speciality medicines, based in Ghaziabad, Uttar Pradesh.',
  phone: '+91 99712 22355',
  phoneHref: 'tel:+919971222355',
  whatsappHref: 'https://wa.me/919971222355',
  email: 'nirmallifecare99@gmail.com',
  emailHref: 'mailto:nirmallifecare99@gmail.com',

  // Registrations and licences — masked on purpose. The full numbers are NOT stored in
  // the site code (the GSTIN contains the proprietor's PAN).
  gst: '09••••••••••1Z4',
  drugLicences: [
    { form: '20B', number: 'UP1420B•••593', scope: 'Drugs other than those in Schedules C, C(1) and X' },
    { form: '21B', number: 'UP1421B•••569', scope: 'Drugs in Schedules C and C(1), excluding Schedule X' },
  ],
  licenceIssued: '28 Sep 2024',
  licenceValidTill: '27 Sep 2029',
  udyam: 'UDYAM-UP-29-•••••88',
  trademark: { number: '6715198', status: 'Accepted & advertised', class: '35' },
  since: '2024',

  hours: '[Mon–Sat, 10:00–19:00]',
  replyWithin: '[X] hours',
  dispatchDays: '[X] working days',
  paymentTerms: '[Terms]',
  contactPerson: 'Shashi Singh',
  designation: 'Proprietor',
  addressLine: 'Shop No. 34, Ground Floor, Suchitra Complex, Dr Ambedkar Marg, Navyug Market',
  cityLine: 'Ghaziabad, Uttar Pradesh 201001, India',
  shortAddress: 'Suchitra Complex, Navyug Market, Ghaziabad, UP 201001',
  mapsHref:
    'https://www.google.com/maps/place/Suchita+Complex/@28.6637147,77.4342561,17z/data=!4m6!3m5!1s0x390cf1c8f342b2fb:0xc9458a7562f9afae!8m2!3d28.663554!4d77.4342531!16s%2Fg%2F11r8n9cxk',
  mapsEmbed: 'https://www.google.com/maps?q=28.663554,77.4342531&z=17&output=embed',
  proprietor: 'Shashi Singh',
  proprietorMessage: '[A short message from the proprietor about the company’s commitment to buyers.]',
  intro:
    'Nirmal Lifecare is a licensed pharmaceutical wholesaler based in Ghaziabad, Uttar Pradesh. Registered in 2024 and holding Form 20B and 21B wholesale drug licences, we supply tablets, capsules, injections and speciality medicines to pharmacies, hospitals, clinics and distributors.',
  // Developer credit in the footer.
  credit: {
    name: 'Manmeet',
    phone: '+91 9108907342',
    phoneHref: 'tel:+919108907342',
  },
  socials: {
    facebook: '#',
    linkedin: '#',
  },
  // Shown on the home page "Welcome" panel (keep to a multiple of 3 for the grid).
  facts: [
    { label: 'Nature of business', value: 'Pharmaceutical wholesale' },
    { label: 'Legal status', value: 'Proprietorship' },
    { label: 'Drug licence · Form 20B', value: 'Licensed ✓' },
    { label: 'Drug licence · Form 21B', value: 'Licensed ✓' },
    { label: 'GST', value: 'Registered ✓' },
    { label: 'MSME (Udyam)', value: 'Registered ✓' },
  ],
  // Trust badges shown instead of full registration numbers.
  credentials: ['Drug licence 20B & 21B', 'GST registered', 'MSME (Udyam) registered', 'Trade mark applied'],
  // Credentials band on the home page. Numeric values animate as counters.
  stats: [
    { value: '2024', label: 'Registered in Ghaziabad' },
    { value: '20B · 21B', label: 'Wholesale drug licences' },
    { value: 'GST', label: 'Registered business' },
    { value: 'MSME', label: 'Udyam-registered enterprise' },
  ] as { value: string | number; suffix?: string; label: string }[],
}
