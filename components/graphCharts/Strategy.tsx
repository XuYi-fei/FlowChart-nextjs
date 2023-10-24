import React, { useEffect, useState } from 'react'
import { Button, Dropdown, Form, Input, message, Popconfirm, Select, Space, Tooltip } from 'antd'
import { AvailableDocker } from '@/data/BackendConfig'
const { Option } = Select
import type { SelectProps } from 'antd'
import { requestToGetDockerList, requestToUpdateClient } from '@/utils/graphUtils'
import { InfoCircleTwoTone, SyncOutlined } from '@ant-design/icons'

interface UpdateClientValue {
  clientId?: string
  dockerImage?: string
  dockerVersion?: string
  port?: number
  stategy?: string
}

interface UpdateClient {
  value?: UpdateClientValue
  onChange?: (value: UpdateClientValue) => void
}

export default function Strategy() {
  const [updateLoading, setUpdateLoading] = useState(false)
  const [clientIdList, setClientIdList] = useState([])
  const [dockerImage, setDockerImage] = useState('')
  const [port, setPort] = useState(0)
  const [spinLoading, setSpinLoading] = useState(false)
  const [form] = Form.useForm()

  const onDockerImageChange = (newDockerImage: string) => {
    const port = AvailableDocker.filter((e) => e.name === newDockerImage)[0].port || 0
    if (port) form.setFieldValue('newApplicationHealthCheckPort', port)
    setDockerImage(newDockerImage)
  }

  const onPortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPort = parseInt(e.target.value || '0', 10)
    if (Number.isNaN(newPort)) return
    setPort(newPort)
  }

  const onClickRefresh = () => {
    setSpinLoading(true)
    updateList()
    success('刷新成功')
    setSpinLoading(false)
  }

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

  const clientIdOptions: SelectProps['options'] = clientIdList
    ? clientIdList.map((e) => {
        return {
          value: e['id'],
          // @ts-ignore
          label: e['id'].substring(0, 4) + ' | ' + e['name'] + ' | ' + e['version'],
        }
      })
    : []
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

  const updateList = () => {
    requestToGetDockerList().then((res) => {
      setClientIdList(res['applications'])
    })
  }

  const onFinish = (values: UpdateClient) => {
    console.log('values', values)
    setUpdateLoading(true)
    // setKey(key + 1)
    requestToUpdateClient(values)
      .then((res) => {
        setUpdateLoading(false)
        success('更新成功')
        form.setFieldValue('oldApplicationId', '')
        updateList()
      })
      .catch((e) => {
        error(e.toString())
        setUpdateLoading(false)
      })
    // setInterval(() => {
    //   setSpinLoading(false)
    //   error('更新出错，请稍后再试')
    // }, 5000)
  }

  useEffect(() => {
    // @ts-ignore
    updateList()
  }, [])

  return (
    <>
      <InfoCircleTwoTone />

      <Tooltip title="prompt text" className="m-2 flex flex-col justify-center">
        <span className="font-bold" style={{ minWidth: '100px' }}>
          容器更新
        </span>
      </Tooltip>
      <div className="flex flex-col p-4 grow">
        {contextHolder}
        <Form
          form={form}
          name="UpdateClientForm"
          onFinish={onFinish}
          onValuesChange={(changedValues, values) => {
            console.log(changedValues, values)
            // if (changedValues['name']) values['version'] = ''
          }}
          initialValues={{
            updateStrategy: 0,
            newApplicationHealthCheckPort: 8080,
          }}
        >
          <div>
            <Form.Item noStyle style={{ display: 'block' }}>
              <Space>
                <Form.Item name="oldApplicationId" label="clientId" rules={[{ required: true }]}>
                  <Select
                    placeholder="请选择已创建的Client的ID"
                    style={{ width: 325, margin: '0 8px' }}
                    options={clientIdOptions}
                  ></Select>
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button
                      icon={<SyncOutlined spin={spinLoading} />}
                      onClick={onClickRefresh}
                    ></Button>
                    <spin>更新当前可用client</spin>
                  </Space>
                </Form.Item>
              </Space>
            </Form.Item>
          </div>
          <Form.Item noStyle>
            <Space.Compact>
              <Form.Item
                label="docker image"
                name="newApplicationName"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="选择可用的Docker Image"
                  style={{ width: 285, margin: '0 8px' }}
                  options={dockerImageOptions}
                  onChange={onDockerImageChange}
                ></Select>
              </Form.Item>
              <Form.Item
                label="image version"
                name="newApplicationVersion"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="镜像Version"
                  style={{ width: 150, margin: '0 8px' }}
                  options={dockerVersionOptions}
                ></Select>
              </Form.Item>
            </Space.Compact>
          </Form.Item>
          <div>
            <Form.Item noStyle>
              <Space.Compact>
                <Form.Item label="端口" name="newApplicationHealthCheckPort">
                  <Input
                    type="number"
                    value={port}
                    onChange={onPortChange}
                    style={{ width: 80, margin: '0 8px' }}
                  />
                </Form.Item>
                <Form.Item label="更新策略" name="updateStrategy">
                  <Select
                    placeholder="选择更新策略"
                    style={{ width: 150, margin: '0 8px' }}
                  >
                    <Option value={0}>default</Option>
                    <Option value={1}>blue-green</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={updateLoading}>
                    更新client
                  </Button>
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </div>
        </Form>
      </div>
    </>
  )
}
