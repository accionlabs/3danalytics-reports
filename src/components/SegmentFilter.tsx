import { useMemo } from 'react'
import { defaultPanels } from '../data/mockData.ts'

interface SegmentFilterProps {
  activePanelId: string
  onSelect: (panelId: string) => void
}

/** Segment pill buttons (Y-axis equivalent) */
export function SegmentFilter({ activePanelId, onSelect }: SegmentFilterProps) {
  const activePanel = useMemo(
    () => defaultPanels.find((p) => p.id === activePanelId),
    [activePanelId],
  )

  const activeProcessStep = activePanel?.semantic.processStep ?? -1
  const activeSegment = activePanel?.segmentLabel ?? null

  // Find panels at the same processStep that have segment labels
  const segmentOptions = useMemo(() => {
    // Get the Z=1 (aggregated) panel for this processStep
    const aggregated = defaultPanels.find(
      (p) => p.semantic.processStep === activeProcessStep && p.semantic.detailLevel === 1,
    )

    // Get Z=2 segment panels for this processStep
    const segmentPanels = defaultPanels.filter(
      (p) =>
        p.semantic.processStep === activeProcessStep &&
        p.semantic.detailLevel === 2 &&
        p.segmentLabel,
    )

    if (segmentPanels.length === 0) return []

    const options: { label: string; panelId: string }[] = []
    if (aggregated) {
      options.push({ label: 'All', panelId: aggregated.id })
    }
    for (const sp of segmentPanels) {
      options.push({ label: sp.segmentLabel!, panelId: sp.id })
    }
    return options
  }, [activeProcessStep])

  if (segmentOptions.length === 0) return null

  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        padding: '6px 16px',
        borderBottom: '1px solid rgba(60, 80, 120, 0.15)',
        background: '#0a0d1e',
        flexWrap: 'wrap',
      }}
    >
      {segmentOptions.map((opt) => {
        const isActive =
          (opt.label === 'All' && activeSegment === null) ||
          opt.label === activeSegment
        return (
          <button
            key={opt.panelId}
            onClick={() => onSelect(opt.panelId)}
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              border: isActive ? '1px solid #8b5cf6' : '1px solid rgba(60, 80, 120, 0.2)',
              background: isActive ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
              color: isActive ? '#c4b5fd' : '#6080a0',
              fontSize: 12,
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
