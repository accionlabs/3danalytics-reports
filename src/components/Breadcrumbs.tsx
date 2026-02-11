import { useMemo } from 'react'
import { defaultPanels } from '../data/mockData.ts'

interface BreadcrumbsProps {
  activePanelId: string
  onSelect: (panelId: string) => void
}

/** Drill path breadcrumbs — walks parentId chain from current panel to root */
export function Breadcrumbs({ activePanelId, onSelect }: BreadcrumbsProps) {
  const crumbs = useMemo(() => {
    const panelById = new Map(defaultPanels.map((p) => [p.id, p]))
    const path: { id: string; title: string }[] = []
    let current = panelById.get(activePanelId)
    while (current) {
      path.unshift({ id: current.id, title: current.title })
      current = current.parentId ? panelById.get(current.parentId) : undefined
    }
    return path
  }, [activePanelId])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 16px',
        background: '#090c1a',
        borderTop: '1px solid rgba(60, 80, 120, 0.15)',
        fontSize: 12,
        color: '#6080a0',
        flexWrap: 'wrap',
      }}
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <span key={crumb.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && <span style={{ color: '#3a4a60' }}>&#8250;</span>}
            <span
              onClick={isLast ? undefined : () => onSelect(crumb.id)}
              style={{
                cursor: isLast ? 'default' : 'pointer',
                color: isLast ? '#c0d0e0' : '#6080a0',
                fontWeight: isLast ? 600 : 400,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isLast) (e.currentTarget as HTMLElement).style.color = '#93bbfc'
              }}
              onMouseLeave={(e) => {
                if (!isLast) (e.currentTarget as HTMLElement).style.color = '#6080a0'
              }}
            >
              {crumb.title}
            </span>
          </span>
        )
      })}
    </div>
  )
}
