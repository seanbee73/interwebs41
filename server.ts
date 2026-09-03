import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const getDirname = () => {
  if (typeof __dirname !== 'undefined') return __dirname;
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch {
    return process.cwd();
  }
};

const currentDir = getDirname();
const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'siteContent.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');
const ADMIN_CONFIG_FILE = path.join(DATA_DIR, 'adminConfig.json');

// Default fallback site content
const DEFAULT_SITE_CONTENT = {
  hero: {
    studioBadge: 'AI Web Development Studio',
    title: 'InterWebs41',
    subtitle: 'Lightning Fast Website Development. Deploy Your Website In DAYS, NOT Weeks Or Months!',
    primaryCtaText: 'Start Your Project',
    secondaryCtaText: 'Explore Capabilities'
  },
  contactInfo: {
    email: 'interwebs41@gmail.com',
    phone: '647-894-6864',
    address: 'Toronto, Ontario / Remote Worldwide',
    location: 'Toronto, Ontario, Canada'
  },
  manifesto: {
    badge: 'Our Philosophy',
    title: 'We build high-performance, immersive web experiences that convert.',
    paragraph1: 'At InterWebs41, we fuse cutting-edge AI architecture with visual craft and responsive performance to build digital assets that stand out in crowded markets.',
    paragraph2: 'Every line of code, animation, and UI element is engineered to deliver measurable business impact, lightning fast loading speeds, and unforgettable user engagement.'
  },
  metrics: [
    { num: 147, label: 'Projects Delivered' },
    { num: 52, label: 'Global Clients' },
    { num: 18, label: 'Design Awards' },
    { num: 9, label: 'Years Active' }
  ],
  services: [
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
  ],
  projects: [
    {
      id: 'neural-canvas',
      name: 'Hair Design',
      category: 'Immersive Web',
      image: 'https://ik.imagekit.io/kevfun/Screenshot%202026-09-02%20115849.jpg',
      description: 'A modern, fully responsive website for Bayview Mall Creative Hair Dsn featuring a service showcase, interactive booking flow, and an elegant, mobile-friendly design.',
      year: '2026',
      link: 'https://bayviewmalldsn.netlify.app/',
      tags: ['Dynamic Filtering', 'Real-time Search', 'Interactive Elements']
    },
    {
      id: 'prism-experience',
      name: 'Salon',
      category: 'Brand Experience',
      image: 'https://ik.imagekit.io/kevfun/Screenshot%202026-09-02%20135011.jpg',
      description: 'A modern, fully responsive website for RK Salon featuring a service showcase, interactive booking flow, and an elegant, mobile-friendly design.',
      year: '2026',
      link: 'https://rk-salon.netlify.app/',
      tags: ['UI/UX Design', 'Brand Identity', 'Interactive Elements']
    }
  ],
  pricing: [
    {
      id: 'essentials',
      title: 'Basic Web Design Packages',
      subtitle: 'Perfect for individuals, new startups, or small businesses with tight budgets who simply need a straightforward, informative online presence.',
      price: 'from $1,000',
      features: [
        'Design & Customization - A simple layout with minor customization. Mobile responsive layout.',
        'Scope & Pages - Covers key pages like Home, About Us, Services, and Contact) usually around 5 pages.',
        'Core Features - Essential elements like basic contact forms, simple photo galleries, and links to social media profiles. Basic SEO capabilities & metadata setup.',
        'Revisions - Includes up to 3 rounds of design changes.'
      ]
    },
    {
      id: 'classic',
      title: 'Standard Web Design Packages',
      subtitle: 'Best For  - Small to medium-sized businesses, professional bloggers, and independent service providers who want a stronger, more polished online brand presence.',
      price: 'from $2,500',
      isPopular: true,
      features: [
        'Design & Customization - Provides more design flexibility to give the site a unique look, often including a fully custom-designed homepage.',
        'Scope & Pages - Covers more pages than a basic package (usually upto 10 pages)',
        'Core Features - Builds on the basics by adding a blog, Responsive Web Design (RWD) with mobile flexibility layout, improved SEO features and simple e-commerce capabilities for selling a small number of products.',
        'Revisions - Includes up to 5 rounds of design changes. Options for ongoing monthly maintenance.',
        'Comprehensive search engine indexing & performance optimization.'
      ]
    },
    {
      id: 'bespoke',
      title: 'Premium Web Design Packages',
      subtitle: 'Best For - Established businesses, large organizations, or brands with highly competitive online goals and the budget to invest in a top-tier, custom web experience',
      price: 'from $5,000',
      features: [
        'Design & Customization - Ofers a fully bespoke, custom-tailored design built entirely around the brand, utilizing advanced layouts, custom animations, and interactive elements.',
        'Scope & Pages - Covers comprehensive, large-scale sites of 20+ pages. Mobile responsive design features.',
        'Core Features - Includes a full-featured e-commerce storefront with extensive product catalogs, advanced/in-depth SEO, and professional content creation assistance (like writing and photography).',
        'Revisions & Support - ongoing maintenance, dedicated support, and unlimited rounds of revisions.'
      ]
    }
  ],
  process: [
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
  ],
  testimonials: [
    {
      quote: 'InterWebs41 transformed our web presence completely. The WebGL particle system and intuitive UI resulted in a 140% increase in user engagement.',
      author: 'Elena Rostova',
      role: 'Creative Director',
      company: 'Vanguard Studios'
    },
    {
      quote: 'Their focus on digital strategy and performant web development exceeded our expectations. Fast, responsive, and truly creative.',
      author: 'Marcus Vance',
      role: 'Founder',
      company: 'Aether Dynamics'
    }
  ]
};

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helpers for JSON persistence
function loadSiteContent() {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const raw = fs.readFileSync(CONTENT_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading siteContent.json:', err);
  }
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(DEFAULT_SITE_CONTENT, null, 2));
  return DEFAULT_SITE_CONTENT;
}

function saveSiteContent(content: any) {
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
}

function loadSubmissions() {
  try {
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading submissions.json:', err);
  }
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2));
  return [];
}

function saveSubmissions(submissions: any[]) {
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
}

function loadAdminConfig() {
  try {
    if (fs.existsSync(ADMIN_CONFIG_FILE)) {
      const raw = fs.readFileSync(ADMIN_CONFIG_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading adminConfig.json:', err);
  }
  const defaultConfig = { password: 'Casper707!', token: 'iw41_admin_session_token_939' };
  fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
  return defaultConfig;
}

function saveAdminConfig(config: any) {
  fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(config, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', studio: 'InterWebs41 AI Web Development Studio' });
  });

  // Admin Auth Login
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    const config = loadAdminConfig();

    if (password === config.password) {
      return res.json({
        success: true,
        token: config.token,
        message: 'Admin authentication successful.',
      });
    } else {
      return res.status(401).json({
        success: false,
        error: 'Invalid admin passcode.',
      });
    }
  });

  // Admin Change Password
  app.post('/api/admin/change-password', (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const config = loadAdminConfig();

    if (currentPassword !== config.password) {
      return res.status(401).json({ success: false, error: 'Current passcode is incorrect.' });
    }

    if (!newPassword || newPassword.trim().length < 4) {
      return res.status(400).json({ success: false, error: 'New passcode must be at least 4 characters long.' });
    }

    config.password = newPassword.trim();
    saveAdminConfig(config);

    return res.json({ success: true, message: 'Admin passcode updated successfully.' });
  });

  // Get Site Content
  app.get('/api/content', (req, res) => {
    const content = loadSiteContent();
    res.json(content);
  });

  // Update Site Content
  app.post('/api/content', (req, res) => {
    const authHeader = req.headers.authorization;
    const config = loadAdminConfig();

    if (!authHeader || authHeader !== `Bearer ${config.token}`) {
      // Also allow password in body or header as fallback
      const pass = req.headers['x-admin-passcode'] || req.body.adminPasscode;
      if (pass !== config.password) {
        return res.status(401).json({ success: false, error: 'Unauthorized. Admin authorization required.' });
      }
    }

    const { content } = req.body;
    if (!content || typeof content !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid site content payload provided.' });
    }

    const current = loadSiteContent();
    const updatedContent = { ...current, ...content };
    saveSiteContent(updatedContent);

    console.log('[InterWebs41 Admin] Site content updated and saved to siteContent.json');

    res.json({
      success: true,
      message: 'Site content saved successfully!',
      content: updatedContent,
    });
  });

  // Reset Site Content to Default
  app.post('/api/content/reset', (req, res) => {
    const config = loadAdminConfig();
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader !== `Bearer ${config.token}`) {
      return res.status(401).json({ success: false, error: 'Unauthorized.' });
    }

    saveSiteContent(DEFAULT_SITE_CONTENT);
    res.json({
      success: true,
      message: 'Site content reset to factory defaults.',
      content: DEFAULT_SITE_CONTENT,
    });
  });

  // Contact Form Submission Endpoint
  app.post('/api/contact', (req, res) => {
    const { name, email, service, budget, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide your name, email address, and message.',
      });
    }

    const submissions = loadSubmissions();

    const newSubmission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: String(name).trim(),
      email: String(email).trim(),
      service: String(service || 'General Inquiry').trim(),
      budget: String(budget || 'Not specified').trim(),
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
      status: 'unread',
      adminNotes: '',
    };

    submissions.unshift(newSubmission);
    saveSubmissions(submissions);

    console.log('[InterWebs41 Contact API] New project inquiry saved:', newSubmission);

    const siteContent = loadSiteContent();
    const targetEmail = siteContent.contactInfo?.email || 'interwebs41@gmail.com';

    const mailSubject = encodeURIComponent(`[InterWebs41 Inquiry] ${newSubmission.service} - ${newSubmission.name}`);
    const mailBody = encodeURIComponent(
      `Name: ${newSubmission.name}\nEmail: ${newSubmission.email}\nService: ${newSubmission.service}\nBudget: ${newSubmission.budget}\n\nMessage:\n${newSubmission.message}`
    );
    const directMailto = `mailto:${targetEmail}?subject=${mailSubject}&body=${mailBody}`;

    return res.json({
      success: true,
      message: 'Your project inquiry has been saved and sent. We will respond within 24 hours!',
      submissionId: newSubmission.id,
      mailtoUrl: directMailto,
      recipientEmail: targetEmail,
    });
  });

  // Get All Submissions (Admin / Inspector)
  app.get('/api/contact/submissions', (req, res) => {
    const submissions = loadSubmissions();
    res.json({
      count: submissions.length,
      submissions,
    });
  });

  // Update Submission Status or Notes
  app.patch('/api/contact/submissions/:id', (req, res) => {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const submissions = loadSubmissions();
    const index = submissions.findIndex((s: any) => s.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Submission not found.' });
    }

    if (status) submissions[index].status = status;
    if (adminNotes !== undefined) submissions[index].adminNotes = adminNotes;

    saveSubmissions(submissions);

    res.json({
      success: true,
      submission: submissions[index],
    });
  });

  // Delete Submission
  app.delete('/api/contact/submissions/:id', (req, res) => {
    const { id } = req.params;
    let submissions = loadSubmissions();
    const initialCount = submissions.length;

    submissions = submissions.filter((s: any) => s.id !== id);

    if (submissions.length === initialCount) {
      return res.status(404).json({ success: false, error: 'Submission not found.' });
    }

    saveSubmissions(submissions);

    res.json({
      success: true,
      message: 'Submission deleted successfully.',
    });
  });

  // Vite middleware for development vs Production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[InterWebs41 CMS Server] Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
