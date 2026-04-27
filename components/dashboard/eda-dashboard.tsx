"use client"

import { useMemo, useState } from "react"
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
  Filler,
} from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"
import { Bar, Pie, Doughnut, Line } from "react-chartjs-2"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  heartFailureData,
  calculateDatasetStats,
  groupByAgeRange,
  groupByEjectionFraction,
  getFeatureCorrelations,
  getSerumCreatinineDistribution,
} from "@/lib/heart-failure-data"
import {
  Activity,
  Heart,
  Users,
  TrendingUp,
  AlertTriangle,
  Droplets,
  Cigarette,
  Stethoscope,
} from "lucide-react"

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  ChartDataLabels
)

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ReactNode
  trend?: "up" | "down" | "neutral"
  trendValue?: string
}

function StatCard({ title, value, description, icon, trend, trendValue }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="rounded-full bg-primary/10 p-2 text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && trendValue && (
          <div className="flex items-center gap-1 mt-2">
            <Badge
              variant={trend === "up" ? "destructive" : trend === "down" ? "secondary" : "outline"}
              className="text-xs"
            >
              {trendValue}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function EDADashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = useMemo(() => calculateDatasetStats(heartFailureData), [])
  const ageData = useMemo(() => groupByAgeRange(heartFailureData), [])
  const efData = useMemo(() => groupByEjectionFraction(heartFailureData), [])
  const correlations = useMemo(() => getFeatureCorrelations(heartFailureData), [])
  const creatinineData = useMemo(() => getSerumCreatinineDistribution(heartFailureData), [])

  // Chart color palette
  const colors = {
    primary: "oklch(0.55 0.2 260)",
    primaryLight: "oklch(0.65 0.15 260 / 0.5)",
    success: "oklch(0.6 0.18 145)",
    successLight: "oklch(0.7 0.15 145 / 0.5)",
    danger: "oklch(0.55 0.2 25)",
    dangerLight: "oklch(0.65 0.15 25 / 0.5)",
    warning: "oklch(0.75 0.15 85)",
    warningLight: "oklch(0.8 0.12 85 / 0.5)",
    muted: "oklch(0.6 0 0)",
    mutedLight: "oklch(0.7 0 0 / 0.5)",
  }

  // Mortality Distribution Chart
  const mortalityPieData = {
    labels: ["Survived", "Deceased"],
    datasets: [
      {
        data: [stats.survived, stats.deaths],
        backgroundColor: [colors.success, colors.danger],
        borderColor: ["transparent", "transparent"],
        borderWidth: 0,
      },
    ],
  }

  // Age Distribution Chart
  const ageBarData = {
    labels: ageData.map((d) => d.label),
    datasets: [
      {
        label: "Survived",
        data: ageData.map((d) => d.survived),
        backgroundColor: colors.success,
        borderRadius: 4,
      },
      {
        label: "Deceased",
        data: ageData.map((d) => d.deaths),
        backgroundColor: colors.danger,
        borderRadius: 4,
      },
    ],
  }

  // Ejection Fraction Chart
  const efBarData = {
    labels: efData.map((d) => d.label.split(" ")[0]),
    datasets: [
      {
        label: "Mortality Rate (%)",
        data: efData.map((d) => d.mortalityRate),
        backgroundColor: efData.map((d) =>
          d.mortalityRate > 50 ? colors.danger : d.mortalityRate > 30 ? colors.warning : colors.success
        ),
        borderRadius: 4,
      },
    ],
  }

  // Feature Correlation Chart
  const correlationBarData = {
    labels: correlations.map((c) => c.name),
    datasets: [
      {
        label: "With Condition",
        data: correlations.map((c) => c.withConditionRate),
        backgroundColor: colors.danger,
        borderRadius: 4,
      },
      {
        label: "Without Condition",
        data: correlations.map((c) => c.withoutConditionRate),
        backgroundColor: colors.success,
        borderRadius: 4,
      },
    ],
  }

  // Serum Creatinine Chart
  const creatinineBarData = {
    labels: creatinineData.map((d) => d.label),
    datasets: [
      {
        label: "Mortality Rate (%)",
        data: creatinineData.map((d) => d.mortalityRate),
        backgroundColor: creatinineData.map((d) =>
          d.mortalityRate > 60 ? colors.danger : d.mortalityRate > 35 ? colors.warning : colors.success
        ),
        borderRadius: 4,
      },
    ],
  }

  // Gender Distribution
  const genderPieData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [stats.males, stats.females],
        backgroundColor: [colors.primary, colors.warning],
        borderColor: ["transparent", "transparent"],
        borderWidth: 0,
      },
    ],
  }

  // Common chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 16,
          font: { size: 11 },
        },
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } },
      },
      y: {
        grid: { color: "oklch(0.5 0 0 / 0.1)" },
        ticks: { font: { size: 10 } },
      },
    },
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 16,
          font: { size: 11 },
        },
      },
      datalabels: {
        color: "#fff",
        font: { weight: "bold" as const, size: 12 },
        formatter: (value: number, ctx: { chart: ChartJS; dataIndex: number }) => {
          const total = ctx.chart.data.datasets[0].data.reduce((a: number, b) => a + (b as number), 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${percentage}%`
        },
      },
    },
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-xl font-semibold">Heart Failure Prediction EDA</h2>
          <p className="text-sm text-muted-foreground">
            Exploratory Data Analysis of Clinical Records
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Activity className="h-3 w-3" />
          {stats.total} Records
        </Badge>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="clinical">Clinical Factors</TabsTrigger>
              <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Key Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Patients"
                  value={stats.total}
                  description="Clinical records analyzed"
                  icon={<Users className="h-4 w-4" />}
                />
                <StatCard
                  title="Mortality Rate"
                  value={`${stats.mortalityRate}%`}
                  description={`${stats.deaths} deaths`}
                  icon={<Heart className="h-4 w-4" />}
                  trend="up"
                  trendValue="High Risk"
                />
                <StatCard
                  title="Average Age"
                  value={`${stats.avgAge} yrs`}
                  description="Patient mean age"
                  icon={<Activity className="h-4 w-4" />}
                />
                <StatCard
                  title="With Diabetes"
                  value={stats.withDiabetes}
                  description={`${((stats.withDiabetes / stats.total) * 100).toFixed(1)}% of patients`}
                  icon={<Droplets className="h-4 w-4" />}
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Outcome Distribution</CardTitle>
                    <CardDescription>Survival vs mortality</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <Doughnut data={mortalityPieData} options={pieOptions} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Mortality by Age Group</CardTitle>
                    <CardDescription>Age distribution analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <Bar data={ageBarData} options={barOptions} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Condition Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Anaemia"
                  value={stats.withAnaemia}
                  description={`${((stats.withAnaemia / stats.total) * 100).toFixed(1)}%`}
                  icon={<Droplets className="h-4 w-4" />}
                />
                <StatCard
                  title="High Blood Pressure"
                  value={stats.withHBP}
                  description={`${((stats.withHBP / stats.total) * 100).toFixed(1)}%`}
                  icon={<AlertTriangle className="h-4 w-4" />}
                />
                <StatCard
                  title="Smokers"
                  value={stats.smokers}
                  description={`${((stats.smokers / stats.total) * 100).toFixed(1)}%`}
                  icon={<Cigarette className="h-4 w-4" />}
                />
                <StatCard
                  title="Male/Female"
                  value={`${stats.males}/${stats.females}`}
                  description="Gender distribution"
                  icon={<Users className="h-4 w-4" />}
                />
              </div>
            </TabsContent>

            <TabsContent value="demographics" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Gender Distribution</CardTitle>
                    <CardDescription>Male vs Female patients</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[280px]">
                      <Pie data={genderPieData} options={pieOptions} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Age Group Analysis</CardTitle>
                    <CardDescription>Survival by age range</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[280px]">
                      <Bar data={ageBarData} options={barOptions} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Age Statistics Table */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Age Group Statistics</CardTitle>
                  <CardDescription>Detailed breakdown by age range</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 font-medium">Age Range</th>
                          <th className="text-right py-2 px-3 font-medium">Total</th>
                          <th className="text-right py-2 px-3 font-medium">Survived</th>
                          <th className="text-right py-2 px-3 font-medium">Deceased</th>
                          <th className="text-right py-2 px-3 font-medium">Mortality Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ageData.map((row) => (
                          <tr key={row.label} className="border-b last:border-0">
                            <td className="py-2 px-3 font-medium">{row.label}</td>
                            <td className="text-right py-2 px-3">{row.total}</td>
                            <td className="text-right py-2 px-3 text-success">{row.survived}</td>
                            <td className="text-right py-2 px-3 text-destructive">{row.deaths}</td>
                            <td className="text-right py-2 px-3">
                              <Badge
                                variant={
                                  row.mortalityRate > 50
                                    ? "destructive"
                                    : row.mortalityRate > 30
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {row.mortalityRate.toFixed(1)}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clinical" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Ejection Fraction Impact</CardTitle>
                    <CardDescription>Mortality rate by EF range</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[280px]">
                      <Bar data={efBarData} options={barOptions} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Serum Creatinine Levels</CardTitle>
                    <CardDescription>Kidney function indicator</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[280px]">
                      <Bar data={creatinineBarData} options={barOptions} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Clinical Findings */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Key Clinical Findings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <h4 className="font-medium text-destructive mb-1">High Risk Factors</h4>
                    <p className="text-sm text-muted-foreground">
                      Patients with ejection fraction below 30% show significantly higher mortality
                      rates. Serum creatinine levels above 2.0 mg/dL are strongly correlated with
                      poor outcomes.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <h4 className="font-medium text-warning-foreground mb-1">Moderate Risk</h4>
                    <p className="text-sm text-muted-foreground">
                      Age above 70, presence of anaemia, and high blood pressure increase mortality
                      risk but are not as strong predictors as ejection fraction.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                    <h4 className="font-medium mb-1" style={{ color: colors.success }}>
                      Protective Factors
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Longer follow-up time correlates with survival, suggesting early deaths occur
                      in the most severe cases. Normal sodium levels also indicate better prognosis.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Comorbidity Impact Analysis</CardTitle>
                  <CardDescription>Mortality rate comparison with/without conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Bar data={correlationBarData} options={barOptions} />
                  </div>
                </CardContent>
              </Card>

              {/* Risk Factor Table */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Risk Factor Statistics</CardTitle>
                  <CardDescription>Detailed comorbidity analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 font-medium">Condition</th>
                          <th className="text-right py-2 px-3 font-medium">With Condition</th>
                          <th className="text-right py-2 px-3 font-medium">Mortality (With)</th>
                          <th className="text-right py-2 px-3 font-medium">Without Condition</th>
                          <th className="text-right py-2 px-3 font-medium">Mortality (Without)</th>
                          <th className="text-right py-2 px-3 font-medium">Risk Increase</th>
                        </tr>
                      </thead>
                      <tbody>
                        {correlations.map((row) => {
                          const riskIncrease = row.withConditionRate - row.withoutConditionRate
                          return (
                            <tr key={row.name} className="border-b last:border-0">
                              <td className="py-2 px-3 font-medium">{row.name}</td>
                              <td className="text-right py-2 px-3">{row.withConditionCount}</td>
                              <td className="text-right py-2 px-3">
                                {row.withConditionRate.toFixed(1)}%
                              </td>
                              <td className="text-right py-2 px-3">{row.withoutConditionCount}</td>
                              <td className="text-right py-2 px-3">
                                {row.withoutConditionRate.toFixed(1)}%
                              </td>
                              <td className="text-right py-2 px-3">
                                <Badge variant={riskIncrease > 5 ? "destructive" : "outline"}>
                                  {riskIncrease > 0 ? "+" : ""}
                                  {riskIncrease.toFixed(1)}%
                                </Badge>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Risk Prediction Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-card border">
                      <h4 className="font-semibold mb-2">Top Predictors</h4>
                      <ol className="text-sm text-muted-foreground space-y-1">
                        <li>1. Serum Creatinine</li>
                        <li>2. Ejection Fraction</li>
                        <li>3. Age</li>
                        <li>4. Follow-up Time</li>
                      </ol>
                    </div>
                    <div className="p-4 rounded-lg bg-card border">
                      <h4 className="font-semibold mb-2">Model Recommendations</h4>
                      <p className="text-sm text-muted-foreground">
                        Random Forest and XGBoost show best performance for this imbalanced dataset.
                        Consider SMOTE for class balancing.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-card border">
                      <h4 className="font-semibold mb-2">Feature Engineering</h4>
                      <p className="text-sm text-muted-foreground">
                        Create interaction terms between ejection fraction and serum creatinine for
                        improved prediction accuracy.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  )
}
