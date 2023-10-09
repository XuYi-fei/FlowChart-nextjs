'use client'
import React, { useState } from 'react'
import { AvailableDocker } from '@/data/BackendConfig'
import { Radio, Tooltip, Dropdown, UploadProps, Space, message } from 'antd'
import type { MenuProps } from 'antd'
import { InfoCircleTwoTone, UploadOutlined } from '@ant-design/icons'

// const items: MenuProps['items'] = AvailableDocker.map((item, index) => ({
//   label: item.name,
//   key: index.toString(),
// }))
const items: MenuProps['items'] = AvailableDocker.map((item, index) => {
  const dockerConfig = AvailableDocker.filter((childItem) => item.name == childItem.name)[0]
  // @ts-ignore
  return {
    key: index.toString(),
    label: item.name,
    children: dockerConfig.tags.map((tag, childIndex) => ({
      key: index.toString() + '-' + childIndex.toString(),
      label: tag,
    })),
  }
})

// Just show the latest item.
export default function ToolBar() {
  const [ifFileChosen, setIfFileChosen] = useState(false)
  const [filePath, setFilePath] = useState('')
  const [loading, setLoading] = useState(false)
  const [chosenDockerConfig, setChosenDockerConfig] = useState('')
  const [subDropDownChoices, setSubDropDownChoices] = useState<MenuProps['items']>()

  const onClick: MenuProps['onClick'] = ({ key }) => {
    const keys = key.split('-')
    const firstKey = Number(keys[0])
    const secondKey = Number(keys[1])
    // @ts-ignore
    const result: sting = `name:${items[firstKey].label} tag:${items[firstKey].children[secondKey].label}`
    setChosenDockerConfig(result)
  }

  const onRadioChange = (e) => {
    console.log(e.target.value)
  }

  return (
    <>
      <div className="flex justify-start">
        <Space>
          <InfoCircleTwoTone />
          <Tooltip title="prompt text" className="m-2 grow">
            <span className="font-bold">请选择Docker容器的name与tag</span>
          </Tooltip>
          <div className="p-2">
            <Dropdown.Button type="primary" loading={loading} menu={{ items, onClick }}>
              提交name与tag以进行容器创建
            </Dropdown.Button>
          </div>
          {chosenDockerConfig ? (
            <div className="p-0.5 bg-gray-100 rounded-md shadow-md">
              <Tooltip title="prompt text" className="m-1 grow mt-2 text-gray-600">
                <p>
                  <span className="font-bold">已选择容器: </span>
                  <span className="underline-offset-1 underline">{chosenDockerConfig}</span>
                </p>
              </Tooltip>
            </div>
          ) : (
            <></>
          )}
        </Space>
      </div>
      <div className="flex justify-start">
        <Space>
          <InfoCircleTwoTone />
          <Tooltip title="prompt text" className="m-2 grow">
            <span className="font-bold">请选择更新策略</span>
          </Tooltip>
          <Radio.Group
            defaultValue="策略1"
            buttonStyle="solid"
            onChange={(e) => {
              onRadioChange(e)
            }}
          >
            <Radio.Button value="策略1">策略1</Radio.Button>
            <Radio.Button value="策略2">策略2</Radio.Button>
            <Radio.Button value="策略3">策略3</Radio.Button>
          </Radio.Group>
          {/*<Dropdown.Button type="primary" loading={loading} menu={{ subDropDownChoices }}>*/}
          {/*  Submit*/}
          {/*</Dropdown.Button>*/}
        </Space>
      </div>
    </>


  )
}
