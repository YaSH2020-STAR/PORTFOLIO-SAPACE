/**
 * Mechanical / Gen Z portfolio content (from resume).
 * Replace project link placeholders with your actual URLs.
 */
export const mechanicalIdentity = {
  name: 'Digmandar Kawadkar',
  tagline: 'Mechanical Engineer · Manufacturing · FEA & Thermal',
  location: 'Tempe, AZ (open to relocate)',
  phone: '+1(602) 877-4650',
  email: 'Dkawadka@asu.edu',
  linkedin: 'https://linkedin.com/in/digmandar-kawadkar',
  publication: 'https://example.com/publication',
} as const;

export const mechanicalEducation = [
  {
    degree: 'Master of Science, Mechanical Engineering',
    school: 'Arizona State University',
    period: 'Expected May 2026',
    coursework:
      'Modern Manufacturing Methods, Mechatronics Engineering for Design and Manufacturing, Fundamentals of Semiconductor, Concepts of Material Science, Autonomous Vehicle Engineering',
  },
  {
    degree: 'Bachelor of Engineering, Mechanical Engineering',
    school: 'St. Vincent College of Engineering & Technology',
    period: 'Jul 2019 – May 2023',
    coursework: 'Advance Production Processes, Automation in Production, Strength of Materials',
  },
] as const;

export const mechanicalSkills = {
  design: [
    'SolidWorks (CSWP)',
    'AutoCAD',
    'GD&T',
    'Tolerance Stack-Up',
    'DFM/DFA',
    'ANSYS',
    'COMSOL Multiphysics',
    'MATLAB',
    'FEA',
    'Thermal & Structural Analysis',
  ],
  manufacturing: [
    'CNC Machining',
    '3D Printing (FDM, SLS)',
    'Lean Mfg.',
    '5S',
    'Kaizen',
    'VSM',
    'OEE',
    'Six Sigma Green Belt (ASQ)',
    'SPC',
    'FMEA',
    'RCA',
    'ISO 9001:2015',
    'Cpk',
    'Control Plans',
  ],
  automation: [
    'Arduino',
    'Servo/Stepper Motors',
    'Inverse Kinematics',
    'Robotics Systems',
  ],
  projectMgmt: [
    'Cross-Functional Leadership',
    'Technical Documentation',
    'Budget Management',
    'Production Planning',
  ],
} as const;

export interface MechanicalProject {
  id: string;
  title: string;
  period: string;
  bullets: string[];
  /** Add your project URL here */
  link: string;
  linkLabel: string;
}

export const mechanicalProjects: MechanicalProject[] = [
  {
    id: 'thermal-sls',
    title: 'Thermal & Mechanical Analysis of SLS Ti6Al4V: Continuous vs. Pulsed Laser',
    period: 'Jan 2025 – May 2025',
    bullets: [
      'Conducted FEA simulation of 60% porous Ti6Al4V using COMSOL Multiphysics to compare continuous (800W, 2mm/s) vs. pulsed laser parameters, analyzing thermal and stress behavior in an argon environment.',
      'Identified critical stress concentrations; demonstrated that increased pulse frequency elevates temperatures and provided optimization recommendations to achieve the 1250°C sintering target.',
    ],
    link: 'https://example.com/thermal-sls-project',
    linkLabel: 'View project',
  },
  {
    id: 'fdm-thermal',
    title: 'FDM Thermal Simulation',
    period: 'Jan 2025 – May 2025',
    bullets: [
      'Simulated FDM thermal behavior of PA12 and PC using ANSYS Workbench (steady-state & transient), analyzing 30-block layer-by-layer deposition and identifying PA12 (210.46°C peak) as optimal for rapid prototyping and PC (164.4°C peak) for high-strength applications.',
      'Developed FEA thermal models using element birth/death techniques and tetrahedral meshing in ANSYS Workbench 2025 R1, validated against Mat Web datasheets to guide material selection across 2 FDM use cases.',
    ],
    link: 'https://example.com/fdm-thermal-project',
    linkLabel: 'View project',
  },
  {
    id: 'scara-robot',
    title: 'SCARA Robot Arm Development',
    period: 'Jan 2024 – May 2024',
    bullets: [
      'Designed and fabricated a 4-DOF SCARA robotic arm with 0.5mm repeatability using SolidWorks and Arduino-based inverse kinematics control for precision pick-and-place operations.',
      'Won 1st place in ASU design competition; reduced manual handling time 60% and prototyping costs 40% (~$8K annual savings) for 12+ lab users, achieving 0.3s cycle time and 99.2% positioning accuracy.',
    ],
    link: 'https://example.com/scara-robot-project',
    linkLabel: 'View project',
  },
  {
    id: 'e-formula',
    title: 'EV Drivetrain & Manufacturing Lead | E-Formula Ashwariders',
    period: 'Jan 2021 – Jan 2023',
    bullets: [
      'As Drivetrain Lead, directed 12+ member team in EV drivetrain design, FEA simulation, and fabrication using DFM principles, reducing component costs by 20%, weight by 15%, and rework to 3%, contributing to a Top 10 finish at Formula Bharat 2023 in the team\'s inaugural season.',
      'Managed $15K budget and full drivetrain development lifecycle, spanning motor selection, CAD modeling, drivetrain assembly, and iterative performance testing, achieving 92% power transmission efficiency and 98% on-time delivery within competition deadlines.',
    ],
    link: '',
    linkLabel: '',
  },
];

export interface MechanicalExperience {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export const mechanicalExperience: MechanicalExperience[] = [
  {
    role: 'Quality Engineer',
    company: 'SRA Techno Craft Pvt. Ltd.',
    period: 'Sep 2023 – Feb 2024',
    bullets: [
      'Recognized for contributions to defect reduction and process improvements; promoted to lead quality initiatives and vendor audit coordination after 3 months, expanding scope across 13 external audits.',
      'Conducted dimensional inspections using precision instruments and manual SPC techniques, maintaining a 3% defect rate and ensuring positional tolerance of 0.5 mm per customer drawings.',
      'Managed and standardized over 150 quality-related documents, including inspection reports and traceability logs, in Excel, directly enhancing batch traceability and pass/fail feedback accuracy by 15%.',
      'Spearheaded collaborative vendor audits, decreasing vendor-related defects by 10% and maintaining a 97% batch acceptance rate across 150+ quality documents.',
    ],
  },
  {
    role: 'Automotive Service Intern',
    company: 'Arun Motors (Maruti Suzuki Authorized)',
    period: 'Jun 2022 – Aug 2022',
    bullets: [
      'Leveraged live sensor data and fault code analysis to diagnose and resolve engine faults 13% faster; reduced unnecessary part replacements and improved workshop throughput in the assembly line.',
      'Restored a flood-damaged 1.2L K-Series engine to operational condition through full teardown, contamination inspection, and precision reassembly, eliminating the need for a full engine replacement.',
      'Enhanced diagnostic efficiency by 15% through accurate identification of a faulty coolant temperature sensor in a Swift, saving 2-3 hours of labor for subsequent repairs.',
      'Spearheaded a comprehensive overhaul of transmission systems in collaboration with senior technicians; achieved a demonstrable 5% increase in overall vehicle performance, and improved fuel efficiency by 3%.',
    ],
  },
];
