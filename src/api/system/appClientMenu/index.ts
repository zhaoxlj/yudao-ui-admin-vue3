import request from '@/config/axios'

export interface AppClientMenuVO {
  id: number
  name: string
  permission: string
  type: number
  sort: number
  parentId: number
  path: string
  icon: string
  component: string
  componentName?: string
  status: number
  visible: boolean
  keepAlive: boolean
  alwaysShow?: boolean
  createTime: Date
}

// 查询客户端菜单列表
export const getAppClientMenuList = () => {
  return request.get({ url: '/system/app-client/menu/list' })
}

// 获取客户端菜单精简列表
export const getAppClientSimpleMenuList = () => {
  return request.get({ url: '/system/app-client/menu/list-all-simple' })
}

// 获取客户端菜单详情
export const getAppClientMenu = (id: number) => {
  return request.get({ url: '/system/app-client/menu/get?id=' + id })
}

// 新增客户端菜单
export const createAppClientMenu = (data: AppClientMenuVO) => {
  return request.post({ url: '/system/app-client/menu/create', data })
}

// 修改客户端菜单
export const updateAppClientMenu = (data: AppClientMenuVO) => {
  return request.put({ url: '/system/app-client/menu/update', data })
}

// 删除客户端菜单
export const deleteAppClientMenu = (id: number) => {
  return request.delete({ url: '/system/app-client/menu/delete?id=' + id })
}
