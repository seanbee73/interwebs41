import { ServiceItem, ProjectItem, PricingPackage, Testimonial } from '../types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'digital-strategy',
    num: '01',
    title: 'Digital Strategy',
    description: 'Understanding your goals and audience to create a roadmap that aligns design decisions with business objectives.',
    icon: 'Compass',
    keyDeliverables: [
      'Audience & Competitor Analysis',
      'User Journey Mapping',
      'Content & Information Architecture',
      'Conversion Optimization Blueprint'
    ],
    timeline: '2-3 Days'
  },
  {
    id: 'ui-ux-design',
    num: '02',
    title: 'UI/UX Design',
    description: 'Crafting intuitive interfaces that balance aesthetic appeal with usability, creating seamless user journeys.',
    icon: 'LayoutGrid',
    keyDeliverables: [
      'Interactive Wireframes & Prototypes',
      'Design System & Component Library',
      'Mobile-First Responsive Layouts',
      'Usability Testing & Iteration'
    ],
    timeline: '2-3 Days'
  },
  {
    id: 'web-development',
    num: '03',
    title: 'Web Development',
    description: 'Building performant, accessible websites using modern technologies that scale with your business needs.',
    icon: 'Code2',
    keyDeliverables: [
      'React / Vite / Next.js Development',
      'Modern Layout & Responsive Web Design (RWD)',
      'Fast Load Speeds & Touch-Friendly Targets',
      'API & CMS Integration'
    ],
    timeline: '2-4 Days'
  },
  {
    id: 'brand-identity',
    num: '04',
    title: 'Brand Identity',
    description: "Developing cohesive visual systems that communicate your brand's essence across every touchpoint.",
    icon: 'Sparkles',
    keyDeliverables: [
      'Logo & Visual Identity System',
      'Typography & Color Palette Guidelines',
      '3D Visual Assets & Micro-animations',
      'Content & Social Media Marketing (ongoing maintenance if needed)'
    ],
    timeline: '2-4 Days'
  }
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'neural-canvas',
    name: 'Hair Design',
    category: 'Immersive Web',
    image: 'https://ik.imagekit.io/kevfun/Screenshot%202026-09-02%20115849.jpg',
    description: 'A modern, fully responsive website for Bayview Mall Creative Hair Dsn featuring a service showcase, interactive booking flow, and an elegant, mobile-friendly design.',
    year: '2026',
    link: 'https://bayviewmalldsn.netlify.app/',
    tags: ['WebGL', 'Three.js', 'Shader Programming', 'Interactive']
  },
  {
    id: 'prism-experience',
    name: 'Salon',
    category: 'Brand Experience',
    image: 'https://ik.imagekit.io/kevfun/Screenshot%202026-09-02%20135011.jpg',
    description: 'A modern, fully responsive website for RK Salon featuring a service showcase, interactive booking flow, and an elegant, mobile-friendly design.',
    year: '2026',
    link: 'https://rk-salon.netlify.app/',
    tags: ['UI/UX Design', 'Brand Identity', 'Creative Direction']
  }
];

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: 'essentials',
    title: 'The Essentials',
    subtitle: 'Perfect for startups, elopements, or targeted single projects.',
    price: '$400',
    features: [
      'Comprehensive discovery & initial roadmap',
      'Single-page application or core UI design',
      'Mobile-first responsive layout',
      'Basic SEO & metadata setup',
      '1 Dedicated developer/designer'
    ]
  },
  {
    id: 'classic',
    title: 'The Classic',
    subtitle: 'Great for growing businesses seeking full digital transformation.',
    price: '$750',
    isPopular: true,
    features: [
      'Full brand & digital strategy workshop',
      'Multi-page responsive web app development',
      'Custom animations & micro-interactions',
      'CMS / API & Contact integration',
      'Comprehensive search engine indexing & performance optimization',
      'Timeline planning & priority support'
    ]
  },
  {
    id: 'bespoke',
    title: 'Custom Enterprise',
    subtitle: 'Full scale WebGL, spatial computing, or complete brand redesigns.',
    price: 'Custom',
    features: [
      'Bespoke WebGL 3D environments & shaders',
      'Complete brand identity design system',
      'Full stack server integration & database',
      'Dedicated ongoing maintenance & SLA',
      'Custom asset generation & art direction'
    ]
  }
];

export const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Discovery',
    desc: 'Deep research into your brand, audience, and business objectives to define a clear creative direction.'
  },
  {
    num: '02',
    title: 'Concept',
    desc: 'Visual exploration and interactive prototyping to establish narrative, aesthetics, and user journey.'
  },
  {
    num: '03',
    title: 'Craft',
    desc: 'Meticulous development with focused attention to performance, micro-animations, accessibility, and code quality.'
  },
  {
    num: '04',
    title: 'Launch',
    desc: 'Deployment, search engine indexing optimization, testing, and technical support to ensure effective business impact.'
  }
];

export const METRICS = [
  { num: 147, label: 'Projects Delivered' },
  { num: 52, label: 'Global Clients' },
  { num: 18, label: 'Design Awards' },
  { num: 9, label: 'Years Active' }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "InterWebs41 transformed our web presence completely. The WebGL particle system and intuitive UI resulted in a 140% increase in user engagement.",
    author: "Elena Rostova",
    role: "Creative Director",
    company: "Vanguard Studios"
  },
  {
    quote: "Their focus on digital strategy and performant web development exceeded our expectations. Fast, responsive, and truly creative.",
    author: "Marcus Vance",
    role: "Founder",
    company: "Aether Dynamics"
  }
];
