import { useCallback, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar.tsx'
import { TabBar } from '../components/TabBar.tsx'
import { SegmentFilter } from '../components/SegmentFilter.tsx'
import { Breadcrumbs } from '../components/Breadcrumbs.tsx'
import { ChartView } from '../components/ChartView.tsx'
import { useViewportSize } from '../hooks/useViewportSize.ts'
import { panelMap } from '../data/panelMap.ts'

const SIDEBAR_WIDTH = 220

/** Conventional 2D dashboard — sidebar + tabs + segments + breadcrumbs + chart */
export function Dashboard() {
  const { panelId: urlPanelId } = useParams<{ panelId: string }>()
  const navigate = useNavigate()
  const { width, height } = useViewportSize()
  const [sidebarOpen, setSidebarOpen] = useState(width >= 768)

  const activePanelId = urlPanelId && panelMap.has(urlPanelId) ? urlPanelId : 'dashboard'

  const navigateTo = useCallback(
    (id: string) => {
      navigate(`/dashboard/${id}`)
    },
    [navigate],
  )

  const isMobile = width < 768
  const isCompact = width < 1024
  const effectiveSidebarWidth = isMobile && !sidebarOpen ? 0 : (isMobile ? 0 : SIDEBAR_WIDTH)

  // Responsive chrome dimensions
  const navbarH = isMobile ? 42 : 48
  const tabsH = isMobile ? 38 : 44
  const segmentH = isMobile ? 32 : 36
  const breadcrumbsH = isMobile ? 30 : 34

  // Calculate chart area dimensions
  const chartWidth = width - effectiveSidebarWidth
  const chromeHeight = navbarH + tabsH + segmentH + breadcrumbsH
  const chartHeight = height - chromeHeight

  // Responsive font/padding
  const navFontSize = isMobile ? 13 : 15
  const titleFontSize = isMobile ? 14 : isCompact ? 15 : 16
  const titlePadding = isMobile ? '8px 12px 0' : '12px 20px 0'

  // 3D repo link
  const threeDUrl = `/3danalytics/#panel=${activePanelId}`

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#0a0a1a' }}>
      {/* Navbar */}
      <div
        style={{
          height: navbarH,
          minHeight: navbarH,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '0 12px' : '0 20px',
          background: 'rgba(10, 10, 26, 0.95)',
          borderBottom: '1px solid rgba(60, 80, 120, 0.2)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12 }}>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              style={{
                background: 'none',
                border: 'none',
                color: '#8090b0',
                fontSize: 20,
                cursor: 'pointer',
                padding: '2px 6px',
              }}
            >
              &#9776;
            </button>
          )}
          <span style={{ color: '#e0e8f0', fontSize: navFontSize, fontWeight: 600 }}>
            Analytics Dashboard
          </span>
        </div>
        <a
          href={threeDUrl}
          style={{
            color: '#3b82f6',
            fontSize: isMobile ? 12 : 13,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          Open in 3D
          <span style={{ fontSize: isMobile ? 14 : 16 }}>&#8594;</span>
        </a>
      </div>

      {/* Body: sidebar + main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar - with overlay on mobile */}
        {(sidebarOpen || !isMobile) && (
          <>
            {isMobile && (
              <div
                onClick={() => setSidebarOpen(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  zIndex: 999,
                }}
              />
            )}
            <div
              style={{
                position: isMobile ? 'fixed' : 'relative',
                left: 0,
                top: isMobile ? navbarH : 0,
                height: isMobile ? `calc(100% - ${navbarH}px)` : '100%',
                zIndex: isMobile ? 1000 : 'auto',
              }}
            >
              <Sidebar
                activePanelId={activePanelId}
                onSelect={(id) => {
                  navigateTo(id)
                  if (isMobile) setSidebarOpen(false)
                }}
              />
            </div>
          </>
        )}

        {/* Main content area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TabBar activePanelId={activePanelId} onSelect={navigateTo} />
          <SegmentFilter activePanelId={activePanelId} onSelect={navigateTo} />

          {/* Chart content area */}
          <div
            style={{
              flex: 1,
              background: '#080c1c',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Chart title */}
            <div
              style={{
                padding: titlePadding,
                color: '#c0d0e0',
                fontSize: titleFontSize,
                fontWeight: 600,
              }}
            >
              {panelMap.get(activePanelId)?.title ?? 'Dashboard'}
            </div>

            {/* Chart — ChartView centers and caps the chart size */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <ChartView
                panelId={activePanelId}
                width={chartWidth}
                height={Math.max(150, chartHeight - 40)}
                onNavigate={navigateTo}
              />
            </div>
          </div>

          <Breadcrumbs activePanelId={activePanelId} onSelect={navigateTo} />
        </div>
      </div>
    </div>
  )
}
