import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { panelMap } from '../data/panelMap.ts'
import { ChartView } from '../components/ChartView.tsx'
import { useViewportSize } from '../hooks/useViewportSize.ts'

/** Bare chart route for iframe embedding — no navigation chrome */
export function PanelPage() {
  const { panelId } = useParams<{ panelId: string }>()
  const { width, height } = useViewportSize()
  const panel = panelId ? panelMap.get(panelId) : undefined

  // When embedded in an iframe, send drill messages to the parent
  const handleItemClick = useCallback(
    (index: number, category?: string) => {
      if (window.parent === window) return // not in an iframe
      window.parent.postMessage(
        {
          type: 'analytics:drill',
          ...(category != null ? { category } : {}),
          index,
        },
        '*',
      )
    },
    [],
  )

  if (!panel) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6080a0',
        fontSize: 18,
        background: '#0a0a1a',
      }}>
        Panel not found: {panelId}
      </div>
    )
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#080c1c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <ChartView
        panelId={panel.id}
        width={width}
        height={height}
        onItemClick={handleItemClick}
      />
    </div>
  )
}
