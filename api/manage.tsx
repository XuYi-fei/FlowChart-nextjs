import { axios } from '../utils/request'
import type { AxiosResponse } from 'axios'
// import { ElMessage } from 'element-plus'

const api = {
  getUserInfo: '/getUserInfo',
}

export default api
export function registerClient(url: string, parameter: any) {
  return axios({
    headers: {
      'Content-Type': 'application/json',
    },
    url: url,
    method: 'post',
    data: parameter,
  })
}
// get
export function getGraph(url: string) {
  return axios({
    url: url,
    method: 'get',
  })
}

export function getDataFlow(url: string, parameter: any) {
  return axios({
    headers: {
      'Content-Type': 'application/json',
    },
    url: url,
    method: 'post',
    data: parameter,
  })
}
export function changeUpdateStrategy(url: string, parameter: object) {
  return axios({
    headers: {
      'Content-Type': 'application/json',
    },
    url: url,
    method: 'post',
    data: parameter,
  })
}

export function createDockerClient(url: string, parameter: object) {
  return axios({
    url: url,
    method: 'post',
    data: parameter,
  })
}

export function getDockerList(url: string) {
  return axios({
    headers: {
      'Content-Type': 'application/json',
    },
    url: url,
    method: 'get',
  })
}

export function keepAlive(url: string, clientId: string) {
  // console.log("clientId:", clientId)
  return axios({
    headers: {
      'Content-Type': 'application/json',
    },
    url: url,
    method: 'post',
    data: {
      clientId: clientId,
    }
  })
}
// deleteAction
export function deleteAction(url: string, parameter: any) {
  return axios({
    url: url,
    method: 'delete',
    params: parameter,
  })
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export function downFile(url: string, parameter: any): Promise<AxiosResponse<any, any>> {
  return axios({
    url: url,
    params: parameter,
    method: 'get',
    responseType: 'blob',
    timeout: 5 * 60 * 1000,
  })
}

/**
 * 下载文件 后台需要设置Content-Type
 * @param url 文件路径
 * @param fileName 文件名(名称.后缀，例如：表格.xlsx)
 * @param parameter
 * @returns {*}
 */
export function downloadFile(url: string, fileName: string, parameter: any): any {
  // if(!fileName || fileName.split(.))

  return downFile(url, parameter).then((data: any) => {
    if (!(data instanceof Blob)) {
      ElMessage.error('文件下载失败')
      return
    }
    if (data.size === 0) {
      ElMessage.error('文件下载失败')
      return
    }

    // const contentType = getContentType(fileName)
    const nav = window.navigator as any
    if (nav.msSaveBlob) {
      // nav.msSaveBlob(new Blob([data], { type: contentType }), fileName)
      nav.msSaveBlob(data, fileName)
    } else {
      // const fileUrl = window.URL.createObjectURL(new Blob([data], { type: contentType }))
      const fileUrl = window.URL.createObjectURL(data)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = fileUrl
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 下载完成移除元素
      window.URL.revokeObjectURL(fileUrl) // 释放掉blob对象
    }
  })
}
