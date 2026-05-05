'use client'

import { useState } from 'react'
import { Job } from '@/lib/job-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'

interface JobFormProps {
  onSubmit: (job: Omit<Job, 'id' | 'postedDate'>) => void
  onClose: () => void
}

const jobTypeOptions: Job['type'][] = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Remote',
]

export function JobForm({ onSubmit, onClose }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time' as Job['type'],
    description: '',
    skills: '',
    salary: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.company || !formData.location || !formData.description) {
      return
    }

    onSubmit({
      title: formData.title,
      company: formData.company,
      location: formData.location,
      type: formData.type,
      description: formData.description,
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      salary: formData.salary || undefined,
    })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a New Job</DialogTitle>
          <DialogDescription>
            Add a demo job listing to the board. This is for demonstration purposes only.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Data Analyst"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                placeholder="e.g., HealthTech Inc"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, CA"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Job Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: Job['type']) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {jobTypeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary (optional)</Label>
              <Input
                id="salary"
                placeholder="e.g., $80,000 - $100,000"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, and requirements..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              placeholder="e.g., Python, SQL, Data Visualization"
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Post Job</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
