export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  tools: string[];
  overview: string;
  /** Optional: 'mqtt' for client-broker-server diagram, or custom SVG/content key */
  diagramType?: 'mqtt' | 'pipeline' | 'webapp' | null;
  diagramLabel?: { left?: string; center?: string; right?: string; flowLeft?: string; flowRight?: string };
  semester?: string;
  teamSize?: number;
  date?: string;
  course?: string;
  /** Extra paragraphs for modal */
  details?: string[];
  /** Optional URL (e.g. GitHub, live demo) */
  link?: string;
  /** Label for the link, e.g. "GitHub" or "Live demo" */
  linkLabel?: string;
}

export const projects: Project[] = [
  {
    id: 'real-time-ai-sales',
    title: 'Real Time AI Sales Management',
    shortDescription: 'Developed a real-time sales management system with data streaming, analysis, and recommendation engine.',
    tools: ['MQTT', 'Kafka', 'Spark', 'MongoDB', 'Python', 'Deep Learning', 'Recommendation Systems'],
    overview: 'Developed a real-time sales management system with data streaming, analysis, and recommendation engine. In this comprehensive project, we developed a real-time sales management system with three main components: (1) MQTT-based data ingestion from clients, (2) Kafka and Spark for stream processing and analytics, and (3) a recommendation engine powered by deep learning for sales insights.',
    diagramType: 'mqtt',
    diagramLabel: {
      left: '1. Client',
      center: '2. MQTT Broker',
      right: '3. Server',
      flowRight: 'Publish',
      flowLeft: 'Subscribe',
    },
    semester: 'Semester 5',
    teamSize: 3,
    date: '2023',
    course: '21AIE304 Big Data and Management Systems',
    details: [
      'In this comprehensive project, we developed a real-time sales management system with three main components:',
      '1. Client-side publishers sending sales events over MQTT.',
      '2. MQTT Broker for message routing and persistence.',
      '3. Server subscribers processing streams with Kafka and Spark, storing in MongoDB, and serving recommendations via a Python API.',
    ],
  },
  {
    id: 'neural-networks-b',
    title: 'Neural Networks and B',
    shortDescription: 'Explored neural network architectures and training techniques for classification and regression tasks.',
    tools: ['Python', 'PyTorch', 'TensorFlow', 'Jupyter'],
    overview: 'Explored neural network architectures and training techniques for classification and regression tasks. Implemented feedforward, CNN, and RNN models with experiments on standard datasets.',
    diagramType: null,
    semester: 'Semester 4',
    teamSize: 2,
    date: '2023',
    course: 'Deep Learning Fundamentals',
    details: [
      'Implemented and compared multiple architectures: MLP, CNN (for image data), and LSTM (for sequences).',
      'Focused on hyperparameter tuning, regularization, and visualization of learned representations.',
    ],
  },
  {
    id: 'reinforcement-learning',
    title: 'Reinforcement Learning',
    shortDescription: 'Implemented and compared RL algorithms including Q-learning, SARSA, DQN, and policy gradient methods.',
    tools: ['Python', 'OpenAI Gym', 'PyTorch'],
    overview: 'Implemented and compared reinforcement learning algorithms including Q-learning, SARSA, DQN, REINFORCE with baseline, and PPO on classic control and custom environments.',
    diagramType: null,
    semester: 'Semester 5',
    teamSize: 1,
    date: '2023',
    course: 'Reinforcement Learning',
    details: [
      'Topics covered: Q-learning, SARSA, DQN, REINFORCE with baseline, PPO.',
      'Benchmarked on CartPole, LunarLander, and a custom grid-world task.',
    ],
  },
  {
    id: 'so-fire-fitness',
    title: 'So Fire Fitness',
    shortDescription: 'AI-powered fitness and wellness platform with meal planning, workouts, fasting tracker, and rewards.',
    tools: ['React', 'TypeScript', 'Firebase', 'Tailwind CSS', 'Vite'],
    overview: 'Full-stack fitness app offering AI meal planning, workout calendar, fasting tracker, mental wellness, and a rewards system. Built with React, Firebase, and modern tooling.',
    diagramType: 'webapp',
    diagramLabel: {
      left: 'User',
      center: 'Web App',
      right: 'Firebase',
      flowRight: 'Actions',
      flowLeft: 'Data',
    },
    date: '2024',
    teamSize: 1,
    details: [
      'Features: AI chat coach, meal plans, workout calendar, fasting tracker, community events, progress stats, and rewards.',
      'Authentication and subscription management via Firebase and Stripe.',
    ],
    link: 'https://github.com',
    linkLabel: 'GitHub',
  },
];
