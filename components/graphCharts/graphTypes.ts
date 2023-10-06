interface Tag {
    path: string,
    name: string,
    title: string,
}

interface GraphNode{
    id: string,
    clientType: string,
    name: string
}

interface GraphEdge{
    to: string,
    from: string
}

interface GraphData{
    nodes: GraphNode,
    edges: GraphEdge
}

interface Graph {
    node: Array<GraphNode>,
    edge: Array<GraphEdge>,
}

interface G6Node{
    id: string,
    size?: any,
    description?: string,
    type: string,
    label: string,
    linkPoints: any,
    anchorPoints: number[][]
    comboId?: string,
    x?: number,
    y?: number,
}

interface  G6Edge{
    id: string,
    source: string,
    target: string,
    labelCfg?: any,
    label?: string,
}

interface G6Combo{
    id: string,
    label: string,
    type: string
}

interface NodePosition{
    x:{
        [key: string]: number,
    },
    y: {
        [key: string]: number,
    }
}

export type {Tag, NodePosition, G6Node, G6Edge, GraphNode, GraphEdge, Graph, GraphData, G6Combo}