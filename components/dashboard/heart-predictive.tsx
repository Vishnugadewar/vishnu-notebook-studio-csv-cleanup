'use client'

import { useMemo, useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Brain, Calculator, Target, Zap } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

export function HeartPredictive() {
  const [inputValues, setInputValues] = useState({
    age: 60,
    ejectionFraction: 38,
    serumCreatinine: 1.2,
    serumSodium: 137,
    anaemia: 0,
    diabetes: 0,
    highBP: 0,
    smoking: 0,
  })
  const [prediction, setPrediction] = useState<null | { risk: string; score: number; factors: string[] }>(null)

  const featureImportance = useMemo(() => {
    return {
      labels: ['Follow-up Time', 'Serum Creatinine', 'Ejection Fraction', 'Age', 'Serum Sodium', 'Anaemia', 'High BP', 'Diabetes'],
      datasets: [{
        label: 'Importance Score',
        data: [0.42, 0.25, 0.18, 0.08, 0.04, 0.02, 0.01, 0.01],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(192, 132, 252, 0.8)',
          'rgba(216, 180, 254, 0.8)',
          'rgba(233, 213, 255, 0.8)',
          'rgba(243, 232, 255, 0.8)',
          'rgba(250, 245, 255, 0.8)',
        ],
      }],
    }
  }, [])

  const modelPerformance = useMemo(() => ({
    labels: ['Accuracy', 'Precision', 'Recall', 'F1 Score', 'AUC-ROC'],
    datasets: [{
      label: 'Score',
      data: [0.83, 0.79, 0.76, 0.77, 0.87],
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
    }],
  }), [])

  const confusionMatrix = useMemo(() => {
    const total = heartFailureData.length
    const deceased = heartFailureData.filter((p) => p.DEATH_EVENT === 1).length
    const survived = total - deceased
    // Simulated confusion matrix based on ~83% accuracy
    const tp = Math.round(deceased * 0.76)
    const fn = deceased - tp
    const tn = Math.round(survived * 0.87)
    const fp = survived - tn
    return { tp, fn, tn, fp }
  }, [])

  const calculateRisk = () => {
    let score = 0
    const factors: string[] = []

    if (inputValues.age > 65) { score += 15; factors.push('Age > 65') }
    if (inputValues.age > 75) { score += 10; factors.push('Age > 75') }
    if (inputValues.ejectionFraction < 30) { score += 25; factors.push('Very low EF (<30%)') }
    else if (inputValues.ejectionFraction < 40) { score += 15; factors.push('Low EF (<40%)') }
    if (inputValues.serumCreatinine > 2) { score += 20; factors.push('High creatinine') }
    else if (inputValues.serumCreatinine > 1.5) { score += 10; factors.push('Elevated creatinine') }
    if (inputValues.serumSodium < 135) { score += 15; factors.push('Low sodium') }
    if (inputValues.anaemia) { score += 5; factors.push('Anaemia') }
    if (inputValues.diabetes) { score += 5; factors.push('Diabetes') }
    if (inputValues.highBP) { score += 5; factors.push('High BP') }
    if (inputValues.smoking) { score += 5; factors.push('Smoking') }

    const risk = score >= 50 ? 'High' : score >= 30 ? 'Moderate' : 'Low'
    setPrediction({ risk, score: Math.min(score, 100), factors })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Predictive Modeling</h1>
          <p className="text-muted-foreground">Machine learning insights and risk prediction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Feature Importance</CardTitle>
            <CardDescription>Random Forest model feature rankings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <Bar data={featureImportance} options={{ maintainAspectRatio: false, indexAxis: 'y', scales: { x: { beginAtZero: true, max: 0.5 } } }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Model Performance Metrics</CardTitle>
            <CardDescription>Cross-validated performance scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <Bar data={modelPerformance} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 1 } } }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Confusion Matrix (Simulated)</CardTitle>
          <CardDescription>Model prediction breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-center">
              <p className="text-sm text-muted-foreground">True Negative</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{confusionMatrix.tn}</p>
            </div>
            <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-center">
              <p className="text-sm text-muted-foreground">False Positive</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{confusionMatrix.fp}</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-center">
              <p className="text-sm text-muted-foreground">False Negative</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{confusionMatrix.fn}</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-center">
              <p className="text-sm text-muted-foreground">True Positive</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{confusionMatrix.tp}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Risk Calculator (Demo)
          </CardTitle>
          <CardDescription>Enter patient parameters to estimate mortality risk</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label>Age</Label>
              <Input type="number" value={inputValues.age} onChange={(e) => setInputValues({ ...inputValues, age: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <Label>Ejection Fraction (%)</Label>
              <Input type="number" value={inputValues.ejectionFraction} onChange={(e) => setInputValues({ ...inputValues, ejectionFraction: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <Label>Serum Creatinine</Label>
              <Input type="number" step="0.1" value={inputValues.serumCreatinine} onChange={(e) => setInputValues({ ...inputValues, serumCreatinine: parseFloat(e.target.value) || 0 })} />
            </div>
            <div>
              <Label>Serum Sodium</Label>
              <Input type="number" value={inputValues.serumSodium} onChange={(e) => setInputValues({ ...inputValues, serumSodium: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mb-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!inputValues.anaemia} onChange={(e) => setInputValues({ ...inputValues, anaemia: e.target.checked ? 1 : 0 })} className="rounded" />
              <span className="text-sm">Anaemia</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!inputValues.diabetes} onChange={(e) => setInputValues({ ...inputValues, diabetes: e.target.checked ? 1 : 0 })} className="rounded" />
              <span className="text-sm">Diabetes</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!inputValues.highBP} onChange={(e) => setInputValues({ ...inputValues, highBP: e.target.checked ? 1 : 0 })} className="rounded" />
              <span className="text-sm">High Blood Pressure</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!inputValues.smoking} onChange={(e) => setInputValues({ ...inputValues, smoking: e.target.checked ? 1 : 0 })} className="rounded" />
              <span className="text-sm">Smoking</span>
            </label>
          </div>
          <Button onClick={calculateRisk} className="gap-2">
            <Zap className="h-4 w-4" />
            Calculate Risk
          </Button>

          {prediction && (
            <div className={`mt-6 p-4 rounded-lg border ${prediction.risk === 'High' ? 'border-destructive bg-destructive/5' : prediction.risk === 'Moderate' ? 'border-warning bg-warning/5' : 'border-green-500 bg-green-500/5'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Risk Level</p>
                  <p className={`text-2xl font-bold ${prediction.risk === 'High' ? 'text-destructive' : prediction.risk === 'Moderate' ? 'text-warning-foreground' : 'text-green-500'}`}>
                    {prediction.risk} Risk
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <p className="text-2xl font-bold">{prediction.score}/100</p>
                </div>
              </div>
              {prediction.factors.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Contributing Factors:</p>
                  <div className="flex flex-wrap gap-2">
                    {prediction.factors.map((f) => (
                      <span key={f} className="px-2 py-1 bg-muted rounded text-xs">{f}</span>
                    ))}
                  </div>
                </div>
              )}
              <p className="mt-4 text-xs text-muted-foreground">
                Note: This is a demonstration tool and should not be used for actual medical decisions.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
