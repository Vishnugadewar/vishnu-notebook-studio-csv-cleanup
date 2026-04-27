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
  PointElement,
  LineElement,
  Filler,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { heartFailureData } from '@/lib/heart-failure-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Clock, TrendingDown, Calendar } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler)

export function HeartSurvival() {
  const followUpDistribution = useMemo(() => {
    const bins: Record<string, { survived: number; deceased: number }> = {
      '0-50': { survived: 0, deceased: 0 },
      '51-100': { survived: 0, deceased: 0 },
      '101-150': { survived: 0, deceased: 0 },
      '151-200': { survived: 0, deceased: 0 },
      '201-250': { survived: 0, deceased: 0 },
      '250+': { survived: 0, deceased: 0 },
    }
    heartFailureData.forEach((p) => {
      const key = p.time <= 50 ? '0-50' : p.time <= 100 ? '51-100' : p.time <= 150 ? '101-150' : p.time <= 200 ? '151-200' : p.time <= 250 ? '201-250' : '250+'
      if (p.DEATH_EVENT === 1) bins[key].deceased++
      else bins[key].survived++
    })
    return {
      labels: Object.keys(bins),
      datasets: [
        { label: 'Survived', data: Object.values(bins).map((b) => b.survived), backgroundColor: 'rgba(34, 197, 94, 0.8)', borderColor: 'rgb(34, 197, 94)', borderWidth: 2 },
        { label: 'Deceased', data: Object.values(bins).map((b) => b.deceased), backgroundColor: 'rgba(239, 68, 68, 0.8)', borderColor: 'rgb(239, 68, 68)', borderWidth: 2 },
      ],
    }
  }, [])

  const survivalCurve = useMemo(() => {
    const sorted = [...heartFailureData].sort((a, b) => a.time - b.time)
    const timePoints = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270]
    const survivalRates = timePoints.map((t) => {
      const atRisk = sorted.filter((p) => p.time >= t).length
      const total = sorted.length
      return ((atRisk / total) * 100).toFixed(1)
    })
    return {
      labels: timePoints.map((t) => `${t} days`),
      datasets: [{
        label: 'Survival Rate %',
        data: survivalRates,
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgb(99, 102, 241)',
        tension: 0.3,
      }],
    }
  }, [])

  const timeStats = useMemo(() => {
    const times = heartFailureData.map((p) => p.time)
    const deathTimes = heartFailureData.filter((p) => p.DEATH_EVENT === 1).map((p) => p.time)
    const survivalTimes = heartFailureData.filter((p) => p.DEATH_EVENT === 0).map((p) => p.time)
    return {
      avgFollowUp: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
      medianFollowUp: times.sort((a, b) => a - b)[Math.floor(times.length / 2)],
      avgTimeToEvent: deathTimes.length > 0 ? Math.round(deathTimes.reduce((a, b) => a + b, 0) / deathTimes.length) : 0,
      avgSurvivalTime: survivalTimes.length > 0 ? Math.round(survivalTimes.reduce((a, b) => a + b, 0) / survivalTimes.length) : 0,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
    }
  }, [])

  const earlyMortality = useMemo(() => {
    const early = heartFailureData.filter((p) => p.time <= 30 && p.DEATH_EVENT === 1)
    const mid = heartFailureData.filter((p) => p.time > 30 && p.time <= 90 && p.DEATH_EVENT === 1)
    const late = heartFailureData.filter((p) => p.time > 90 && p.DEATH_EVENT === 1)
    return [
      { period: '0-30 days', deaths: early.length, pct: ((early.length / heartFailureData.filter((p) => p.DEATH_EVENT === 1).length) * 100).toFixed(1) },
      { period: '31-90 days', deaths: mid.length, pct: ((mid.length / heartFailureData.filter((p) => p.DEATH_EVENT === 1).length) * 100).toFixed(1) },
      { period: '90+ days', deaths: late.length, pct: ((late.length / heartFailureData.filter((p) => p.DEATH_EVENT === 1).length) * 100).toFixed(1) },
    ]
  }, [])

  const survivalByAge = useMemo(() => {
    const groups: Record<string, { total: number; avgTime: number }> = {
      '40-54': { total: 0, avgTime: 0 },
      '55-64': { total: 0, avgTime: 0 },
      '65-74': { total: 0, avgTime: 0 },
      '75+': { total: 0, avgTime: 0 },
    }
    heartFailureData.forEach((p) => {
      const key = p.age < 55 ? '40-54' : p.age < 65 ? '55-64' : p.age < 75 ? '65-74' : '75+'
      groups[key].avgTime += p.time
      groups[key].total++
    })
    return {
      labels: Object.keys(groups),
      datasets: [{
        label: 'Avg Follow-up (days)',
        data: Object.values(groups).map((g) => g.total > 0 ? Math.round(g.avgTime / g.total) : 0),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      }],
    }
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Clock className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Survival Analysis</h1>
          <p className="text-muted-foreground">Time-based outcome analysis and follow-up patterns</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Follow-up</p>
                <p className="text-xl font-bold">{timeStats.avgFollowUp} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Median Follow-up</p>
                <p className="text-xl font-bold">{timeStats.medianFollowUp} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingDown className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Time to Death</p>
                <p className="text-xl font-bold">{timeStats.avgTimeToEvent} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Follow-up Range</p>
                <p className="text-xl font-bold">{timeStats.minTime}-{timeStats.maxTime} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kaplan-Meier Survival Estimate</CardTitle>
            <CardDescription>Survival probability over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <Line data={survivalCurve} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Follow-up Time Distribution</CardTitle>
            <CardDescription>Patient outcomes by follow-up period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <Bar data={followUpDistribution} options={{ maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mortality Timeline</CardTitle>
            <CardDescription>When do deaths occur?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {earlyMortality.map((period) => (
                <div key={period.period} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{period.period}</span>
                      <span className="text-sm text-muted-foreground">{period.deaths} deaths ({period.pct}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive rounded-full" style={{ width: `${period.pct}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Follow-up by Age Group</CardTitle>
            <CardDescription>Days of observation per age cohort</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <Bar data={survivalByAge} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
