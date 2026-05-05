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
import { Bar, Doughnut } from 'react-chartjs-2'
import { heartFailureData } from '@/lib/heart-failure-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Pill, Activity, CheckCircle2, XCircle } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

export function HeartTreatment() {
  const treatmentStats = useMemo(() => {
    const total = heartFailureData.length
    return [
      {
        name: 'Anaemia Treatment Needed',
        count: heartFailureData.filter((p) => p.anaemia === 1).length,
        pct: ((heartFailureData.filter((p) => p.anaemia === 1).length / total) * 100).toFixed(1),
      },
      {
        name: 'Diabetes Management',
        count: heartFailureData.filter((p) => p.diabetes === 1).length,
        pct: ((heartFailureData.filter((p) => p.diabetes === 1).length / total) * 100).toFixed(1),
      },
      {
        name: 'BP Control Required',
        count: heartFailureData.filter((p) => p.high_blood_pressure === 1).length,
        pct: ((heartFailureData.filter((p) => p.high_blood_pressure === 1).length / total) * 100).toFixed(1),
      },
      {
        name: 'Smoking Cessation',
        count: heartFailureData.filter((p) => p.smoking === 1).length,
        pct: ((heartFailureData.filter((p) => p.smoking === 1).length / total) * 100).toFixed(1),
      },
    ]
  }, [])

  const efCategories = useMemo(() => {
    const reduced = heartFailureData.filter((p) => p.ejection_fraction < 40)
    const midRange = heartFailureData.filter((p) => p.ejection_fraction >= 40 && p.ejection_fraction < 50)
    const preserved = heartFailureData.filter((p) => p.ejection_fraction >= 50)
    return {
      labels: ['HFrEF (<40%)', 'HFmrEF (40-49%)', 'HFpEF (≥50%)'],
      datasets: [{
        data: [reduced.length, midRange.length, preserved.length],
        backgroundColor: ['rgba(239, 68, 68, 0.8)', 'rgba(234, 179, 8, 0.8)', 'rgba(34, 197, 94, 0.8)'],
      }],
    }
  }, [])

  const efCategoryDetails = useMemo(() => {
    const categories = [
      { name: 'HFrEF (<40%)', filter: (p: typeof heartFailureData[0]) => p.ejection_fraction < 40, treatment: 'ACE inhibitors, Beta blockers, MRAs, SGLT2i' },
      { name: 'HFmrEF (40-49%)', filter: (p: typeof heartFailureData[0]) => p.ejection_fraction >= 40 && p.ejection_fraction < 50, treatment: 'Diuretics, Consider HFrEF therapies' },
      { name: 'HFpEF (≥50%)', filter: (p: typeof heartFailureData[0]) => p.ejection_fraction >= 50, treatment: 'Diuretics, SGLT2i, Address comorbidities' },
    ]
    return categories.map((cat) => {
      const patients = heartFailureData.filter(cat.filter)
      const deaths = patients.filter((p) => p.DEATH_EVENT === 1).length
      return {
        name: cat.name,
        count: patients.length,
        mortality: patients.length > 0 ? ((deaths / patients.length) * 100).toFixed(1) : '0',
        treatment: cat.treatment,
      }
    })
  }, [])

  const kidneyFunction = useMemo(() => {
    const normal = heartFailureData.filter((p) => p.serum_creatinine <= 1.2)
    const mild = heartFailureData.filter((p) => p.serum_creatinine > 1.2 && p.serum_creatinine <= 2)
    const moderate = heartFailureData.filter((p) => p.serum_creatinine > 2 && p.serum_creatinine <= 3)
    const severe = heartFailureData.filter((p) => p.serum_creatinine > 3)
    return {
      labels: ['Normal (≤1.2)', 'Mild (1.2-2)', 'Moderate (2-3)', 'Severe (>3)'],
      datasets: [
        {
          label: 'Survived',
          data: [
            normal.filter((p) => !p.DEATH_EVENT).length,
            mild.filter((p) => !p.DEATH_EVENT).length,
            moderate.filter((p) => !p.DEATH_EVENT).length,
            severe.filter((p) => !p.DEATH_EVENT).length,
          ],
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
        },
        {
          label: 'Deceased',
          data: [
            normal.filter((p) => p.DEATH_EVENT === 1).length,
            mild.filter((p) => p.DEATH_EVENT === 1).length,
            moderate.filter((p) => p.DEATH_EVENT === 1).length,
            severe.filter((p) => p.DEATH_EVENT === 1).length,
          ],
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
        },
      ],
    }
  }, [])

  const recommendations = [
    { priority: 'High', condition: 'EF < 30% with Creatinine > 2', count: heartFailureData.filter((p) => p.ejection_fraction < 30 && p.serum_creatinine > 2).length, action: 'Urgent cardio-renal evaluation' },
    { priority: 'High', condition: 'Multiple comorbidities (3+)', count: heartFailureData.filter((p) => p.anaemia + p.diabetes + p.high_blood_pressure + p.smoking >= 3).length, action: 'Multidisciplinary care team' },
    { priority: 'Medium', condition: 'Sodium < 135', count: heartFailureData.filter((p) => p.serum_sodium < 135).length, action: 'Fluid restriction, monitor diuretics' },
    { priority: 'Medium', condition: 'Age > 75 with HFrEF', count: heartFailureData.filter((p) => p.age > 75 && p.ejection_fraction < 40).length, action: 'Careful medication titration' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Pill className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Treatment Insights</h1>
          <p className="text-muted-foreground">Clinical recommendations and treatment stratification</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {treatmentStats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{stat.name}</p>
                  <p className="text-xl font-bold">{stat.count} <span className="text-sm font-normal text-muted-foreground">({stat.pct}%)</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Heart Failure Classification</CardTitle>
            <CardDescription>By ejection fraction category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={efCategories} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Kidney Function Impact</CardTitle>
            <CardDescription>Outcomes by creatinine level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={kidneyFunction} options={{ maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Treatment by EF Category</CardTitle>
          <CardDescription>Guideline-based treatment recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {efCategoryDetails.map((cat) => (
              <div key={cat.name} className="p-4 rounded-lg border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-medium">{cat.name}</h4>
                    <p className="text-sm text-muted-foreground">{cat.treatment}</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Patients:</span> <span className="font-medium">{cat.count}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mortality:</span> <span className={`font-medium ${parseFloat(cat.mortality) > 40 ? 'text-destructive' : 'text-green-500'}`}>{cat.mortality}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clinical Recommendations</CardTitle>
          <CardDescription>Priority actions based on patient profiles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Priority</th>
                  <th className="text-left py-3 px-4">Condition</th>
                  <th className="text-center py-3 px-4">Patients</th>
                  <th className="text-left py-3 px-4">Recommended Action</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.map((rec, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${rec.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                        {rec.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{rec.condition}</td>
                    <td className="text-center py-3 px-4">{rec.count}</td>
                    <td className="py-3 px-4 text-muted-foreground">{rec.action}</td>
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
