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
import { Scatter, Bar } from 'react-chartjs-2'
import { heartFailureData } from '@/lib/heart-failure-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { GitBranch, ArrowUpDown } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement)

function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0)
  const sumX2 = x.reduce((a, b) => a + b * b, 0)
  const sumY2 = y.reduce((a, b) => a + b * b, 0)
  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
  return denominator === 0 ? 0 : numerator / denominator
}

export function HeartCorrelation() {
  const correlations = useMemo(() => {
    const death = heartFailureData.map((p) => p.DEATH_EVENT)
    const variables = [
      { name: 'Age', data: heartFailureData.map((p) => p.age) },
      { name: 'Ejection Fraction', data: heartFailureData.map((p) => p.ejection_fraction) },
      { name: 'Serum Creatinine', data: heartFailureData.map((p) => p.serum_creatinine) },
      { name: 'Serum Sodium', data: heartFailureData.map((p) => p.serum_sodium) },
      { name: 'CPK', data: heartFailureData.map((p) => p.creatinine_phosphokinase) },
      { name: 'Platelets', data: heartFailureData.map((p) => p.platelets) },
      { name: 'Follow-up Time', data: heartFailureData.map((p) => p.time) },
    ]
    return variables.map((v) => ({
      name: v.name,
      correlation: calculateCorrelation(v.data, death),
    })).sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
  }, [])

  const correlationChart = {
    labels: correlations.map((c) => c.name),
    datasets: [{
      label: 'Correlation with Death',
      data: correlations.map((c) => c.correlation.toFixed(3)),
      backgroundColor: correlations.map((c) => c.correlation >= 0 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(34, 197, 94, 0.8)'),
    }],
  }

  const scatterEFCreatinine = useMemo(() => ({
    datasets: [
      {
        label: 'Survived',
        data: heartFailureData.filter((p) => p.DEATH_EVENT === 0).map((p) => ({ x: p.ejection_fraction, y: p.serum_creatinine })),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
      },
      {
        label: 'Deceased',
        data: heartFailureData.filter((p) => p.DEATH_EVENT === 1).map((p) => ({ x: p.ejection_fraction, y: p.serum_creatinine })),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
      },
    ],
  }), [])

  const scatterAgeEF = useMemo(() => ({
    datasets: [
      {
        label: 'Survived',
        data: heartFailureData.filter((p) => p.DEATH_EVENT === 0).map((p) => ({ x: p.age, y: p.ejection_fraction })),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
      },
      {
        label: 'Deceased',
        data: heartFailureData.filter((p) => p.DEATH_EVENT === 1).map((p) => ({ x: p.age, y: p.ejection_fraction })),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
      },
    ],
  }), [])

  const interVariableCorr = useMemo(() => {
    const vars = [
      { name: 'Age', data: heartFailureData.map((p) => p.age) },
      { name: 'EF', data: heartFailureData.map((p) => p.ejection_fraction) },
      { name: 'Creatinine', data: heartFailureData.map((p) => p.serum_creatinine) },
      { name: 'Sodium', data: heartFailureData.map((p) => p.serum_sodium) },
    ]
    const matrix: { x: string; y: string; value: number }[] = []
    for (let i = 0; i < vars.length; i++) {
      for (let j = i + 1; j < vars.length; j++) {
        matrix.push({
          x: vars[i].name,
          y: vars[j].name,
          value: calculateCorrelation(vars[i].data, vars[j].data),
        })
      }
    }
    return matrix.sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <GitBranch className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Correlation Analysis</h1>
          <p className="text-muted-foreground">Variable relationships and statistical correlations</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Correlation with Mortality</CardTitle>
          <CardDescription>Pearson correlation coefficients between features and death event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Bar data={correlationChart} options={{ maintainAspectRatio: false, indexAxis: 'y', scales: { x: { min: -0.5, max: 0.5 } } }} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ejection Fraction vs Creatinine</CardTitle>
            <CardDescription>Scatter plot colored by outcome</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <Scatter data={scatterEFCreatinine} options={{ maintainAspectRatio: false, scales: { x: { title: { display: true, text: 'Ejection Fraction (%)' } }, y: { title: { display: true, text: 'Serum Creatinine (mg/dL)' } } } }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Age vs Ejection Fraction</CardTitle>
            <CardDescription>Scatter plot colored by outcome</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <Scatter data={scatterAgeEF} options={{ maintainAspectRatio: false, scales: { x: { title: { display: true, text: 'Age (years)' } }, y: { title: { display: true, text: 'Ejection Fraction (%)' } } } }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inter-Variable Correlations</CardTitle>
          <CardDescription>Relationships between clinical variables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interVariableCorr.map((pair) => (
              <div key={`${pair.x}-${pair.y}`} className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{pair.x} ↔ {pair.y}</span>
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pair.value >= 0 ? 'bg-blue-500' : 'bg-orange-500'}`}
                      style={{ width: `${Math.abs(pair.value) * 100}%` }}
                    />
                  </div>
                  <span className={`text-sm font-mono ${pair.value >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>
                    {pair.value >= 0 ? '+' : ''}{pair.value.toFixed(3)}
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
