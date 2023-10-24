'use client'
import React, { useEffect, useState } from 'react'
import { AvailableDocker } from '@/data/BackendConfig'
import { Tooltip, Space, message, Select, Button, Form, SelectProps, Input } from 'antd'
const { Option } = Select
import { InfoCircleTwoTone, SyncOutlined } from '@ant-design/icons'
import {
  requestToCreateDockerClient,
  requestToGetDockerList,
  requestToUpdateClient,
} from '@/utils/graphUtils'
import { deleteDockerList } from '@/api/manage'

interface CreateClientValue {
  name?: string
  version?: string
  healthCheckPort?: number
}

interface CreateClient {
  value?: CreateClientValue
  onChange?: (value: CreateClientValue) => void
}

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
interface DeleteClientValue {
  applicationId: string
}

interface DeleteClient {
  value?: DeleteClientValue
  onChange?: (value: DeleteClientValue) => void
}

// Just show the latest item.
export default function ToolBar() {
  const [loading, setLoading] = useState(false)
  // Create Docker variables
  const [dockerCreateImage, setCreateDockerImage] = useState('')
  const [createPort, setCreatePort] = useState(0)

  // Update Docker variables
  const [spinLoading, setSpinLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [dockerUpdateImage, setDockerImage] = useState('')
  const [updatePort, setUpdatePort] = useState(0)
  const [clientIdList, setClientIdList] = useState([])

  // Update Docker variables
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Some information to inform
  const [messageApi, contextHolder] = message.useMessage()
  const [formCreate] = Form.useForm()
  const [formUpdate] = Form.useForm()
  const [formDelete] = Form.useForm()
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
  const dockerImages = AvailableDocker.map((e) => e.name)
  // =======================
  // Create Docker Functions
  const onDockerCreateImageChange = (newDockerImage: string) => {
    formCreate.setFieldValue('version', '')
    const port = AvailableDocker.filter((e) => e.name === newDockerImage)[0].port || 0
    if (port) formCreate.setFieldValue('healthCheckPort', port)
    setCreateDockerImage(newDockerImage)
  }

  const onCreatePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPort = parseInt(e.target.value || '0', 10)
    if (Number.isNaN(newPort)) return
    setCreatePort(newPort)
  }

  const dockerCreateImageOptions: SelectProps['options'] = dockerImages.map((e) => {
    return {
      value: e,
      label: e,
    }
  })

  const dockerCreateVersions = AvailableDocker.filter((e) => e.name === dockerCreateImage)[0]
  const dockerCreateVersionOptions: SelectProps['options'] = dockerCreateVersions
    ? dockerCreateVersions.version.map((e) => {
        return {
          value: e,
          label: e,
        }
      })
    : []

  const onCreateFinish = async (values: any) => {
    console.log('values', values)
    setLoading(true)
    let i = 0
    while (i < 3) {
      await requestToCreateDockerClient(values)
        .then((res) => {
          if (res) {
            i += 4
            success('Docker client 创建成功')
            updateList()
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
  // =======================
  // Update Docker Functions
  const onDockerUpdateImageChange = (newDockerImage: string) => {
    const port = AvailableDocker.filter((e) => e.name === newDockerImage)[0].port || 0
    if (port) formUpdate.setFieldValue('newApplicationHealthCheckPort', port)
    setDockerImage(newDockerImage)
  }

  const onUpdatePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPort = parseInt(e.target.value || '0', 10)
    if (Number.isNaN(newPort)) return
    setUpdatePort(newPort)
  }

  const onClickRefresh = () => {
    setSpinLoading(true)
    updateList()
    success('刷新成功')
    setSpinLoading(false)
  }
  const dockerUpdateImageOptions: SelectProps['options'] = dockerImages.map((e) => {
    return {
      value: e,
      label: e,
    }
  })

  const dockerUpdateVersions = AvailableDocker.filter((e) => e.name === dockerUpdateImage)[0]
  const dockerUpdateVersionOptions: SelectProps['options'] = dockerUpdateVersions
    ? dockerUpdateVersions.version.map((e) => {
        return {
          value: e,
          label: e,
        }
      })
    : []

  const clientIdOptions: SelectProps['options'] = clientIdList
    ? clientIdList.map((e) => {
        return {
          value: e['id'],
          // @ts-ignore
          label: e['id'].substring(0, 4) + ' | ' + e['name'] + ' | ' + e['version'],
        }
      })
    : []
  const updateList = () => {
    requestToGetDockerList().then((res) => {
      setClientIdList(res['applications'])
    })
  }
  const onUpdateFinish = (values: UpdateClient) => {
    console.log('values', values)
    setUpdateLoading(true)
    // setKey(key + 1)
    requestToUpdateClient(values)
      .then((res) => {
        setUpdateLoading(false)
        success('更新成功')
        formUpdate.setFieldValue('oldApplicationId', '')
        updateList()
      })
      .catch((e) => {
        error(e.toString())
        setUpdateLoading(false)
      })
  }
  // =======================
  // Delete Docker Functions
  const onDeleteFinish = (values: DeleteClientValue) => {
    console.log('values', values)
    setDeleteLoading(true)
    deleteDockerList(values)
      .then((res) => {
        setDeleteLoading(false)
        success('删除成功')
        formDelete.setFieldValue('applicationId', '')
        updateList()
      })
      .catch((e) => {
        error(e.toString())
        setDeleteLoading(false)
      })
  }

  useEffect(() => {
    // @ts-ignore
    updateList()
  }, [])

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
                onFinish={onCreateFinish}
                form={formCreate}
                onValuesChange={(changedValues, values) => {
                  console.log(changedValues, values)
                }}
              >
                <div>
                  <Form.Item noStyle>
                    <Space>
                      <Form.Item name="name" label="docker image" rules={[{ required: true }]}>
                        <Select
                          placeholder="选择可用的Docker Image"
                          style={{ width: 250, margin: '0 8px' }}
                          options={dockerCreateImageOptions}
                          onChange={onDockerCreateImageChange}
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
                          options={dockerCreateVersionOptions}
                        ></Select>
                      </Form.Item>
                      <Form.Item label="端口" name="healthCheckPort">
                        <Input
                          type="number"
                          value={createPort}
                          onChange={onCreatePortChange}
                          style={{ width: 80, margin: '0 8px' }}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button loading={loading} htmlType="submit" type="primary">
                          创建client
                        </Button>
                      </Form.Item>
                    </Space>
                  </Form.Item>
                </div>
              </Form>
            </Space>
          </div>
        </Space>
      </div>
      {/**/}
      {/*UpdateClient*/}
      <div className="flex justify-start">
        <InfoCircleTwoTone />

        <Tooltip title="prompt text" className="m-2 flex flex-col justify-center">
          <span className="font-bold" style={{ minWidth: '100px' }}>
            容器更新
          </span>
        </Tooltip>
        <div className="flex flex-col p-4 grow">
          <Form
            form={formUpdate}
            name="UpdateClientForm"
            onFinish={onUpdateFinish}
            onValuesChange={(changedValues, values) => {
              console.log(changedValues, values)
            }}
            initialValues={{
              updateStrategy: 0,
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
                    options={dockerUpdateImageOptions}
                    onChange={onDockerUpdateImageChange}
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
                    options={dockerUpdateVersionOptions}
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
                      value={updatePort}
                      onChange={onUpdatePortChange}
                      style={{ width: 80, margin: '0 8px' }}
                    />
                  </Form.Item>
                  <Form.Item label="更新策略" name="updateStrategy">
                    <Select placeholder="选择更新策略" style={{ width: 150, margin: '0 8px' }}>
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
      </div>
      {/**/}
      {/*DeleteClient*/}
      <div className="flex justify-start">
        <InfoCircleTwoTone />

        <Tooltip title="prompt text" className="m-2 flex flex-col justify-center">
          <span className="font-bold" style={{ minWidth: '100px' }}>
            容器删除
          </span>
        </Tooltip>
        <div className="flex flex-col p-4 grow">
          <Form
            form={formDelete}
            name="DeleteClientForm"
            layout={'inline'}
            onFinish={onDeleteFinish}
            onValuesChange={(changedValues, values) => {
              console.log(changedValues, values)
            }}
          >
            <Form.Item name="applicationId" label="clientId" rules={[{ required: true }]}>
              <Select
                placeholder="请选择已创建的Client的ID"
                style={{ width: 325, margin: '0 8px' }}
                options={clientIdOptions}
              ></Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={deleteLoading}>
                删除client
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  )
}
