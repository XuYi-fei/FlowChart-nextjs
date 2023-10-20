import React, { useEffect, useState } from 'react'
import { Button, Dropdown, Form, Input, message, Popconfirm, Select, Space } from 'antd'
import { AvailableDocker } from '@/data/BackendConfig'
const { Option } = Select
import type { SelectProps } from 'antd'
import { requestToGetDockerList, requestToUpdateClient } from '@/utils/graphUtils'
import { SyncOutlined } from '@ant-design/icons'

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
  const [clientId, setClientId] = useState('')
  const [dockerImage, setDockerImage] = useState('')
  const [dockerVersion, setDockerVersion] = useState('')
  const [port, setPort] = useState(0)
  const [spinLoading, setSpinLoading] = useState(false)

  const onClientIdChange = (newClientId: string) => {
    setClientId(newClientId)
  }
  const onDockerImageChange = (newDockerImage: string) => {
    setDockerImage(newDockerImage)
  }
  const onDockerVersionChange = (newDockerVersion: string) => {
    // setDockerVersion(newDockerVersion)
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
          label: e['id'],
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
      console.log('clientIdList', res['applications'])
      setClientIdList(res['applications'])
    })
  }

  const onFinish = (values: UpdateClient) => {
    console.log('values', values)
    setUpdateLoading(true)
    // setKey(key + 1)
    requestToUpdateClient(values['updateForm'])
      .then((res) => {
        setUpdateLoading(false)
        success('更新成功')
        updateList()
      })
      .catch((e) => {
        error(e.toString())
      })
  }

  useEffect(() => {
    // @ts-ignore
    updateList()
  }, [])

  return (
    <div className="flex flex-col p-4 grow">
      {contextHolder}
      <Form
        name="UpdateClientForm"
        onFinish={onFinish}
        onValuesChange={(changedValues, values) => {
          console.log(changedValues, values)
        }}
        initialValues={{
          strategy: 'default',
          port: 8080,
        }}
      >
        <div>
          <Form.Item noStyle style={{ display: 'block' }}>
            <Space>
              <Form.Item name="clientIdForm" label="clientId" rules={[{ required: true }]}>
                <Select
                  placeholder="请选择已创建的Client的ID"
                  style={{ width: 265, margin: '0 8px' }}
                  onChange={onClientIdChange}
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
            <Form.Item label="docker image" name="dockerImage" rules={[{ required: true }]}>
              <Select
                placeholder="选择可用的Docker Image"
                style={{ width: 225, margin: '0 8px' }}
                options={dockerImageOptions}
                onChange={onDockerImageChange}
              ></Select>
            </Form.Item>
            <Form.Item label="image version" name="dockerVersion" rules={[{ required: true }]}>
              <Select
                placeholder="镜像Version"
                style={{ width: 150, margin: '0 8px' }}
                onChange={onDockerVersionChange}
                options={dockerVersionOptions}
              ></Select>
            </Form.Item>
          </Space.Compact>
        </Form.Item>
        <div>
          <Form.Item noStyle>
            <Space.Compact>
              <Form.Item label="端口" name="port">
                <Input
                  type="number"
                  value={port}
                  onChange={onPortChange}
                  style={{ width: 80, margin: '0 8px' }}
                />
              </Form.Item>
              <Form.Item label="更新策略" name="strategy">
                <Select
                  placeholder="选择更新策略"
                  style={{ width: 150, margin: '0 8px' }}
                  onChange={onDockerVersionChange}
                >
                  <Option value="default">default</Option>
                  <Option value="blue-green">blue-green</Option>
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
  )
}
