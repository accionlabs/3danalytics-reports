import type { ChartRenderer } from '../types/index.ts'
import { RevenueChart } from './RevenueChart.tsx'
import { ChurnChart } from './ChurnChart.tsx'
import { CohortChart } from './CohortChart.tsx'
import { FunnelChart } from './FunnelChart.tsx'
import { KpiCard } from './KpiCard.tsx'
import { GeoChart } from './GeoChart.tsx'
import { BarChart } from './BarChart.tsx'

const chartRegistry = new Map<string, ChartRenderer>()

chartRegistry.set('revenue', RevenueChart)
chartRegistry.set('churn', ChurnChart)
chartRegistry.set('cohort', CohortChart)
chartRegistry.set('funnel', FunnelChart)
chartRegistry.set('kpi', KpiCard)
chartRegistry.set('geo', GeoChart)
chartRegistry.set('bar', BarChart)

export function getChartRenderer(type: string): ChartRenderer | undefined {
  return chartRegistry.get(type)
}
