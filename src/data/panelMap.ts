import { defaultPanels } from './mockData.ts'
import type { PanelConfig } from '../types/index.ts'

/** Quick lookup map: panelId → PanelConfig */
export const panelMap = new Map<string, PanelConfig>(
  defaultPanels.map((p) => [p.id, p])
)

/** Parent → sorted child panel IDs (same logic as 3D repo's DashboardScene) */
export const childMap = new Map<string, string[]>()
for (const p of defaultPanels) {
  if (!p.parentId) continue
  const siblings = childMap.get(p.parentId) ?? []
  siblings.push(p.id)
  childMap.set(p.parentId, siblings)
}
for (const [parentId, children] of childMap) {
  const parent = panelMap.get(parentId)
  children.sort((a, b) => {
    const pa = panelMap.get(a)!
    const pb = panelMap.get(b)!
    if (parent?.semantic.detailLevel === 0) return pa.semantic.processStep - pb.semantic.processStep
    return (pa.semantic.segment ?? 0) - (pb.semantic.segment ?? 0)
  })
}
