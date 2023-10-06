'use client'

import React, { useEffect } from 'react'
import { clientInfo, G6GraphConfig, graphCombos } from '@/data/G6GraphConfig'
import G6 from '@antv/g6'
import { G6Edge, G6Node, GraphEdge, GraphNode } from '@/components/graphCharts/graphTypes'
import {
  createEdge,
  createNodes,
  requestToRegister,
  requestToUpdateDataFlow,
  requestToUpdateGraph,
} from '@/utils/graphUtils'
import { Spin, message } from 'antd'
import { window } from '@probe.gl/env'

// Do some extra work to transform the graph data in
//    the response to the data used in G6
export const getGraphData = async () => {
  const graphNodes: Array<G6Node> = []
  const graphEdges: Array<G6Edge> = []
  let newGraphNodes: Array<GraphNode>
  let newGraphEdges: Array<GraphEdge>
  let graphData: any
  try {
    graphData = await requestToUpdateGraph()
    graphData.nodes.filter((node: any) => {
      return node.clientType != 'front-end'
    })
    newGraphNodes = graphData.nodes
    newGraphEdges = graphData.edges

    const nodes = newGraphNodes.map((node) => createNodes(node))
    const edges = newGraphEdges.map((edge, id) => createEdge(edge, id))
    graphNodes.splice(0)
    graphEdges.splice(0)
    graphNodes.push(...nodes)
    graphEdges.push(...edges)
    return { nodes: graphNodes, edges: graphEdges }
  } catch (e) {
    console.log('err', e)
    return {}
  }
}

// Register to the backend using {clientInfo} and receive a clientId
const register = async () => {
  let res: any
  try {
    res = await requestToRegister(clientInfo)
    console.log(res)
    return res.clientId
  } catch (e) {
    console.log(e)
    return ''
  }
}

// The core component to draw the diagram
export default function FlowChart() {
  const ref = React.useRef(null)
  const [ifLoading, setIfLoading] = React.useState(true)
  const [messageApi, contextHolder] = message.useMessage()
  let storeGraphEdges: G6Edge[] = []
  let storeClientId: string = ''
  let graph: any

  const success = (info) => {
    messageApi.open({
      type: 'success',
      content: info,
    })
  }
  const error = (info) => {
    messageApi.open({
      type: 'error',
      content: info,
    })
  }

  // Send the network request to get the new graph structure
  const updateGraph = async () => {
    const graphData: any = {}
    let combos: any = []
    // Send the request and get the response
    // Notice: It must be executed in sequence
    await getGraphData().then((res) => {
      graphData.nodes = res.nodes
      graphData.edges = res.edges
      combos = graphCombos
    })

    if (!graphData.nodes || !graphData.edges) {
      error('无法从服务器获取流程图数据')
      return true
    }
    // Get the nodes and edges from the response
    const graphNodes = graphData.nodes
    const graphEdges = graphData.edges
    storeGraphEdges = [...graphEdges]

    // Judge if the graph's nodes and edges change
    // Only refresh the graph if the graph's nodes and edges are different
    let graphChange = false
    for (let i = 0; i < graphNodes.length; i++) {
      if (!graph.findById(graphNodes[i].id)) {
        graphChange = true
        break
      }
    }
    if (graph.findAll('node', () => true) != graphNodes.length) graphChange = true

    const newData = {
      nodes: graphNodes,
      edges: graphEdges,
      combos: graphNodes.length === 0 ? [] : combos,
    }

    if (graphChange) {
      graph.changeData(newData)
      // graph.updateLayout()
    }
    return false
  }

  // Send the network request to get data flowing right now
  const updateData = async () => {
    const messages: any[] = []
    // In real system, the clientId is a must
    if (!storeClientId)
      await register().then((clientId) => {
        storeClientId = clientId
      })
    if (!storeClientId) {
      error('未初始化clientId')
      return
    }
    await requestToUpdateDataFlow(storeClientId).then((res) => {
      for (const msg of res.messages)
        messages.push({
          data: msg.data,
          publisherId: msg.publisherId,
          topic: { value: msg.topic.value },
        })
    })
    if (messages.length === 0) {
      error('无法获取数据流信息')
      return
    }
    const newEdges: G6Edge[] = [...storeGraphEdges]
    for (const message of messages) {
      const index = newEdges.findIndex(
        (edge) => edge.source === message.publisherId && edge.target === message.topic.value
      )
      if (index === -1 || graph.findById(newEdges[index].id) === -1) continue
      else {
        newEdges[index].label = message.data.toString()
        const id = newEdges[index].id
        const item = graph.findById(id)
        if (!item) continue
        graph.updateItem(item, newEdges[index])
      }
    }
  }

  // Actually it doesn't require useEffect, but graph needs to render after the DOM elements are created
  useEffect(() => {
    function handleResize() {
      graph.changeSize(window.innerWidth * 0.9, window.innerHeight * 0.8)
    }
    if (!graph) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      graph = new G6.Graph({
        ...G6GraphConfig,
        container: ref.current,
        width: window.innerWidth * 0.9,
        height: window.innerHeight * 0.75,
        animate: true,
      })
      // graph.render()
      updateGraph().then((res) => {
        if (!res) {
          success('获取图数据成功')
          setIfLoading(false)
        }
      })
      setTimeout(() => {
        graph.render()
      })

      // Update the graph structure and the flowing data periodically
      setInterval(() => {
        updateGraph()
      }, 2000)
      setInterval(() => {
        updateData()
      }, 600)
    }

    // Adjust the canvas size depending on the window
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      {contextHolder}
      <Spin tip="正在加载中" size="large" spinning={ifLoading}>
        <div ref={ref} className="overflow-scroll w-full grow flex-col"></div>
      </Spin>
    </>
  )
}
