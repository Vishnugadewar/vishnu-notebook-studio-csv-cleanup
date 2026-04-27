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
} from 'chart.js'
import { Bar, Scatter } from 'react-chartjs-2'
import { heartFailureData } from '@/lib/heart-failure-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Stethoscope, Droplets, Heart, Zap } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement)

export function HeartClinical() {
  const ejectionFractionData = useMemo(() => {
    const ranges = { '10-20': { total: 0, deaths: 0 }, '21-30': { total: 0, deaths: 0 }, '31-40': { total: 0, deaths: 0 }, '41-50': { total: 0, deaths: 0 }, '51-60': { total: 0, deaths: 0 }, '60+': { total: 0, deaths: 0 } }
    heartFailureData.forEach((p) => {
      const key = p.ejection_fraction <= 20 ? '10-20' : p.ejection_fraction <= 30 ? '21-30' : p.ejection_fraction <= 40 ? '31-40' : p.ejection_fraction <= 50 ? '41-50' : p.ejection_fraction <= 60 ? '51-60' : '60+'
      ranges[key as keyof typeof ranges].total++
      if (p.DEATH_EVENT) ranges[key as keyof typeof ranges].deaths++
    })
    return {
      labels: Object.keys(ranges),
      datasets: [
        { label: 'Survived', data: Object.values(ranges).map((r) => r.total - r.deaths), backgroundColor: 'rgba(34, 197, 94, 0.8)' },
        { label: 'Deceased', data: Object.values(ranges).map((r) => r.deaths), backgroundColor: 'rgba(239, 68, 68, 0.8)' },
      ],
    }
  }, [])

  const creatinineData = useMemo(() => {
    const ranges = { '0-1': { total: 0, deaths: 0 }, '1-2': { total: 0, deaths: 0 }, '2-3': { total: 0, deaths: 0 }, '3-5': { total: 0, deaths: 0 }, '5+': { total: 0, deaths: 0 } }
    heartFailureData.forEach((p) => {
      const key = p.serum_creatinine <= 1 ? '0-1' : p.serum_creatinine <= 2 ? '1-2' : p.serum_creatinine <= 3 ? '2-3' : p.serum_creatinine <= 5 ? '3-5' : '5+'
      ranges[key as keyof typeof ranges].total++
      if (p.DEATH_EVENT) ranges[key as keyof typeof ranges].deaths++
    })
    return {
      labels: Object.keys(ranges),
      datasets: [
        { label: 'Survived', data: Object.values(ranges).map((r) => r.total - r.deaths), backgroundColor: 'rgba(34, 197, 94, 0.8)' },
        { label: 'Deceased', data: Object.values(ranges).map((r) => r.deaths), backgroundColor: 'rgba(239, 68, 68, 0.8)' },
      ],
    }
  }, [])

  const sodiumData = useMemo(() => {
    const ranges = { '<130': { total: 0, deaths: 0 }, '130-135': { total: 0, deaths: 0 }, '136-140': { total: 0, deaths: 0 }, '141-145': { total: 0, deaths: 0 }, '>145': { total: 0, deaths: 0 } }
    heartFailureData.forEach((p) => {
      const key = p.serum_sodium < 130 ? '<130' : p.serum_sodium <= 135 ? '130-135' : p.serum_sodium <= 140 ? '136-140' : p.serum_sodium <= 145 ? '141-145' : '>145'
      ranges[key as keyof typeof ranges].total++
      if (p.DEATH_EVENT) ranges[key as keyof typeof ranges].deaths++
    })
    return {
      labels: Object.keys(ranges),
      datasets: [
        { label: 'Survived', data: Object.values(ranges).map((r) => r.total - r.deaths), backgroundColor: 'rgba(34, 197, 94, 0.8)' },
        { label: 'Deceased', data: Object.values(ranges).map((r) => r.deaths), backgroundColor: 'rgba(239, 68, 68, 0.8)' },
      ],
    }
  }, [])

  const clinicalStats = useMemo(() => {
    const ef = heartFailureData.map((p) => p.ejection_fraction)
    const cr = heartFailureData.map((p) => p.serum_creatinine)
    const so = heartFailureData.map((p) => p.serum_sodium)
    const cpk = heartFailureData.map((p) => p.creatinine_phosphokinase)
    return {
      ejectionFraction: { avg: (ef.reduce((a, b) => a + b, 0) / ef.length).toFixed(1), min: Math.min(...ef), max: Math.max(...ef) },
      creatinine: { avg: (cr.reduce((a, b) => a + b, 0) / cr.length).toFixed(2), min: Math.min(...cr).toFixed(2), max: Math.max(...cr).toFixed(2) },
      sodium: { avg: (so.reduce((a, b) => a + b, 0) / so.length).toFixed(1), min: Math.min(...so), max: Math.max(...so) },
      cpk: { avg: Math.round(cpk.reduce((a, b) => a + b, 0) / cpk.length), min: Math.min(...cpk), max: Math.max(...cpk) },
    }
  }, [])

  const findings = [
    { title: 'Ejection Fraction < 30%', desc: 'Significantly increased mortality risk', risk: 'high', value: heartFailureData.filter((p) => p.ejection_fraction < 30).length },
    { title: 'Serum Creatinine > 2.0', desc: 'Indicates kidney dysfunction', risk: 'high', value: heartFailureData.filter((p) => p.serum_creatinine > 2).length },
    { title: 'Serum Sodium < 135', desc: 'Hyponatremia - associated with worse outcomes', risk: 'medium', value: heartFailureData.filter((p) => p.serum_sodium < 135).length },
    { title: 'CPK > 500', desc: 'Elevated creatinine phosphokinase', risk: 'medium', value: heartFailureData.filter((p) => p.creatinine_phosphokinase > 500).length },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Stethoscope className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clinical Factors Analysis</h1>
          <p className="text-muted-foreground">Laboratory values and biomarker impact on outcomes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Ejection Fraction</p>
                <p className="text-xl font-bold">{clinicalStats.ejectionFraction.avg}%</p>
                <p className="text-xs text-muted-foreground">{clinicalStats.ejectionFraction.min} - {clinicalStats.ejectionFraction.max}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Droplets className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Serum Creatinine</p>
                <p className="text-xl font-bold">{clinicalStats.creatinine.avg} mg/dL</p>
                <p className="text-xs text-muted-foreground">{clinicalStats.creatinine.min} - {clinicalStats.creatinine.max}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Serum Sodium</p>
                <p className="text-xl font-bold">{clinicalStats.sodium.avg} mEq/L</p>
                <p className="text-xs text-muted-foreground">{clinicalStats.sodium.min} - {clinicalStats.sodium.max}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Stethoscope className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg CPK</p>
                <p className="text-xl font-bold">{clinicalStats.cpk.avg} mcg/L</p>
                <p className="text-xs text-muted-foreground">{clinicalStats.cpk.min} - {clinicalStats.cpk.max}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ejection Fraction Impact</CardTitle>
            <CardDescription>Outcome by EF range (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={ejectionFractionData} options={{ maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Serum Creatinine Levels</CardTitle>
            <CardDescription>Outcome by creatinine (mg/dL)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={creatinineData} options={{ maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Serum Sodium Levels</CardTitle>
            <CardDescription>Outcome by sodium (mEq/L)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={sodiumData} options={{ maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Clinical Findings</CardTitle>
          <CardDescription>Risk indicators identified in the dataset</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {findings.map((finding, i) => (
              <div key={i} className={`p-4 rounded-lg border ${finding.risk === 'high' ? 'border-destructive/50 bg-destructive/5' : 'border-warning/50 bg-warning/5'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{finding.title}</p>
                    <p className="text-sm text-muted-foreground">{finding.desc}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${finding.risk === 'high' ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning-foreground'}`}>
                    {finding.value} patients
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
