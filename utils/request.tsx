import axios from 'axios'
import { ElMessage } from 'element-plus'
import { BASE_URL } from '@/api/apiConfig'

// 创建 axios 实例
const service = axios.create({
  // baseURL: '/sys-api',// api base_url
  baseURL: BASE_URL, // api base_url
  timeout: 20000, // 请求超时时间
})

const err = (error: any) => {
  if (error.response) {
    switch (error?.response?.status) {
      case 403:
        console.log('403')
        break
      case 500:
        console.log('403')
        break
      case 404:
        console.log('404')
        break
      case 504:
        console.log('504')
        break
      case 401:
        console.log('401')
        break
      default:
        console.log('系统错误')
        break
    }
  } else if (error?.message) {
    console.log(error.message)
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(
  (config) => {
    // 让每个请求携带自定义 token 请根据实际情况自行修改
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use((response) => {
  return response.data
}, err)

export { service as axios }
