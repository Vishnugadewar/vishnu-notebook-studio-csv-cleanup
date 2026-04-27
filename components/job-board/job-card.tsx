'use client'

import { Job } from '@/lib/job-data'
import { Badge } from '@/components/ui/badge'
import { MapPin, Building2, Clock, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface JobCardProps {
  job: Job
  onClick: () => void
}

const typeColors: Record<Job['type'], string> = {
  'Full-time': 'bg-primary/10 text-primary border-primary/20',
  'Part-time': 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  'Contract': 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  'Internship': 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  'Remote': 'bg-success/10 text-success border-success/20',
}

export function JobCard({ job, onClick }: JobCardProps) {
  const formattedDate = new Date(job.postedDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-5 rounded-lg bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
              {job.title}
            </h3>
            <Badge
              variant="outline"
              className={cn('flex-shrink-0', typeColors[job.type])}
            >
              {job.type}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              {job.company}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {job.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 4).map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="text-xs font-normal"
              >
                {skill}
              </Badge>
            ))}
            {job.skills.length > 4 && (
              <Badge variant="secondary" className="text-xs font-normal">
                +{job.skills.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {job.salary && (
          <div className="sm:text-right flex-shrink-0">
            <p className="font-medium text-foreground">{job.salary}</p>
          </div>
        )}
      </div>
    </button>
  )
}
