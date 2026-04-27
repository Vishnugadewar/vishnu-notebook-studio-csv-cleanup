export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote'
  description: string
  skills: string[]
  postedDate: string
  salary?: string
}

export const sampleJobs: Job[] = [
  {
    id: '1',
    title: 'Junior Data Analyst',
    company: 'HealthTech Analytics',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'We are looking for a Junior Data Analyst to join our healthcare analytics team. You will work with large datasets to identify trends and patterns in patient outcomes. The ideal candidate has experience with Python, SQL, and data visualization tools.',
    skills: ['Python', 'SQL', 'Pandas', 'Data Visualization', 'Excel'],
    postedDate: '2024-01-15',
    salary: '$65,000 - $85,000'
  },
  {
    id: '2',
    title: 'Data Visualization Engineer',
    company: 'MedData Solutions',
    location: 'Remote',
    type: 'Remote',
    description: 'Join our team as a Data Visualization Engineer to create interactive dashboards and reports for healthcare clients. You will transform complex medical data into clear, actionable insights using modern visualization libraries.',
    skills: ['D3.js', 'Chart.js', 'React', 'Python', 'Tableau'],
    postedDate: '2024-01-18',
    salary: '$90,000 - $120,000'
  },
  {
    id: '3',
    title: 'Healthcare Data Intern',
    company: 'CardioResearch Institute',
    location: 'Boston, MA',
    type: 'Internship',
    description: 'Summer internship opportunity for students interested in healthcare data science. Work alongside experienced researchers analyzing cardiovascular disease data. Great opportunity to gain hands-on experience with real medical datasets.',
    skills: ['Python', 'Statistics', 'R', 'Data Cleaning'],
    postedDate: '2024-01-20',
    salary: '$20/hour'
  },
  {
    id: '4',
    title: 'Senior Machine Learning Engineer',
    company: 'AI Health Innovations',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Lead the development of ML models for predicting heart disease outcomes. You will design, implement, and deploy production-grade machine learning systems. Experience with healthcare data and regulatory compliance is a plus.',
    skills: ['TensorFlow', 'PyTorch', 'Python', 'MLOps', 'AWS'],
    postedDate: '2024-01-10',
    salary: '$150,000 - $200,000'
  },
  {
    id: '5',
    title: 'Clinical Data Coordinator',
    company: 'University Medical Center',
    location: 'Chicago, IL',
    type: 'Part-time',
    description: 'Part-time position managing clinical trial data for cardiovascular studies. Responsibilities include data entry, quality control, and generating reports for research teams. Medical background preferred.',
    skills: ['REDCap', 'Excel', 'Data Entry', 'Medical Terminology'],
    postedDate: '2024-01-22',
    salary: '$25 - $35/hour'
  },
  {
    id: '6',
    title: 'Biostatistician',
    company: 'PharmaCorp Research',
    location: 'San Diego, CA',
    type: 'Contract',
    description: '6-month contract position for an experienced biostatistician to support clinical trials. You will design statistical analysis plans, perform analyses, and prepare reports for regulatory submissions.',
    skills: ['SAS', 'R', 'Clinical Trials', 'Biostatistics', 'FDA Guidelines'],
    postedDate: '2024-01-08',
    salary: '$85/hour'
  }
]

export const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'] as const
