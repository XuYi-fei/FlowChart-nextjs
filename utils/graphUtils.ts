import type { GraphEdge, GraphNode } from '@/components/graphCharts/graphTypes'
import { getDataFlow, getGraph, registerClient } from '@/api/manage'
import { API_URL } from '@/api/apiConfig'

export const createNodes = (node: GraphNode) => {
  let nodeType: string
  let size: unknown
  const linkPoints = {
    fill: '#ffffff',
    stroke: '#7090ff',
  }
  let anchorPoints: number[][]
  let comboId: string
  switch (node.clientType) {
    case 'sensor':
      nodeType = 'ellipse'
      size = [120, 80]
      linkPoints['right'] = true
      anchorPoints = [[1, 0.5]]
      comboId = 'Sensors'
      break
    case 'topic':
      nodeType = 'modelRect'
      size = [150, 80]
      linkPoints['left'] = true
      linkPoints['right'] = true
      anchorPoints = [
        [0, 0.5],
        [1, 0.5],
      ]
      comboId = 'Topics'
      break
    case 'actor':
      nodeType = 'diamond'
      size = [150, 80]
      linkPoints['left'] = true
      anchorPoints = [
        [0, 0.5],
        [1, 0.5],
      ]
      comboId = 'Actors'
      break
    case 'app':
    default:
      nodeType = 'circle'
      size = 100
      linkPoints['left'] = true
      linkPoints['right'] = true
      anchorPoints = [
        [0, 0.5],
        [1, 0.5],
      ]
      comboId = 'Apps'
  }
  return {
    id: node.id,
    label: node.name,
    description: node.name,
    type: nodeType,
    size: size,
    linkPoints: linkPoints,
    anchorPoints: anchorPoints,
    comboId: comboId,
    style: {
      'font-size': 'xxx-large',
    },
  }
}

export const createEdge = (edge: GraphEdge, id: number) => {
  return {
    id: 'edge-' + id.toString(),
    source: edge.from,
    target: edge.to,
    labelCfg: {
      autoRotate: true,
      refY: 7.5,
    },
  }
}

export const requestToRegister = async (clientInfo: unknown): Promise<unknown> => {
  return await registerClient(API_URL.registerClient, clientInfo)
}

export const requestToUpdateGraph = async (): Promise<unknown> => {
  return await getGraph(API_URL.getGraphURL)
}

export const requestToUpdateDataFlow = async (clientId: string): Promise<unknown> => {
  return await getDataFlow(API_URL.getDataFlowURL, {
    clientId: clientId,
  })
}
