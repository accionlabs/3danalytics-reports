/** Chart renderer contract — any chart component must satisfy this */
export interface ChartRendererProps {
  data: unknown
  width: number
  height: number
  onItemClick?: (index: number, category?: string) => void
}
export type ChartRenderer = React.ComponentType<ChartRendererProps>

// ── SaaS content pack types (domain-specific) ──

export interface RevenueDataPoint {
  month: string
  mrr: number
  arr: number
  newRevenue: number
  churnedRevenue: number
}

export interface ChurnDataPoint {
  month: string
  churnRate: number
  customers: number
  churned: number
}

export interface CohortRow {
  cohort: string
  retention: number[]
}

export interface FunnelStage {
  stage: string
  count: number
  conversionRate: number
}

export interface KpiMetric {
  label: string
  value: number
  unit: string
  trend: number
  trendDirection: 'up' | 'down' | 'flat'
}

export interface GeoRegion {
  region: string
  revenue: number
  customers: number
}

export interface ProductRevenue {
  product: string
  revenue: number
  growth: number
}

/** Semantic address — kept for panel data compatibility */
export interface SemanticAddress {
  processStep: number
  segment: number | null
  detailLevel: number
}

/** Panel definition — minimal for reports repo (no 3D types) */
export interface PanelConfig {
  id: string
  title: string
  chartType: string
  size: { width: number; height: number }
  data: unknown
  semantic: SemanticAddress
  parentId?: string
  segmentLabel?: string
  processLabel?: string
}

/** Causal/structural link between panels */
export interface CausalLink {
  from: string
  to: string
  type: 'causal' | 'segment' | 'hierarchy'
}
