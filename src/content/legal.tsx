import type { ReactNode } from 'react'
import Link from 'next/link'
import { site } from '../data/site'

/**
 * Privacy policy and terms of use content.
 *
 * Written for India: Digital Personal Data Protection Act 2023 + DPDP Rules 2025
 * (phased in until May 2027), IT Act s.43A / SPDI Rules 2011 (privacy policy and
 * grievance officer on the website), and the Drugs and Cosmetics Act 1940 / Rules 1945
 * (wholesale licences 20B / 21B — sale only to licensed buyers).
 * Values marked "BUSINESS POLICY" are sensible defaults the client should confirm.
 */

export interface LegalSection {
  id: string
  title: string
  body: ReactNode
}

export interface LegalDoc {
  title: string
  intro: ReactNode
  highlights?: { title: string; text: string }[]
  sections: LegalSection[]
}

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} className="font-medium text-brand underline-offset-4 hover:underline">{children}</a>
)
const Ul = ({ items }: { items: ReactNode[] }) => (
  <ul className="list-disc space-y-1.5 pl-5 marker:text-brand">{items.map((x, i) => <li key={i}>{x}</li>)}</ul>
)

const contactBlock = (
  <div className="rounded-2xl border border-line bg-mist/50 p-5 text-sm leading-relaxed">
    <p className="font-semibold text-ink">{site.proprietor}, {site.designation} — Grievance Officer</p>
    <p>{site.name}, {site.addressLine}, {site.cityLine}</p>
    <p className="mt-1">Email: <A href={site.emailHref}>{site.email}</A> · Phone / WhatsApp: <A href={site.phoneHref}>{site.phone}</A></p>
  </div>
)

export const privacy: LegalDoc = {
  title: 'Privacy policy',
  intro: (
    <>This policy explains what personal data {site.name} collects through this website, why, who it is shared with, how long it is kept, and the rights you have over it. It is written to meet India’s Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000.</>
  ),
  highlights: [
    { title: 'Only what you type', text: 'We collect the details you enter in our enquiry forms — nothing else about you.' },
    { title: 'No tracking', text: 'No analytics, advertising or tracking cookies on this website.' },
    { title: 'Never sold', text: 'We do not sell, rent or trade your personal data to anyone.' },
    { title: 'Your control', text: 'Ask us any time to see, correct or delete your data.' },
  ],
  sections: [
    {
      id: 'who-we-are',
      title: 'Who we are',
      body: (
        <p>
          This website is operated by <strong>{site.name}</strong>, a sole proprietorship of {site.proprietor}, licensed pharmaceutical wholesaler and distributor at {site.addressLine}, {site.cityLine}.
          For personal data collected through this website, {site.name} is the <em>Data Fiduciary</em> under the Digital Personal Data Protection Act, 2023.
        </p>
      ),
    },
    {
      id: 'what-we-collect',
      title: 'What we collect',
      body: (
        <>
          <p><strong>Information you give us</strong> when you use our enquiry, quote or contact forms:</p>
          <Ul
            items={[
              'Name and title, firm or pharmacy name, and buyer type (for example pharmacy, hospital or distributor)',
              'Mobile number and, if you provide it, email address',
              'Country, and whether you would like us to contact you on WhatsApp',
              'Your requirement — products, strengths and quantities',
            ]}
          />
          <p><strong>Information collected automatically.</strong> We do not use analytics, advertising or tracking tools. Our hosting provider records basic technical logs (such as IP address, browser type, the page requested and the time) to keep the website running and secure.</p>
          <p>We do not ask for, and you should not send us, sensitive data such as health records, prescriptions of patients, passwords or bank card details through this website.</p>
        </>
      ),
    },
    {
      id: 'why-we-use-it',
      title: 'Why we use it',
      body: (
        <>
          <Ul
            items={[
              'To reply to your enquiry with rates, availability and dispatch details',
              'To verify that you are a licensed buyer — the Drugs and Cosmetics Rules, 1945 allow us to sell only to persons holding the required licence',
              'To contact you by phone, email or WhatsApp about your enquiry or order',
              'To keep business, tax and regulatory records as the law requires',
              'To protect the website and our business against misuse and fraud',
            ]}
          />
          <p>We do not use your data for unrelated marketing without asking you first.</p>
        </>
      ),
    },
    {
      id: 'legal-basis',
      title: 'Our basis for using your data',
      body: (
        <p>
          We process your data on the basis of the <strong>consent</strong> you give when you submit a form, for the specific purposes listed above. Where the law requires us to keep or share data — for example, records under GST law or the Drugs and Cosmetics Act — we rely on the <strong>legitimate uses</strong> permitted by Section 7 of the Digital Personal Data Protection Act, 2023.
          You may withdraw your consent at any time (see <a href="#your-rights" className="font-medium text-brand hover:underline">Your rights</a>); this does not affect anything done before you withdrew it.
        </p>
      ),
    },
    {
      id: 'sharing',
      title: 'Who we share it with',
      body: (
        <>
          <p>We share personal data only as needed to run this website and our business:</p>
          <Ul
            items={[
              <><strong>Service providers</strong> who host this website and store enquiries in a secure cloud database (Supabase), acting on our instructions.</>,
              <><strong>Google</strong>, if you view the map on our Contact page — the embedded map is provided by Google and governed by Google’s privacy policy.</>,
              <><strong>WhatsApp (Meta)</strong>, only if you choose to message us on WhatsApp.</>,
              <><strong>Government authorities</strong> — such as drug control, tax or law-enforcement agencies — when we are required by law.</>,
            ]}
          />
          <p>We never sell, rent or trade your personal data.</p>
        </>
      ),
    },
    {
      id: 'storage',
      title: 'Where your data is stored',
      body: (
        <p>Our service providers may store data on servers located inside or outside India. Any transfer outside India is made only as permitted by Indian law, and never to a country restricted by the Government of India.</p>
      ),
    },
    {
      id: 'retention',
      title: 'How long we keep it',
      body: (
        <>
          {/* BUSINESS POLICY: retention periods — confirm with the client and their CA. */}
          <Ul
            items={[
              <>Enquiries that do not lead to an order: up to <strong>24 months</strong> from your last contact, then deleted.</>,
              'Records linked to orders and invoices: for as long as GST and drug laws require us to keep them.',
              'Technical logs: kept by our hosting provider for a short period for security.',
            ]}
          />
          <p>When data is no longer needed, we delete it or make it anonymous.</p>
        </>
      ),
    },
    {
      id: 'security',
      title: 'How we protect it',
      body: (
        <p>
          The website is served over an encrypted (HTTPS) connection. Enquiries are stored in an access-controlled database that only authorised staff can read, protected by individual logins. We take reasonable security measures as required by the Information Technology Act, 2000 and the DPDP Rules, 2025.
          No method of transmission or storage is completely secure, but if a personal data breach affects you we will inform you and the Data Protection Board of India as the law requires.
        </p>
      ),
    },
    {
      id: 'your-rights',
      title: 'Your rights',
      body: (
        <>
          <p>Under the Digital Personal Data Protection Act, 2023 you can:</p>
          <Ul
            items={[
              'Ask for a summary of the personal data we hold about you and how we use it',
              'Ask us to correct, complete or update it',
              'Ask us to delete it, unless we must keep it by law',
              'Withdraw your consent — as easily as you gave it',
              'Nominate another person to exercise your rights if you die or become incapable',
              'Raise a grievance with us, and then with the Data Protection Board of India',
            ]}
          />
          <p>To use any of these rights, contact our Grievance Officer (below). We may ask you to confirm your identity, and we aim to respond within <strong>30 days</strong>.</p>
        </>
      ),
    },
    {
      id: 'cookies',
      title: 'Cookies',
      body: (
        <p>
          This website does not use advertising, analytics or tracking cookies. A login cookie is used only on the staff admin area, to keep authorised users signed in. The Google map on our Contact page may set its own cookies when it loads.
        </p>
      ),
    },
    {
      id: 'children',
      title: 'Children',
      body: <p>This website is meant for businesses and adults. We do not knowingly collect personal data from anyone under 18. If you believe a child has sent us their data, contact us and we will delete it.</p>,
    },
    {
      id: 'changes',
      title: 'Changes to this policy',
      body: <p>We may update this policy as our website or the law changes. Significant changes will be highlighted on this page.</p>,
    },
    {
      id: 'contact',
      title: 'Grievance Officer and contact',
      body: (
        <>
          <p>For questions, requests or complaints about your personal data, contact:</p>
          {contactBlock}
        </>
      ),
    },
  ],
}

export const terms: LegalDoc = {
  title: 'Terms of use',
  intro: (
    <>These terms govern your use of this website and any enquiry or order you place with {site.name}. Please read them carefully — by using the website or sending an enquiry, you agree to them.</>
  ),
  highlights: [
    { title: 'Licensed buyers only', text: 'We supply only to buyers who hold the licences the law requires.' },
    { title: 'Quotes, not prices', text: 'An enquiry is not an order; prices are confirmed in writing.' },
    { title: 'Not medical advice', text: 'Product information is for trade reference only.' },
    { title: 'Indian law', text: 'Governed by Indian law; courts at Ghaziabad.' },
  ],
  sections: [
    {
      id: 'about',
      title: 'About us',
      body: (
        <p>
          This website is operated by <strong>{site.name}</strong>, a sole proprietorship of {site.proprietor}, {site.addressLine}, {site.cityLine}. We are a pharmaceutical wholesaler and distributor licensed under the Drugs and Cosmetics Act, 1940 (wholesale drug licences in Forms 20B and 21B) and registered under GST.
        </p>
      ),
    },
    {
      id: 'who-can-buy',
      title: 'Who can buy from us',
      body: (
        <>
          <p>We are a wholesale (business-to-business) supplier. As required by the Drugs and Cosmetics Rules, 1945, we sell only to:</p>
          <Ul
            items={[
              'Retail and wholesale chemists and distributors holding a valid drug licence',
              'Hospitals, nursing homes, clinics, and medical, educational or research institutions',
              'Registered medical practitioners, for supply to their patients',
              'Government officers or authorities purchasing on behalf of the Government',
            ]}
          />
          <p>We may ask for a copy of your drug licence, GST registration or other documents before quoting or supplying, and we may decline any enquiry or order at our discretion. <strong>We do not sell medicines to individual consumers</strong>, and we do not deal in drugs listed in Schedule X.</p>
        </>
      ),
    },
    {
      id: 'product-information',
      title: 'Product information',
      body: (
        <>
          <p>Product names, compositions, strengths and pack sizes are given for trade reference and may change without notice. Images and illustrations are representative only — the actual product and packaging may differ. All trademarks and brand names of products belong to their respective manufacturers.</p>
          <p><strong>Nothing on this website is medical advice.</strong> Prescription medicines must be used only under the supervision of a registered medical practitioner.</p>
        </>
      ),
    },
    {
      id: 'quotes-and-prices',
      title: 'Enquiries, quotes and prices',
      body: (
        <>
          {/* BUSINESS POLICY: quote validity — confirm with the client. */}
          <Ul
            items={[
              'Sending an enquiry does not create an order or any obligation for either party.',
              'Prices shown as “Price on request” are quoted individually. Any prices shown are indicative and subject to change.',
              'A quotation is valid only for the period stated on it, and is subject to stock availability.',
              'Unless stated otherwise, quoted prices exclude GST, which is charged as applicable.',
            ]}
          />
        </>
      ),
    },
    {
      id: 'orders',
      title: 'Orders, payment and delivery',
      body: (
        <Ul
          items={[
            'An order is confirmed only when we issue a proforma invoice or written confirmation and the agreed payment terms are met.',
            'Every supply is made against a GST invoice showing batch number and expiry date.',
            'Dispatch and delivery times are estimates. We are not responsible for delays caused by carriers or events beyond our reasonable control.',
            'Where cold-chain or special handling is needed, it is arranged as agreed in writing.',
          ]}
        />
      ),
    },
    {
      id: 'returns',
      title: 'Shortages, damage and returns',
      body: (
        <>
          {/* BUSINESS POLICY: complaint window and return rules — confirm with the client. */}
          <p>Please check goods when you receive them and report any shortage, breakage or incorrect item within <strong>48 hours</strong> of delivery, with the invoice number and photographs. Returns of expired or near-expiry stock follow the agreed terms and the applicable manufacturer’s return policy. Medicines that have left our control cannot be returned for reasons of safety, except where the law or the agreed terms allow it.</p>
        </>
      ),
    },
    {
      id: 'website-use',
      title: 'Using this website',
      body: (
        <>
          <p>You agree not to:</p>
          <Ul
            items={[
              'Submit false information, or pose as another person or business',
              'Use the website for any unlawful purpose, including any attempt to obtain medicines without the required licence or prescription',
              'Copy or scrape the website’s content, or send automated or bulk requests',
              'Attempt to gain unauthorised access to the website, its admin area or its systems, or interfere with their operation',
            ]}
          />
        </>
      ),
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual property',
      body: (
        <p>
          The website’s design, text and graphics belong to {site.name}. The name and logo “{site.name}” are the subject of trade mark application No. {site.trademark.number} (Class {site.trademark.class}). You may not use them without our written permission. Product brand names and marks belong to their respective owners.
        </p>
      ),
    },
    {
      id: 'liability',
      title: 'Disclaimer and limitation of liability',
      body: (
        <>
          <p>The website is provided “as is”. We try to keep information accurate and current, but we do not guarantee that it is complete, error-free or always available.</p>
          <p>To the extent permitted by law, {site.name} is not liable for any indirect or consequential loss arising from use of this website. Our total liability for any order is limited to the value of the goods in that order. Nothing in these terms limits any liability that cannot be limited under Indian law.</p>
        </>
      ),
    },
    {
      id: 'privacy',
      title: 'Privacy',
      body: <p>How we handle personal data is explained in our <Link href="/privacy" className="font-medium text-brand underline-offset-4 hover:underline">Privacy policy</Link>, which forms part of these terms.</p>,
    },
    {
      id: 'law',
      title: 'Governing law and disputes',
      body: <p>These terms are governed by the laws of India. Any dispute is subject to the exclusive jurisdiction of the courts at Ghaziabad, Uttar Pradesh. We encourage you to contact us first — most issues can be resolved quickly.</p>,
    },
    {
      id: 'changes',
      title: 'Changes to these terms',
      body: <p>We may update these terms from time to time. The version published on this page applies to your use of the website.</p>,
    },
    {
      id: 'contact',
      title: 'Contact',
      body: (
        <>
          <p>Questions about these terms or a complaint about our service:</p>
          {contactBlock}
        </>
      ),
    },
  ],
}
