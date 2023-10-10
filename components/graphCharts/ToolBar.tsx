'use client'
import React, { useState } from 'react'
import { AvailableDocker } from '@/data/BackendConfig'
import { Radio, Tooltip, Dropdown, Popconfirm, Space, message, Spin, RadioChangeEvent } from 'antd'
import type { MenuProps } from 'antd'
import { CheckCircleTwoTone, InfoCircleTwoTone, RightCircleTwoTone } from '@ant-design/icons'
import { requestToChangeUpdateStrategy, requestToCreateDockerClient } from '@/utils/graphUtils'

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

const strategies = {
  '1': '策略1',
  '2': '策略2',
  '3': '策略3',
}

function StrategyChosenCase({ currentStrategyStatus, chosenStrategy }) {
  if (currentStrategyStatus == 'loading') {
    return (
      <>
        <Space className="mt-1">
          <Spin></Spin>
          <p className="mt-1 leading-2">
            {/*正在切换至<span className="font-bold">{chosenStrategy}</span>*/}
            正在切换策略
          </p>
        </Space>
      </>
    )
  } else if (currentStrategyStatus == 'loaded') {
    return (
      <>
        <Space className="mt-1">
          <CheckCircleTwoTone style={{ width: 20, marginTop: 5 }} />
          <p className="mt-1 leading-2">
            成功切换至<span className="font-bold">{chosenStrategy}</span>
          </p>
        </Space>
      </>
    )
  } else {
    return (
      <>
        <Space className="mt-1">
          <RightCircleTwoTone style={{ width: 20, marginTop: 5 }} />
          <p className="mt-1 leading-2">
            当前策略<span className="font-bold">{chosenStrategy}</span>
          </p>
        </Space>
      </>
    )
  }
}

// Just show the latest item.
export default function ToolBar() {
  const [loading, setLoading] = useState(false)
  const [chosenDockerConfig, setChosenDockerConfig] = useState({ name: '', tag: '' })
  const [loadingStrategy, setLoadingStrategy] = useState('current')
  const [chosenStrategyId, setStrategyId] = useState('1')
  const [openConfirm, setOpenConfirm] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  // Some information to inform
  const [messageApi, contextHolder] = message.useMessage()
  const error = (info) => {
    messageApi.open({
      type: 'error',
      content: info,
    })
  }
  const success = (info) => {
    messageApi.open({
      type: 'success',
      content: info,
    })
  }

  const onClick: MenuProps['onClick'] = ({ key }) => {
    const keys = key.split('-')
    const firstKey = Number(keys[0])
    const secondKey = Number(keys[1])
    // @ts-ignore
    const result = {
      // @ts-ignore
      name: items[firstKey].label,
      // @ts-ignore
      tag: items[firstKey].children[secondKey].label,
    }
    // @ts-ignore
    setChosenDockerConfig(result)
  }

  const submitDocker = () => {
    setOpenConfirm(true)
  }

  const confirmSubmitDockerConfig = () => {
    console.log(`${chosenDockerConfig}`)
    if (!chosenDockerConfig.name || !chosenDockerConfig.tag) {
      error('请先选择需要创建的Docker配置')
    } else {
      setCancelLoading(true)
      setConfirmLoading(true)
      requestToCreateDockerClient(chosenDockerConfig)
        .then((res) => {
          if (res) {
            success('Docker client 创建成功')
          } else {
            error('创建失败')
          }
        })
        .catch((e) => {
          error(e.toString())
        })
        .finally(() => {
          setConfirmLoading(false)
          setCancelLoading(false)
        })
    }
  }

  const onRadioChange = ({ target: { value } }: RadioChangeEvent) => {
    // console.log(value)
    setLoadingStrategy('loading')

    requestToChangeUpdateStrategy(value)
      .then((res) => {
        if (res) {
          setLoadingStrategy('loaded')
          setStrategyId(value)
          // setTimeout(() => {
          //   setLoadingStrategy('loaded')
          // }, 3000)
        } else {
          error('切换失败，请稍后再试')
          setLoadingStrategy('current')
        }
      })
      .catch((e) => error(e.toString()))
  }

  return (
    <>
      {contextHolder}
      <div className="flex justify-start">
        <Space>
          <InfoCircleTwoTone />
          <Tooltip title="prompt text" className="m-2 grow">
            <span className="font-bold">请选择Docker容器的name与tag</span>
          </Tooltip>
          <div className="p-2">
            <Popconfirm
              title="注意"
              description="确定根据配置创建Docker吗？"
              open={openConfirm}
              cancelText="取消"
              okText="确定"
              onConfirm={confirmSubmitDockerConfig}
              onCancel={() => {
                setConfirmLoading(false)
                setOpenConfirm(false)
              }}
              okButtonProps={{ loading: confirmLoading }}
              cancelButtonProps={{ disabled: cancelLoading }}
            >
              <Dropdown.Button
                type="primary"
                loading={loading}
                menu={{ items, onClick }}
                onClick={submitDocker}
              >
                点击提交name与tag以进行容器创建
              </Dropdown.Button>
            </Popconfirm>
          </div>
          {chosenDockerConfig.name ? (
            <div className="p-0.5 bg-gray-100 rounded-md shadow-md">
              <Tooltip title="prompt text" className="m-1 grow mt-2 text-gray-600">
                <p>
                  <span className="font-bold">已选择容器: </span>
                  <span className="underline-offset-1 underline">
                    name: {chosenDockerConfig.name}; tag: {chosenDockerConfig.tag}
                  </span>
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
            defaultValue="1"
            buttonStyle="solid"
            onChange={onRadioChange}
            disabled={loadingStrategy == 'loading'}
          >
            <Radio.Button value="1">策略1</Radio.Button>
            <Radio.Button value="2">策略2</Radio.Button>
            <Radio.Button value="3">策略3</Radio.Button>
          </Radio.Group>
          <StrategyChosenCase
            chosenStrategy={strategies[chosenStrategyId]}
            currentStrategyStatus={loadingStrategy}
          ></StrategyChosenCase>
        </Space>
      </div>
    </>
  )
}
