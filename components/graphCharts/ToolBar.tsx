'use client'
import React, { useState } from 'react'
import { Button, Upload, Tooltip, UploadProps } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

export default function ToolBar() {
  const [ifFileChosen, setIfFileChosen] = useState(false)
  const [filePath, setFilePath] = useState('')

  const props: UploadProps = {
    accept: '.py,.java,.sh,.cmd',
    listType: 'text',
    showUploadList: false,
    onChange: (info) => {
      if (info.file.status == 'uploading') {
      }
      console.log(info.file.status)
    },
  }
  return (
    <div className="flex justify-start">
      <Upload {...props}>
        <Button type="primary" icon={<UploadOutlined />}>
          选择脚本
        </Button>
      </Upload>
      <Tooltip title="prompt text" className="m-1.5">
        {ifFileChosen ? <span>已选择脚本:{filePath}</span> : <span>尚未选择需要执行的脚本</span>}
      </Tooltip>
    </div>
  )
}
