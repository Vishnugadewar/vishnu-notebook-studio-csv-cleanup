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
} from 'chart.js'
import { Bar, Pie, Doughnut } from 'react-chartjs-2'
import { heartFailureData } from '@/lib/heart-failure-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Users, UserCircle, Calendar } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

export function HeartDemographics() {
  const genderData = useMemo(() => {
    const male = heartFailureData.filter((p) => p.sex === 1)
    const female = heartFailureData.filter((p) => p.sex === 0)
    return {
      labels: ['Male', 'Female'],
      datasets: [{
        data: [male.length, female.length],
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(236, 72, 153, 0.8)'],
        borderColor: ['rgb(59, 130, 246)', 'rgb(236, 72, 153)'],
        borderWidth: 2,
      }],
    }
  }, [])

  const genderMortality = useMemo(() => {
    const male = heartFailureData.filter((p) => p.sex === 1)
    const female = heartFailureData.filter((p) => p.sex === 0)
    const maleDeath = male.filter((p) => p.DEATH_EVENT === 1).length
    const femaleDeath = female.filter((p) => p.DEATH_EVENT === 1).length
    return {
      labels: ['Male', 'Female'],
      datasets: [
        {
          label: 'Survived',
          data: [male.length - maleDeath, female.length - femaleDeath],
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
        },
        {
          label: 'Deceased',
          data: [maleDeath, femaleDeath],
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
        },
      ],
    }
  }, [])

  const ageDistribution = useMemo(() => {
    const bins = Array(6).fill(0)
    heartFailureData.forEach((p) => {
      const idx = Math.min(Math.floor((p.age - 40) / 10), 5)
      if (idx >= 0) bins[idx]++
    })
    return {
      labels: ['40-49', '50-59', '60-69', '70-79', '80-89', '90+'],
      datasets: [{
        label: 'Patients',
        data: bins,
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 2,
      }],
    }
  }, [])

  const ageStats = useMemo(() => {
    const ages = heartFailureData.map((p) => p.age)
    return {
      min: Math.min(...ages),
      max: Math.max(...ages),
      avg: (ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(1),
      median: ages.sort((a, b) => a - b)[Math.floor(ages.length / 2)],
    }
  }, [])

  const ageGroupTable = useMemo(() => {
    const groups: Record<string, { total: number; male: number; female: number; deaths: number }> = {
      '40-49': { total: 0, male: 0, female: 0, deaths: 0 },
      '50-59': { total: 0, male: 0, female: 0, deaths: 0 },
      '60-69': { total: 0, male: 0, female: 0, deaths: 0 },
      '70-79': { total: 0, male: 0, female: 0, deaths: 0 },
      '80+': { total: 0, male: 0, female: 0, deaths: 0 },
    }
    heartFailureData.forEach((p) => {
      const key = p.age < 50 ? '40-49' : p.age < 60 ? '50-59' : p.age < 70 ? '60-69' : p.age < 80 ? '70-79' : '80+'
      groups[key].total++
      if (p.sex === 1) groups[key].male++
      else groups[key].female++
      if (p.DEATH_EVENT) groups[key].deaths++
    })
    return Object.entries(groups).map(([age, data]) => ({
      age,
      ...data,
      survivalRate: data.total > 0 ? (((data.total - data.deaths) / data.total) * 100).toFixed(1) : '0',
    }))
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Demographics Analysis</h1>
          <p className="text-muted-foreground">Patient population characteristics and distribution</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Age Range</p>
                <p className="text-xl font-bold">{ageStats.min} - {ageStats.max}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Average Age</p>
                <p className="text-xl font-bold">{ageStats.avg} years</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Median Age</p>
                <p className="text-xl font-bold">{ageStats.median} years</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <UserCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Male/Female Ratio</p>
                <p className="text-xl font-bold">{(heartFailureData.filter(p => p.sex === 1).length / heartFailureData.filter(p => p.sex === 0).length).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>Patient breakdown by sex</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <Pie data={genderData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gender vs Outcome</CardTitle>
            <CardDescription>Mortality by gender</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={genderMortality} options={{ maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
            <CardDescription>Patient count by age group</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={ageDistribution} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Age Group Analysis</CardTitle>
          <CardDescription>Detailed breakdown by age cohort</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Age Group</th>
                  <th className="text-center py-3 px-4">Total</th>
                  <th className="text-center py-3 px-4">Male</th>
                  <th className="text-center py-3 px-4">Female</th>
                  <th className="text-center py-3 px-4">Deaths</th>
                  <th className="text-center py-3 px-4">Survival Rate</th>
                </tr>
              </thead>
              <tbody>
                {ageGroupTable.map((row) => (
                  <tr key={row.age} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{row.age}</td>
                    <td className="text-center py-3 px-4">{row.total}</td>
                    <td className="text-center py-3 px-4 text-blue-500">{row.male}</td>
                    <td className="text-center py-3 px-4 text-pink-500">{row.female}</td>
                    <td className="text-center py-3 px-4 text-destructive">{row.deaths}</td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${parseFloat(row.survivalRate) >= 70 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : parseFloat(row.survivalRate) >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                        {row.survivalRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
