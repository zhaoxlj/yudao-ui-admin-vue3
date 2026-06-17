import request from '@/config/axios'

export interface ProfileVO {
  id: number
  username: string
  nickname: string
  dept: {
    id: number
    name: string
  }
  roles: {
    id: number
    name: string
  }[]
  posts: {
    id: number
    name: string
  }[]
  email: string
  mobile: string
  sex: number
  avatar: string
  status: number
  remark: string
  loginIp: string
  loginDate: Date
  createTime: Date
}

export interface UserClientSecretVO {
  userId: number
  username: string
  clientSecret: string
  generateTime: Date
}

export interface UserProfileUpdateReqVO {
  nickname?: string
  email?: string
  mobile?: string
  sex?: number
  avatar?: string
}

// 查询用户个人信息
export const getUserProfile = () => {
  return request.get({ url: '/system/user/profile/get' })
}

// 修改用户个人信息
export const updateUserProfile = (data: UserProfileUpdateReqVO) => {
  return request.put({ url: '/system/user/profile/update', data })
}

// 用户密码重置
export const updateUserPassword = (oldPassword: string, newPassword: string) => {
  return request.put({
    url: '/system/user/profile/update-password',
    data: {
      oldPassword: oldPassword,
      newPassword: newPassword
    }
  })
}

// 查询当前用户的客户端密钥信息
export const getUserClientSecret = () => {
  return request.get({ url: '/system/user/profile/client-secret' })
}

// 生成客户端密钥
export const generateUserClientSecret = () => {
  return request.post({ url: '/system/user/profile/client-secret' })
}

// 重置客户端密钥
export const resetUserClientSecret = () => {
  return request.put({ url: '/system/user/profile/client-secret' })
}
