import { ConfigProvider, Divider } from 'antd'
import siteMetadata from '@/data/siteMetadata'
import FlowChart from '@/components/graphCharts/FlowChart'
// import {DownCircleTwoTone} from "@ant-design/icons";
import React from 'react'
import ToolBar from '@/components/graphCharts/ToolBar'

// const MAX_DISPLAY = 5

export default function Home() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700 basis-8">
        <div className="space-y-2 pb-2 pt-2 md:space-y-5">
          <h1 className="text-xl font-extrabold leading-4 tracking-tight text-gray-900 dark:text-gray-100 sm:text-xl sm:leading-4 md:text-xl md:leading-4">
            节点流程图展示
          </h1>
          <p className="text-lg leading-2 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>
        <ConfigProvider
          theme={{
            components: {
              Divider: {
                verticalMarginInline: 0,
                /* here is your component tokens */
              },
            },
          }}
        >
          <Divider></Divider>
        </ConfigProvider>
      </div>
      <ToolBar></ToolBar>
      <Divider dashed />
      <FlowChart></FlowChart>
    </>
  )
}
