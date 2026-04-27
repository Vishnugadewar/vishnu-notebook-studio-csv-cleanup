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
  RadialLinearScale,
} from 'chart.js'
import { Bar, Doughnut, PolarArea } from 'react-chartjs-2'
import { heartFailureData } from '@/lib/heart-failure-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AlertTriangle, Shield, TrendingUp } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale)

export function HeartRisk() {
  const comorbidityImpact = useMemo(() => {
    const conditions = [
      { name: 'Anaemia', key: 'anaemia' as const },
      { name: 'Diabetes', key: 'diabetes' as const },
      { name: 'High BP', key: 'high_blood_pressure' as const },
      { name: 'Smoking', key: 'smoking' as const },
    ]
    return conditions.map((c) => {
      const with_ = heartFailureData.filter((p) => p[c.key] === 1)
      const without = heartFailureData.filter((p) => p[c.key] === 0)
      const withMort = with_.length > 0 ? (with_.filter((p) => p.DEATH_EVENT === 1).length / with_.length) * 100 : 0
      const withoutMort = without.length > 0 ? (without.filter((p) => p.DEATH_EVENT === 1).length / without.length) * 100 : 0
      return { name: c.name, withCondition: withMort.toFixed(1), withoutCondition: withoutMort.toFixed(1), diff: (withMort - withoutMort).toFixed(1) }
    })
  }, [])

  const comorbidityChart = {
    labels: comorbidityImpact.map((c) => c.name),
    datasets: [
      { label: 'With Condition', data: comorbidityImpact.map((c) => parseFloat(c.withCondition)), backgroundColor: 'rgba(239, 68, 68, 0.8)' },
      { label: 'Without Condition', data: comorbidityImpact.map((c) => parseFloat(c.withoutCondition)), backgroundColor: 'rgba(34, 197, 94, 0.8)' },
    ],
  }

  const riskScoreDistribution = useMemo(() => {
    const scores = { low: 0, moderate: 0, high: 0, critical: 0 }
    heartFailureData.forEach((p) => {
      let score = 0
      if (p.age > 65) score++
      if (p.ejection_fraction < 30) score += 2
      if (p.serum_creatinine > 2) score += 2
      if (p.serum_sodium < 135) score++
      if (p.anaemia === 1) score++
      if (p.diabetes === 1) score++
      if (p.high_blood_pressure === 1) score++
      if (score <= 2) scores.low++
      else if (score <= 4) scores.moderate++
      else if (score <= 6) scores.high++
      else scores.critical++
    })
    return {
      labels: ['Low Risk', 'Moderate', 'High', 'Critical'],
      datasets: [{
        data: [scores.low, scores.moderate, scores.high, scores.critical],
        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(234, 179, 8, 0.8)', 'rgba(249, 115, 22, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderWidth: 2,
      }],
    }
  }, [])

  const multipleConditions = useMemo(() => {
    const counts = { 0: { total: 0, deaths: 0 }, 1: { total: 0, deaths: 0 }, 2: { total: 0, deaths: 0 }, 3: { total: 0, deaths: 0 }, 4: { total: 0, deaths: 0 } }
    heartFailureData.forEach((p) => {
      const cond = p.anaemia + p.diabetes + p.high_blood_pressure + p.smoking
      counts[cond as keyof typeof counts].total++
      if (p.DEATH_EVENT) counts[cond as keyof typeof counts].deaths++
    })
    return {
      labels: ['0 conditions', '1 condition', '2 conditions', '3 conditions', '4 conditions'],
      datasets: [{
        label: 'Mortality Rate %',
        data: Object.values(counts).map((c) => c.total > 0 ? ((c.deaths / c.total) * 100).toFixed(1) : 0),
        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(234, 179, 8, 0.8)', 'rgba(249, 115, 22, 0.8)', 'rgba(239, 68, 68, 0.8)'],
      }],
    }
  }, [])

  const riskFactorTable = useMemo(() => {
    return [
      { factor: 'Age > 65', present: heartFailureData.filter((p) => p.age > 65).length, mortality: (heartFailureData.filter((p) => p.age > 65 && p.DEATH_EVENT === 1).length / heartFailureData.filter((p) => p.age > 65).length * 100).toFixed(1) },
      { factor: 'EF < 30%', present: heartFailureData.filter((p) => p.ejection_fraction < 30).length, mortality: (heartFailureData.filter((p) => p.ejection_fraction < 30 && p.DEATH_EVENT === 1).length / heartFailureData.filter((p) => p.ejection_fraction < 30).length * 100).toFixed(1) },
      { factor: 'Creatinine > 2', present: heartFailureData.filter((p) => p.serum_creatinine > 2).length, mortality: (heartFailureData.filter((p) => p.serum_creatinine > 2 && p.DEATH_EVENT === 1).length / Math.max(heartFailureData.filter((p) => p.serum_creatinine > 2).length, 1) * 100).toFixed(1) },
      { factor: 'Sodium < 135', present: heartFailureData.filter((p) => p.serum_sodium < 135).length, mortality: (heartFailureData.filter((p) => p.serum_sodium < 135 && p.DEATH_EVENT === 1).length / Math.max(heartFailureData.filter((p) => p.serum_sodium < 135).length, 1) * 100).toFixed(1) },
      { factor: 'Anaemia', present: heartFailureData.filter((p) => p.anaemia === 1).length, mortality: (heartFailureData.filter((p) => p.anaemia === 1 && p.DEATH_EVENT === 1).length / heartFailureData.filter((p) => p.anaemia === 1).length * 100).toFixed(1) },
      { factor: 'Diabetes', present: heartFailureData.filter((p) => p.diabetes === 1).length, mortality: (heartFailureData.filter((p) => p.diabetes === 1 && p.DEATH_EVENT === 1).length / heartFailureData.filter((p) => p.diabetes === 1).length * 100).toFixed(1) },
    ]
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Risk Analysis</h1>
          <p className="text-muted-foreground">Comorbidity impact and risk stratification</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Comorbidity Impact on Mortality</CardTitle>
            <CardDescription>Mortality rate comparison with/without conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <Bar data={comorbidityChart} options={{ maintainAspectRatio: false, indexAxis: 'y' }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Risk Score Distribution</CardTitle>
            <CardDescription>Patients categorized by composite risk score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-center justify-center">
              <Doughnut data={riskScoreDistribution} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Multiple Conditions Impact</CardTitle>
          <CardDescription>Mortality rate by number of comorbidities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Bar data={multipleConditions} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk Factor Summary</CardTitle>
          <CardDescription>Individual risk factor prevalence and mortality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Risk Factor</th>
                  <th className="text-center py-3 px-4">Patients</th>
                  <th className="text-center py-3 px-4">Mortality Rate</th>
                  <th className="text-center py-3 px-4">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {riskFactorTable.map((row) => (
                  <tr key={row.factor} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{row.factor}</td>
                    <td className="text-center py-3 px-4">{row.present}</td>
                    <td className="text-center py-3 px-4">{row.mortality}%</td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${parseFloat(row.mortality) >= 50 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : parseFloat(row.mortality) >= 35 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                        {parseFloat(row.mortality) >= 50 ? 'High' : parseFloat(row.mortality) >= 35 ? 'Moderate' : 'Low'}
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
