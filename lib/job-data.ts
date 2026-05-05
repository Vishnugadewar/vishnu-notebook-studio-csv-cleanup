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
    company: 'CardioInsights Analytics (Demo)',
    location: 'Remote',
    type: 'Full-time',
    description: 'We are looking for a Junior Data Analyst to join our healthcare analytics team. You will work with large datasets to identify trends and patterns in patient outcomes. The ideal candidate has experience with Python, SQL, and data visualization tools.',
    skills: ['Python', 'SQL', 'Pandas', 'Data Visualization', 'Excel'],
    postedDate: '2024-01-15',
    salary: '$65,000 - $85,000'
  },
  {
    id: '2',
    title: 'Data Visualization Engineer',
    company: 'InsightDash Labs (Sample)',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Join our team as a Data Visualization Engineer to create interactive dashboards and reports for healthcare clients. You will transform complex medical data into clear, actionable insights using modern visualization libraries.',
    skills: ['D3.js', 'Chart.js', 'React', 'Python', 'Tableau'],
    postedDate: '2024-01-18',
    salary: '$90,000 - $120,000'
  },
  {
    id: '3',
    title: 'Healthcare Data Intern',
    company: 'MedTech AI (Demo)',
    location: 'Boston, MA',
    type: 'Internship',
    description: 'Summer internship opportunity for students interested in healthcare data science. Work alongside experienced researchers analyzing cardiovascular disease data. Great opportunity to gain hands-on experience with real medical datasets.',
    skills: ['Python', 'Statistics', 'R', 'Data Cleaning'],
    postedDate: '2024-01-20',
    salary: '$20/hour'
  },
  {
    id: '4',
    title: 'Business Intelligence Analyst',
    company: 'DataBridge Corp (Sample)',
    location: 'Chicago, IL',
    type: 'Full-time',
    description: 'Lead the development of BI dashboards and reports for enterprise clients. You will design, implement, and maintain business intelligence solutions. Experience with healthcare data and analytics platforms is a plus.',
    skills: ['Power BI', 'Tableau', 'SQL', 'Python', 'Data Modeling'],
    postedDate: '2024-01-10',
    salary: '$85,000 - $110,000'
  },
  {
    id: '5',
    title: 'Frontend Developer (Dashboard UI)',
    company: 'PixelMetrics (Demo)',
    location: 'Remote',
    type: 'Contract',
    description: 'Contract position building modern dashboard interfaces for data visualization products. You will work closely with designers and data engineers to create intuitive, responsive UIs for analytics platforms.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Chart.js', 'Next.js'],
    postedDate: '2024-01-22',
    salary: '$75/hour'
  },
  {
    id: '6',
    title: 'Clinical Data Coordinator',
    company: 'University Medical Center (Sample)',
    location: 'Boston, MA',
    type: 'Part-time',
    description: 'Part-time position managing clinical trial data for cardiovascular studies. Responsibilities include data entry, quality control, and generating reports for research teams. Medical background preferred.',
    skills: ['REDCap', 'Excel', 'Data Entry', 'Medical Terminology'],
    postedDate: '2024-01-08',
    salary: '$25 - $35/hour'
  }
]

export const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'] as const

export const jobLocations = ['All', 'Remote', 'New York, NY', 'Boston, MA', 'Chicago, IL', 'San Francisco, CA'] as const
