'use client'
import React, { useEffect, useState } from 'react'
import { AvailableDocker } from '@/data/BackendConfig'
import {
  Radio,
  Tooltip,
  Dropdown,
  Popconfirm,
  Space,
  message,
  Spin,
  RadioChangeEvent,
  Select,
  Button,
  Form,
  SelectProps,
  Input,
} from 'antd'
import type { MenuProps } from 'antd'
import { CheckCircleTwoTone, InfoCircleTwoTone, RightCircleTwoTone } from '@ant-design/icons'
import { requestToCreateDockerClient } from '@/utils/graphUtils'
import Strategy from '@/components/graphCharts/Strategy'

interface CreateClientValue {
  name?: string
  version?: string
  healthCheckPort?: number
}

interface CreateClient {
  value?: CreateClientValue
  onChange?: (value: CreateClientValue) => void
}

// const items: MenuProps['items'] = AvailableDocker.map((item, index) => {
//   const dockerConfig = AvailableDocker.filter((childItem) => item.name == childItem.name)[0]
//   // @ts-ignore
//   return {
//     key: index.toString(),
//     label: item.name,
//     children: dockerConfig.version.map((version, childIndex) => ({
//       key: index.toString() + '-' + childIndex.toString(),
//       label: version,
//     })),
//   }
// })

// Just show the latest item.
export default function ToolBar() {
  const [loading, setLoading] = useState(false)
  const [chosenDockerConfig, setChosenDockerConfig] = useState({ name: '', version: '' })
  // const [openConfirm, setOpenConfirm] = useState(false)
  // const [confirmLoading, setConfirmLoading] = useState(false)
  // const [cancelLoading, setCancelLoading] = useState(false)
  const [dockerImage, setDockerImage] = useState('')
  const [port, setPort] = useState(0)
  // Some information to inform
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()
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

  const onDockerImageChange = (newDockerImage: string) => {
    form.setFieldValue('version', '')
    const port = AvailableDocker.filter((e) => e.name === newDockerImage)[0].port || 0
    if (port) form.setFieldValue('healthCheckPort', port)
    setDockerImage(newDockerImage)
  }

  const onPortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPort = parseInt(e.target.value || '0', 10)
    if (Number.isNaN(newPort)) return
    setPort(newPort)
  }

  const dockerImages = AvailableDocker.map((e) => e.name)
  const dockerImageOptions: SelectProps['options'] = dockerImages.map((e) => {
    return {
      value: e,
      label: e,
    }
  })

  const dockerVersions = AvailableDocker.filter((e) => e.name === dockerImage)[0]
  const dockerVersionOptions: SelectProps['options'] = dockerVersions
    ? dockerVersions.version.map((e) => {
        return {
          value: e,
          label: e,
        }
      })
    : []

  // const onClick: MenuProps['onClick'] = ({ key }) => {
  //   const keys = key.split('-')
  //   const firstKey = Number(keys[0])
  //   const secondKey = Number(keys[1])
  //   // @ts-ignore
  //   const result = {
  //     // @ts-ignore
  //     name: items[firstKey].label,
  //     // @ts-ignore
  //     version: items[firstKey].children[secondKey].label,
  //   }
  //   // @ts-ignore
  //   setChosenDockerConfig(result)
  // }

  // const submitDocker = () => {
  //   setOpenConfirm(true)
  // }

  // const confirmSubmitDockerConfig = () => {
  //   console.log(`${chosenDockerConfig}`)
  //   if (!chosenDockerConfig.name || !chosenDockerConfig.version) {
  //     error('请先选择需要创建的Docker配置')
  //   } else {
  //     chosenDockerConfig['port'] = 18001
  //     setCancelLoading(true)
  //     setConfirmLoading(true)
  //     console.log(chosenDockerConfig)
  //     requestToCreateDockerClient(chosenDockerConfig)
  //       .then((res) => {
  //         if (res) {
  //           success('Docker client 创建成功')
  //         } else {
  //           error('创建失败')
  //         }
  //       })
  //       .catch((e) => {
  //         error(e.toString())
  //       })
  //       .finally(() => {
  //         setConfirmLoading(false)
  //         setCancelLoading(false)
  //       })
  //   }
  // }
  const onValuesChange = (changedValues, values) => {
    console.log(changedValues, values)
  }

  const onFinish = async (values: any) => {
    console.log('values', values)
    setLoading(true)
    let i = 0
    while (i < 3) {
      await requestToCreateDockerClient(values)
        .then((res) => {
          if (res) {
            i += 4
            success('Docker client 创建成功')
          } else {
            if (i > 3) {
              error('创建失败')
              setLoading(false)
            }
            i++
          }
        })
        .catch((e) => {
          i++
          setLoading(false)
          error(e.toString())
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  return (
    <>
      {contextHolder}
      <div className="flex justify-start">
        <InfoCircleTwoTone />
        <Space>
          <Tooltip title="prompt text" className="m-2 grow flex flex-col justify-center">
            <span className="font-bold" style={{ minWidth: '100px' }}>
              容器创建
            </span>
          </Tooltip>
          <div className="p-2">
            <Space>
              <Form
                name="createDockerForm"
                onFinish={onFinish}
                form={form}
                onValuesChange={onValuesChange}
              >
                <div>
                  <Form.Item noStyle>
                    <Space>
                      <Form.Item name="name" label="docker image" rules={[{ required: true }]}>
                        <Select
                          placeholder="选择可用的Docker Image"
                          style={{ width: 250, margin: '0 8px' }}
                          options={dockerImageOptions}
                          onChange={onDockerImageChange}
                        ></Select>
                      </Form.Item>
                    </Space>
                  </Form.Item>
                </div>

                <div>
                  <Form.Item noStyle style={{ display: 'block' }}>
                    <Space>
                      <Form.Item name="version" label="docker version" rules={[{ required: true }]}>
                        <Select
                          placeholder="镜像Version"
                          style={{ width: 150, margin: '0 8px' }}
                          options={dockerVersionOptions}
                        ></Select>
                      </Form.Item>
                      <Form.Item label="端口" name="healthCheckPort">
                        <Input
                          type="number"
                          value={port}
                          onChange={onPortChange}
                          style={{ width: 80, margin: '0 8px' }}
                        />
                      </Form.Item>
                      <Form.Item>
                        {/*<Popconfirm*/}
                        {/*  title="注意"*/}
                        {/*  description="确定根据配置创建Docker吗？"*/}
                        {/*  open={openConfirm}*/}
                        {/*  cancelText="取消"*/}
                        {/*  okText="确定"*/}
                        {/*  onConfirm={confirmSubmitDockerConfig}*/}
                        {/*  onCancel={() => {*/}
                        {/*    setConfirmLoading(false)*/}
                        {/*    setOpenConfirm(false)*/}
                        {/*  }}*/}
                        {/*  okButtonProps={{ loading: confirmLoading }}*/}
                        {/*  cancelButtonProps={{ disabled: cancelLoading }}*/}
                        {/*>*/}
                        <Button loading={loading} htmlType="submit" type="primary">
                          创建client
                        </Button>
                        {/*<Dropdown.Button*/}
                        {/*  type="primary"*/}
                        {/*  loading={loading}*/}
                        {/*  menu={{ items, onClick }}*/}
                        {/*  onClick={submitDocker}*/}
                        {/*>*/}
                        {/*  点击提交name与version以进行容器创建*/}
                        {/*</Dropdown.Button>*/}
                        {/*</Popconfirm>*/}
                      </Form.Item>
                    </Space>
                  </Form.Item>
                </div>
              </Form>
            </Space>
          </div>
          {chosenDockerConfig.name ? (
            <div className="p-0.5 bg-gray-100 rounded-md shadow-md">
              <Tooltip title="prompt text" className="m-1 grow mt-2 text-gray-600">
                <p>
                  <span className="font-bold">已选择容器: </span>
                  <span className="underline-offset-1 underline">
                    name: {chosenDockerConfig.name}; version: {chosenDockerConfig.version}
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
        {/*<Space>*/}
        <InfoCircleTwoTone />

        <Tooltip title="prompt text" className="m-2 flex flex-col justify-center">
          <span className="font-bold" style={{ minWidth: '100px' }}>
            容器更新
          </span>
        </Tooltip>
        <Strategy></Strategy>
      </div>
    </>
  )
}
