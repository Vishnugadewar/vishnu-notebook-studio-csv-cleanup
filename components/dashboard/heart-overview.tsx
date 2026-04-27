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
import { Bar, Doughnut } from 'react-chartjs-2'
import { heartFailureData, getStatistics } from '@/lib/heart-failure-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Users, Activity, AlertTriangle } from 'lucide-react'

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

export function HeartOverview() {
  const stats = useMemo(() => getStatistics(), [])

  const outcomeData = {
    labels: ['Survived', 'Deceased'],
    datasets: [
      {
        data: [stats.survived, stats.deceased],
        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)'],
        borderWidth: 2,
      },
    ],
  }

  const ageGroupData = useMemo(() => {
    const groups = { '40-49': { total: 0, deaths: 0 }, '50-59': { total: 0, deaths: 0 }, '60-69': { total: 0, deaths: 0 }, '70-79': { total: 0, deaths: 0 }, '80+': { total: 0, deaths: 0 } }
    heartFailureData.forEach((p) => {
      const key = p.age < 50 ? '40-49' : p.age < 60 ? '50-59' : p.age < 70 ? '60-69' : p.age < 80 ? '70-79' : '80+'
      groups[key as keyof typeof groups].total++
      if (p.DEATH_EVENT) groups[key as keyof typeof groups].deaths++
    })
    return {
      labels: Object.keys(groups),
      datasets: [
        {
          label: 'Survival Rate %',
          data: Object.values(groups).map((g) => g.total > 0 ? ((g.total - g.deaths) / g.total * 100).toFixed(1) : 0),
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 2,
        },
      ],
    }
  }, [])

  const conditionStats = useMemo(() => {
    const conditions = [
      { name: 'Anaemia', key: 'anaemia' as const },
      { name: 'Diabetes', key: 'diabetes' as const },
      { name: 'High BP', key: 'high_blood_pressure' as const },
      { name: 'Smoking', key: 'smoking' as const },
    ]
    return conditions.map((c) => {
      const withCondition = heartFailureData.filter((p) => p[c.key] === 1)
      const deaths = withCondition.filter((p) => p.DEATH_EVENT === 1).length
      return {
        name: c.name,
        count: withCondition.length,
        mortality: withCondition.length > 0 ? ((deaths / withCondition.length) * 100).toFixed(1) : '0',
      }
    })
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Heart className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Heart Failure Overview</h1>
          <p className="text-muted-foreground">Key metrics and patient outcome summary</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold">{stats.totalPatients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mortality Rate</p>
                <p className="text-2xl font-bold">{stats.mortalityRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-chart-2/10">
                <Activity className="h-6 w-6 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Age</p>
                <p className="text-2xl font-bold">{stats.averageAge} yrs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-chart-3/10">
                <Heart className="h-6 w-6 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Ejection Fraction</p>
                <p className="text-2xl font-bold">{stats.avgEjectionFraction}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={outcomeData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Survival Rate by Age Group</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={ageGroupData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Condition Prevalence & Mortality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {conditionStats.map((stat) => (
              <div key={stat.name} className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="text-xl font-bold">{stat.count} patients</p>
                <p className="text-sm text-destructive">{stat.mortality}% mortality</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
