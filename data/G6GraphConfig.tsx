import type {G6Combo} from "@/components/graphCharts/graphTypes";
import G6 from "@antv/g6";

export const clientInfo = {
    clientType: "front-end",
    clientName: "ui",
    pubTopics: [],
    subTopics: [
        {
            value: "*"
        }
    ]
}

// 实例化 minimap 插件
const minimap = new G6.Minimap({
    size: [100, 100],
    className: 'minimap',
    type: 'delegate',
});

// 实例化Grid插件
const grid = new G6.Grid();

export const graphCombos: G6Combo[] = [
    {
        id: "Sensors",
        label: "Sensors",
        type: "rect"
    },
    // {
    //   id: "Topics",
    //   label: "Topics",
    //   type: "rect"
    // },
    {
        id: "Actors",
        label: "Actors",
        type: "rect"
    },
    {
        id: "Apps",
        label: "Apps",
        type: "rect"
    }
]

export const G6GraphConfig = {
    fitView: true,
    fitCenter: true,
    // fitViewPadding: [1, 1, 1, 1],
    animate: true,
    layout:{
        type: "dagre",
        rankdir: "LR",
        // workerEnabled: true
    },
    modes: {
        default: [
            {
                type: 'drag-canvas',
                scalableRange: 0.25
            },
            {
                type: 'zoom-canvas',
                minZoom: 0.8,
                maxZoom: 1.05
            },
            // 'drag-node',
            'activate-relations'

        ], // 允许放缩画布、拖拽节点
    },
    defaultEdge: {
        shape: 'polyline',
        style: {
            endArrow: true,
            lineWidth: 2,
            stroke: '#7090ff'
        }
    },
    plugins: [minimap, grid]
}