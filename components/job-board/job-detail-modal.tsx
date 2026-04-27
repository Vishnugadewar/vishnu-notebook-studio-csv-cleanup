'use client'

import { Job } from '@/lib/job-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  Briefcase,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface JobDetailModalProps {
  job: Job
  onClose: () => void
}

const typeColors: Record<Job['type'], string> = {
  'Full-time': 'bg-primary/10 text-primary border-primary/20',
  'Part-time': 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  'Contract': 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  'Internship': 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  'Remote': 'bg-success/10 text-success border-success/20',
}

export function JobDetailModal({ job, onClose }: JobDetailModalProps) {
  const formattedDate = new Date(job.postedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl mb-2">{job.title}</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(typeColors[job.type])}
                >
                  {job.type}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Company Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Company</p>
                <p className="font-medium text-foreground">{job.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium text-foreground">{job.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Posted</p>
                <p className="font-medium text-foreground">{formattedDate}</p>
              </div>
            </div>
            {job.salary && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Salary</p>
                  <p className="font-medium text-foreground">{job.salary}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Job Description
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-3 py-1"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Demo Notice */}
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/30 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-warning-foreground">
                Demo Listing
              </p>
              <p className="text-sm text-muted-foreground">
                This is a sample job posting for demonstration purposes. The
                apply button is not functional.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button disabled className="cursor-not-allowed opacity-60">
              Apply Now (Demo)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
