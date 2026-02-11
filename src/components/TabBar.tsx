import { useMemo } from 'react'
import { defaultPanels } from '../data/mockData.ts'

interface TabBarProps {
  activePanelId: string
  onSelect: (panelId: string) => void
}

/** Pipeline stage tabs (X-axis equivalent) */
export function TabBar({ activePanelId, onSelect }: TabBarProps) {
  const activePanel = useMemo(
    () => defaultPanels.find((p) => p.id === activePanelId),
    [activePanelId],
  )

  // Extract unique pipeline stages at Z=1 level (summary panels)
  const stages = useMemo(() => {
    const z1 = defaultPanels.filter((p) => p.semantic.detailLevel === 1)
    return z1.map((p) => ({
      id: p.id,
      label: p.processLabel ?? p.title,
      processStep: p.semantic.processStep,
    }))
  }, [])

  const activeProcessStep = activePanel?.semantic.processStep ?? -1

  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        padding: '8px 16px',
        borderBottom: '1px solid rgba(60, 80, 120, 0.2)',
        background: '#0b0e20',
        flexWrap: 'wrap',
      }}
    >
      {stages.map((stage) => {
        const isActive = stage.processStep === activeProcessStep
        return (
          <button
            key={stage.id}
            onClick={() => onSelect(stage.id)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: isActive ? '1px solid #3b82f6' : '1px solid rgba(60, 80, 120, 0.2)',
              background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              color: isActive ? '#93bbfc' : '#6080a0',
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {stage.label}
          </button>
        )
      })}
    </div>
  )
}
