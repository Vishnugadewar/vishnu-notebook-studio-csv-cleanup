'use client'

import { useState, useMemo } from 'react'
import { Job, sampleJobs, jobTypes } from '@/lib/job-data'
import { JobCard } from './job-card'
import { JobForm } from './job-form'
import { JobDetailModal } from './job-detail-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Plus, Briefcase, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function JobBoard() {
  const [jobs, setJobs] = useState<Job[]>(sampleJobs)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('All')
  const [showForm, setShowForm] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = typeFilter === 'All' || job.type === typeFilter

      return matchesSearch && matchesType
    })
  }, [jobs, searchQuery, typeFilter])

  const handleAddJob = (newJob: Omit<Job, 'id' | 'postedDate'>) => {
    const job: Job = {
      ...newJob,
      id: Date.now().toString(),
      postedDate: new Date().toISOString().split('T')[0],
    }
    setJobs([job, ...jobs])
    setShowForm(false)
  }

  const jobTypeCounts = useMemo(() => {
    const counts: Record<string, number> = { All: jobs.length }
    jobs.forEach((job) => {
      counts[job.type] = (counts[job.type] || 0) + 1
    })
    return counts
  }, [jobs])

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Job Board</h1>
          </div>
          <p className="text-muted-foreground">
            Explore data science and healthcare analytics opportunities
          </p>
        </div>

        {/* Demo Notice */}
        <div className="mb-6 p-4 rounded-lg bg-warning/10 border border-warning/30 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-warning-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-warning-foreground">Demo / Sample Data</p>
            <p className="text-sm text-muted-foreground">
              This is a demonstration job board with sample listings. Job applications are not functional.
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {jobTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type} {jobTypeCounts[type] ? `(${jobTypeCounts[type]})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Post Job
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-2xl font-bold text-foreground">{jobs.length}</p>
            <p className="text-sm text-muted-foreground">Total Jobs</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-2xl font-bold text-foreground">
              {jobs.filter((j) => j.type === 'Full-time').length}
            </p>
            <p className="text-sm text-muted-foreground">Full-time</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-2xl font-bold text-foreground">
              {jobs.filter((j) => j.type === 'Remote').length}
            </p>
            <p className="text-sm text-muted-foreground">Remote</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-2xl font-bold text-foreground">
              {jobs.filter((j) => j.type === 'Internship').length}
            </p>
            <p className="text-sm text-muted-foreground">Internships</p>
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">No jobs found</p>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => setSelectedJob(job)}
              />
            ))
          )}
        </div>

        {/* Job Form Modal */}
        {showForm && (
          <JobForm onSubmit={handleAddJob} onClose={() => setShowForm(false)} />
        )}

        {/* Job Detail Modal */}
        {selectedJob && (
          <JobDetailModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </div>
    </div>
  )
}
