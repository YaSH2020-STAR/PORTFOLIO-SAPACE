export const identity = {
  name: 'Yash Dorshetwar',
  location: 'Tempe, Arizona',
  email: 'ydoorshet@asu.edu',
  linkedin: 'https://linkedin.com/in/yash-dorshetwar-55a983191',
  github: 'https://github.com',
  role: 'Applied AI Engineer | Data Science & ML Systems',
  education: [
    { degree: 'MS in Robotics & Autonomous Systems (AI)', school: 'Arizona State University', period: '2024–2026' },
    { degree: 'BTech in Artificial Intelligence', school: undefined, period: '2019–2023' },
  ],
} as const;

export const home = {
  headline: 'Building Intelligent Systems That Learn, Adapt, and Scale',
  subheading: 'Applied AI Engineer & Data Science · Robotics graduate student at Arizona State University',
  intro: 'I design and deploy intelligent systems — from data science and ML pipelines to NLP-powered automation and full-stack applications. My work bridges data, AI research, and real-world impact.',
  cta: 'Get in touch',
} as const;

export const about = {
  paragraphs: [
    'I am an Applied AI Engineer with a strong foundation in data science, currently pursuing a Master\'s degree in Robotics and Autonomous Systems (Artificial Intelligence) at Arizona State University. My work focuses on machine learning systems, data-driven solutions, intelligent automation, and scalable AI.',
    'I enjoy turning raw data into insight — from exploratory analysis and modeling to deployable systems. Data science and engineering go hand in hand in how I approach problems.',
    'Beyond technology, I\'ve led large student organizations, managed teams, and organized events at scale — shaping how I think about leadership, systems, and impact.',
  ],
} as const;

export interface CaseStudy {
  id: string;
  title: string;
  problem: string;
  approach: string;
  tech: string[];
  impact: string;
  link?: string;
  linkLabel?: string;
}

export const projectsCaseStudies: CaseStudy[] = [
  {
    id: 'applied-ml-research',
    title: 'Applied ML Research',
    problem: 'Research and production requirements for robust, scalable temporal and behavioral modeling.',
    approach: 'Designed and implemented PyTorch-based pipelines for temporal modeling with emphasis on real-world constraints and reproducibility.',
    tech: ['PyTorch', 'Temporal modeling', 'Python', 'MLOps'],
    impact: 'Foundation for ongoing research and deployable prototypes.',
  },
  {
    id: 'customer-segmentation',
    title: 'Customer Segmentation',
    problem: 'Need to drive actionable insights from large-scale user behavior data.',
    approach: 'Built segmentation and recommendation pipelines on 10k+ users, with A/B testing and metric-driven iteration.',
    tech: ['Python', 'Clustering', 'Recommendation systems', 'Data pipelines'],
    impact: '15–20% ROI lift from targeted interventions.',
  },
  {
    id: 'mental-health-monitoring',
    title: 'Mental Health Monitoring System',
    problem: 'Early detection and support for mental wellness from behavioral and textual signals.',
    approach: 'LSTM-based sequence modeling with careful feature engineering and ethical safeguards.',
    tech: ['LSTM', 'NLP', 'Python', 'PyTorch'],
    impact: '89% F1 on validation; framework for low-friction monitoring.',
  },
  {
    id: 'ezee-voice',
    title: 'Ezee – Voice Automation',
    problem: 'Hands-free, reliable voice-driven automation for workflows.',
    approach: 'End-to-end voice pipeline with robust ASR and intent handling.',
    tech: ['Speech', 'NLP', 'Automation', 'Python'],
    impact: '92% accuracy in target scenarios.',
  },
  {
    id: 'goods-connect',
    title: 'Goods Connect',
    problem: 'Hackathon challenge: efficient matching and logistics for goods.',
    approach: 'Full-stack solution with matching logic and clear UX under time constraints.',
    tech: ['Full-stack', 'React', 'APIs', 'Matching algorithms'],
    impact: 'Hackathon winner.',
  },
];

export const productApp = {
  title: 'DsYnc – Intelligent Data & Workflow Synchronization',
  tagline: 'Proof that I can ship real products, not just models.',
  points: [
    'Full-stack application with end-to-end ownership',
    'Backend APIs and scalable architecture',
    'Cloud deployment and operations',
  ],
} as const;

export const research = {
  interests: [
    'Data science & ML systems',
    'Temporal & behavioral modeling',
    'NLP & human-centered AI',
    'AI for social good',
  ],
  current: 'Ongoing applied ML and data science research using PyTorch, with focus on robustness, scalability, and real-world constraints.',
} as const;

export const leadership = {
  summary: 'Led large student organizations, managed teams, and organized events at scale. This experience shapes how I think about leadership, systems, and impact beyond code.',
  // Can add bullets or highlights here if you have specific roles/events
} as const;

export const odyssey = {
  title: 'Odyssey – Beyond Code & Algorithms',
  intro: 'Engineering is how I build systems. Exploration is how I build perspective.',
  paragraphs: [
    'I\'m drawn to nature, wildlife, and open landscapes — hiking trails, observing animals, and capturing moments through photography. These experiences shape how I think about patience, patterns, and systems.',
    'Music is another constant. I gravitate toward R&B — rhythm, emotion, storytelling — often playing during late-night coding sessions or long reflective walks.',
  ],
  closing: 'Odyssey represents movement: between technology and nature, between logic and emotion, between structure and creativity.',
  galleryPlaceholder: true, // for future image galleries
} as const;

export const contact = {
  headline: 'Let\'s build something meaningful together.',
  email: identity.email,
  linkedin: identity.linkedin,
  github: identity.github,
  /** Path to resume PDF in public folder (e.g. /resume.pdf) */
  resumePdf: '/resume.pdf',
} as const;
