import { useState, useMemo } from 'react'
import { defaultPanels } from '../data/mockData.ts'
import type { PanelConfig } from '../types/index.ts'

interface SidebarProps {
  activePanelId: string
  onSelect: (panelId: string) => void
}

interface TreeNode {
  panel: PanelConfig
  children: TreeNode[]
}

function buildTree(panels: PanelConfig[]): TreeNode[] {
  const map = new Map<string, TreeNode>()
  for (const panel of panels) {
    map.set(panel.id, { panel, children: [] })
  }
  const roots: TreeNode[] = []
  for (const panel of panels) {
    const node = map.get(panel.id)!
    if (panel.parentId && map.has(panel.parentId)) {
      map.get(panel.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }
  return roots
}

function TreeItem({
  node,
  activePanelId,
  onSelect,
  depth,
  expandedIds,
  toggleExpand,
}: {
  node: TreeNode
  activePanelId: string
  onSelect: (id: string) => void
  depth: number
  expandedIds: Set<string>
  toggleExpand: (id: string) => void
}) {
  const isActive = node.panel.id === activePanelId
  const hasChildren = node.children.length > 0
  const isExpanded = expandedIds.has(node.panel.id)

  return (
    <div>
      <div
        onClick={() => onSelect(node.panel.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          paddingLeft: 12 + depth * 16,
          cursor: 'pointer',
          background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
          borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
          color: isActive ? '#e0e8f0' : '#8090b0',
          fontSize: 13,
          transition: 'background 0.15s, color 0.15s',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        onMouseEnter={(e) => {
          if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(60, 80, 120, 0.1)'
        }}
        onMouseLeave={(e) => {
          if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'
        }}
      >
        {hasChildren && (
          <span
            onClick={(e) => { e.stopPropagation(); toggleExpand(node.panel.id) }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 16,
              height: 16,
              fontSize: 10,
              color: '#6080a0',
              flexShrink: 0,
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s',
            }}
          >
            &#9654;
          </span>
        )}
        {!hasChildren && <span style={{ width: 16, flexShrink: 0 }} />}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {node.panel.title}
        </span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeItem
              key={child.panel.id}
              node={child}
              activePanelId={activePanelId}
              onSelect={onSelect}
              depth={depth + 1}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ activePanelId, onSelect }: SidebarProps) {
  const tree = useMemo(() => buildTree(defaultPanels), [])

  // Auto-expand ancestors of active panel
  const ancestorIds = useMemo(() => {
    const ids = new Set<string>()
    const panelById = new Map(defaultPanels.map((p) => [p.id, p]))
    let current = panelById.get(activePanelId)
    while (current?.parentId) {
      ids.add(current.parentId)
      current = panelById.get(current.parentId)
    }
    return ids
  }, [activePanelId])

  const [manualExpanded, setManualExpanded] = useState<Set<string>>(new Set())

  const expandedIds = useMemo(() => {
    const merged = new Set(ancestorIds)
    for (const id of manualExpanded) merged.add(id)
    return merged
  }, [ancestorIds, manualExpanded])

  const toggleExpand = (id: string) => {
    setManualExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div
      style={{
        width: 220,
        minWidth: 220,
        height: '100%',
        background: '#0d1025',
        borderRight: '1px solid rgba(60, 80, 120, 0.2)',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingTop: 8,
        paddingBottom: 8,
      }}
    >
      {tree.map((node) => (
        <TreeItem
          key={node.panel.id}
          node={node}
          activePanelId={activePanelId}
          onSelect={onSelect}
          depth={0}
          expandedIds={expandedIds}
          toggleExpand={toggleExpand}
        />
      ))}
    </div>
  )
}
