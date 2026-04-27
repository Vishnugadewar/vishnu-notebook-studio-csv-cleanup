'use client'

import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar, Doughnut, Pie } from 'react-chartjs-2'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { sampleJobs } from '@/lib/job-data'
import {
  Briefcase,
  MapPin,
  TrendingUp,
  DollarSign,
  Building2,
  Clock,
  AlertTriangle,
  BarChart3,
  PieChart,
  Users,
} from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

export function JobsDashboard() {
  // Calculate statistics
  const stats = useMemo(() => {
    const jobs = sampleJobs

    // Job type distribution
    const typeDistribution: Record<string, number> = {}
    jobs.forEach((job) => {
      typeDistribution[job.type] = (typeDistribution[job.type] || 0) + 1
    })

    // Location distribution
    const locationDistribution: Record<string, number> = {}
    jobs.forEach((job) => {
      locationDistribution[job.location] = (locationDistribution[job.location] || 0) + 1
    })

    // Skills frequency
    const skillsFrequency: Record<string, number> = {}
    jobs.forEach((job) => {
      job.skills.forEach((skill) => {
        skillsFrequency[skill] = (skillsFrequency[skill] || 0) + 1
      })
    })

    // Sort skills by frequency
    const topSkills = Object.entries(skillsFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    // Parse salary ranges
    const salaryData = jobs
      .filter((job) => job.salary)
      .map((job) => {
        const salary = job.salary!
        // Extract numbers from salary string
        const numbers = salary.match(/[\d,]+/g)
        if (numbers && numbers.length > 0) {
          const firstNum = parseInt(numbers[0].replace(/,/g, ''))
          const lastNum = numbers.length > 1 ? parseInt(numbers[numbers.length - 1].replace(/,/g, '')) : firstNum
          // Check if it's hourly
          const isHourly = salary.toLowerCase().includes('hour')
          return {
            job: job.title,
            min: isHourly ? firstNum * 2080 : firstNum, // Convert hourly to annual
            max: isHourly ? lastNum * 2080 : lastNum,
            isHourly,
            original: salary,
          }
        }
        return null
      })
      .filter(Boolean)

    // Remote vs On-site
    const remoteCount = jobs.filter((job) => job.location.toLowerCase() === 'remote').length
    const onSiteCount = jobs.length - remoteCount

    return {
      totalJobs: jobs.length,
      typeDistribution,
      locationDistribution,
      topSkills,
      salaryData,
      remoteCount,
      onSiteCount,
      avgSkillsPerJob: (jobs.reduce((acc, job) => acc + job.skills.length, 0) / jobs.length).toFixed(1),
    }
  }, [])

  const chartColors = {
    primary: 'rgba(124, 58, 237, 0.8)',
    primaryLight: 'rgba(124, 58, 237, 0.2)',
    secondary: 'rgba(34, 197, 94, 0.8)',
    tertiary: 'rgba(59, 130, 246, 0.8)',
    quaternary: 'rgba(249, 115, 22, 0.8)',
    quinary: 'rgba(236, 72, 153, 0.8)',
    palette: [
      'rgba(124, 58, 237, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(59, 130, 246, 0.8)',
      'rgba(249, 115, 22, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(14, 165, 233, 0.8)',
    ],
  }

  // Chart data
  const typeChartData = {
    labels: Object.keys(stats.typeDistribution),
    datasets: [
      {
        data: Object.values(stats.typeDistribution),
        backgroundColor: chartColors.palette,
        borderColor: chartColors.palette.map((c) => c.replace('0.8', '1')),
        borderWidth: 2,
      },
    ],
  }

  const locationChartData = {
    labels: Object.keys(stats.locationDistribution),
    datasets: [
      {
        label: 'Jobs by Location',
        data: Object.values(stats.locationDistribution),
        backgroundColor: chartColors.primary,
        borderColor: chartColors.primary.replace('0.8', '1'),
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  }

  const skillsChartData = {
    labels: stats.topSkills.map(([skill]) => skill),
    datasets: [
      {
        label: 'Skill Demand',
        data: stats.topSkills.map(([, count]) => count),
        backgroundColor: chartColors.palette.slice(0, stats.topSkills.length),
        borderColor: chartColors.palette.slice(0, stats.topSkills.length).map((c) => c.replace('0.8', '1')),
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  }

  const remoteChartData = {
    labels: ['Remote', 'On-site'],
    datasets: [
      {
        data: [stats.remoteCount, stats.onSiteCount],
        backgroundColor: [chartColors.secondary, chartColors.tertiary],
        borderColor: [chartColors.secondary.replace('0.8', '1'), chartColors.tertiary.replace('0.8', '1')],
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  }

  const barChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Jobs Dashboard</h1>
            <Badge variant="outline" className="bg-warning/20 text-warning-foreground border-warning/30">
              Demo Analytics
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Analytics and insights from the demo job listings
          </p>
        </div>

        {/* Warning Banner */}
        <div className="mb-6 p-4 rounded-lg bg-warning/10 border border-warning/30 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-warning-foreground">Sample Data Analytics</p>
            <p className="text-sm text-muted-foreground">
              This dashboard displays analytics from fictional job listings. All data is for demonstration purposes only.
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Jobs</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalJobs}</p>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Remote Jobs</p>
                  <p className="text-3xl font-bold text-foreground">{stats.remoteCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((stats.remoteCount / stats.totalJobs) * 100).toFixed(0)}% of total
                  </p>
                </div>
                <div className="p-3 rounded-full bg-success/10">
                  <MapPin className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unique Locations</p>
                  <p className="text-3xl font-bold text-foreground">
                    {Object.keys(stats.locationDistribution).length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-500/10">
                  <Building2 className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Skills/Job</p>
                  <p className="text-3xl font-bold text-foreground">{stats.avgSkillsPerJob}</p>
                </div>
                <div className="p-3 rounded-full bg-orange-500/10">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview" className="gap-2">
              <PieChart className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="skills" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="salary" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Salary
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Jobs by Type
                  </CardTitle>
                  <CardDescription>Distribution of job types in the demo listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Doughnut data={typeChartData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Remote vs On-site
                  </CardTitle>
                  <CardDescription>Work location preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Pie data={remoteChartData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Jobs by Location
                </CardTitle>
                <CardDescription>Geographic distribution of job listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Bar data={locationChartData} options={barChartOptions} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Top In-Demand Skills
                </CardTitle>
                <CardDescription>Most frequently requested skills across all job listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar data={skillsChartData} options={barChartOptions} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills Breakdown</CardTitle>
                <CardDescription>Detailed view of skill requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {stats.topSkills.map(([skill, count], index) => (
                    <div
                      key={skill}
                      className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <p className="font-medium text-sm text-foreground truncate">{skill}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(count / stats.topSkills[0][1]) * 100}%`,
                            backgroundColor: chartColors.palette[index % chartColors.palette.length],
                          }}
                        />
                        <span className="text-xs text-muted-foreground">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="salary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Salary Ranges
                </CardTitle>
                <CardDescription>Compensation data from job listings (demo data)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.salaryData.map((data, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-foreground">{data?.job}</p>
                        <Badge variant="outline">{data?.original}</Badge>
                      </div>
                      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="absolute h-full rounded-full"
                          style={{
                            left: `${((data?.min || 0) / 250000) * 100}%`,
                            width: `${(((data?.max || 0) - (data?.min || 0)) / 250000) * 100}%`,
                            backgroundColor: chartColors.palette[index % chartColors.palette.length],
                            minWidth: '20px',
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>${((data?.min || 0) / 1000).toFixed(0)}k</span>
                        <span>${((data?.max || 0) / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Salary Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Highest Salary</span>
                    <span className="font-medium text-foreground">$120,000/yr</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Average Range</span>
                    <span className="font-medium text-foreground">$65k - $95k</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Hourly Positions</span>
                    <span className="font-medium text-foreground">$20 - $75/hr</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Market Trends</CardTitle>
                  <CardDescription>Demo insights based on sample data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
                    <TrendingUp className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">High Demand for Python</p>
                      <p className="text-xs text-muted-foreground">Most requested skill across listings</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Remote Work Growing</p>
                      <p className="text-xs text-muted-foreground">
                        {((stats.remoteCount / stats.totalJobs) * 100).toFixed(0)}% of jobs offer remote
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
