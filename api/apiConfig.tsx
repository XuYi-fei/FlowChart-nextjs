export const BASE_URL: string = 'http://localhost:8080'
// export const BASE_URL: string = 'http://124.221.214.211:8080'

export const API_URL = {
  getGraphURL: '/platform/resource/graph',
  getDataFlowURL: '/platform/pubsub/listUnreadMessages',
  registerClient: '/platform/resource/register',
  changeUpdateStrategyURL: '/platform/strategy/update',
  changeUpdateClientURL: '/platform/application/update',
  createDockerClientURL: '/platform/application/create',
  deleteDockerClientURL: '/platform/application/destroy',
  getDockerList: '/platform/application/list',
  keepAlive: '/platform/resource/keepAlive',
}
