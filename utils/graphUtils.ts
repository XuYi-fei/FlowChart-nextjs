import type { GraphEdge, GraphNode } from '@/components/graphCharts/graphTypes'
import {
  changeUpdateStrategy,
  createDockerClient,
  getDataFlow,
  getDockerList,
  getGraph,
  keepAlive,
  registerClient,
} from '@/api/manage'
import { API_URL } from '@/api/apiConfig'
import { AxiosResponse } from 'axios'

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
      size = [200, 120]
      linkPoints['left'] = true
      linkPoints['right'] = true
      anchorPoints = [
        [0, 0.5],
        [1, 0.5],
      ]
      comboId = 'Sensors'
      break
    case 'topic':
      nodeType = 'modelRect'
      size = [200, 120]
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
      size = [200, 120]
      linkPoints['left'] = true
      linkPoints['right'] = true
      anchorPoints = [
        [0, 0.5],
        [1, 0.5],
      ]
      comboId = 'Actors'
      break
    case 'driver':
      nodeType = 'rect'
      size = [200, 120]
      linkPoints['left'] = true
      linkPoints['right'] = true
      anchorPoints = [
        [0, 0.5],
        [1, 0.5],
      ]
      comboId = 'Drivers'
      break
    case 'app':
    default:
      nodeType = 'circle'
      size = 200
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

// export const requestToChangeUpdateStrategy = async (
//   strategy: number
// ): Promise<AxiosResponse<unknown, unknown>> => {
//   return await changeUpdateStrategy(API_URL.changeUpdateStrategyURL, strategy)
// }

export const requestToUpdateClient = async (
  strategy: object
): Promise<AxiosResponse<unknown, unknown>> => {
  return await changeUpdateStrategy(API_URL.changeUpdateClientURL, strategy)
}

export const requestToCreateDockerClient = async (
  parameter: object
): Promise<AxiosResponse<unknown, unknown>> => {
  return await createDockerClient(API_URL.createDockerClientURL, parameter)
}

export const requestToGetDockerList = async (): Promise<AxiosResponse<unknown, unknown>> => {
  return await getDockerList(API_URL.getDockerList)
}

export const requestToKeepAlive = async (
  clientId: string
): Promise<AxiosResponse<unknown, unknown>> => {
  return await keepAlive(API_URL.keepAlive, clientId)
}
