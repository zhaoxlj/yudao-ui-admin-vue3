import request from '@/config/axios'

export interface AppClientUserVO {
  userId: number
  username: string
  nickname: string
  clientSecret?: string
  status: number
  createTime: Date
}

// 分页查询客户端用户
export const getAppClientUserPage = (params: any) => {
  return request.get({ url: '/system/app-client/page', params })
}

// 获取客户端用户详情
export const getAppClientUser = (userId: number) => {
  return request.get({ url: '/system/app-client/get', params: { userId } })
}

// 生成客户端密钥
export const generateClientSecret = (userId: number) => {
  return request.post({ url: '/system/app-client/generate-secret', params: { userId } })
}

// 重置客户端密钥
export const resetClientSecret = (userId: number) => {
  return request.put({ url: '/system/app-client/reset-secret', params: { userId } })
}

// 分配客户端角色
export const assignClientRole = (clientUserId: number, roleIds: number[]) => {
  return request.post({ url: '/system/app-client/assign-role', params: { clientUserId, roleIds } })
}
