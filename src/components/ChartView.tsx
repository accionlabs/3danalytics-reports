import { useCallback } from 'react'
import { panelMap, childMap } from '../data/panelMap.ts'
import { getChartRenderer } from '../charts/index.ts'

interface ChartViewProps {
  panelId: string
  width: number
  height: number
  onNavigate?: (panelId: string) => void
  onItemClick?: (index: number, category?: string) => void
}

/** Max chart dimensions — prevents charts from stretching edge-to-edge on large screens */
const MAX_CHART_WIDTH = 900
const MAX_CHART_HEIGHT = 560

/** Renders a chart by panel ID, centered within the given dimensions */
export function ChartView({ panelId, width, height, onNavigate, onItemClick: externalOnItemClick }: ChartViewProps) {
  const panel = panelMap.get(panelId)
  if (!panel) {
    return (
      <div style={{ color: '#6080a0', padding: 20 }}>
        Panel not found: {panelId}
      </div>
    )
  }

  const Renderer = getChartRenderer(panel.chartType)
  if (!Renderer) {
    return (
      <div style={{ color: '#6080a0', padding: 20 }}>
        Unknown chart type: {panel.chartType}
      </div>
    )
  }

  const children = childMap.get(panelId)

  const handleItemClick = useCallback(
    (index: number, _category?: string) => {
      if (!onNavigate || !children?.length) return
      const childId = children[index]
      if (childId) onNavigate(childId)
    },
    [onNavigate, children],
  )

  // Responsive padding: tighter on small screens
  const padding = width < 480 ? 12 : width < 768 ? 16 : 24

  // Compute chart size: use available space but cap at max
  const chartWidth = Math.min(MAX_CHART_WIDTH, Math.max(200, width - padding * 2))
  const chartHeight = Math.min(MAX_CHART_HEIGHT, Math.max(150, height - padding * 2))

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding,
    }}>
      <Renderer
        data={panel.data}
        width={chartWidth}
        height={chartHeight}
        onItemClick={externalOnItemClick ?? (onNavigate && children?.length ? handleItemClick : undefined)}
      />
    </div>
  )
}
