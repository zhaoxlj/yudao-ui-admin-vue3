import request from '@/config/axios'

export interface AppClientRoleVO {
  id: number
  name: string
  code: string
  sort: number
  status: number
  remark?: string
  createTime: Date
}

// 获取客户端角色列表
export const getAppClientRoleList = () => {
  return request.get({ url: '/system/app-client/role/list' })
}

// 创建客户端角色
export const createAppClientRole = (data: AppClientRoleVO) => {
  return request.post({ url: '/system/app-client/role/create', data })
}

// 更新客户端角色
export const updateAppClientRole = (data: AppClientRoleVO) => {
  return request.put({ url: '/system/app-client/role/update', data })
}

// 删除客户端角色
export const deleteAppClientRole = (id: number) => {
  return request.delete({ url: '/system/app-client/role/delete?id=' + id })
}

// 分配角色菜单权限
export const assignRoleMenu = (roleId: number, menuIds: number[]) => {
  return request.post({ url: '/system/app-client/role/assign-menu', params: { roleId, menuIds } })
}

// 获取角色的菜单权限
export const getRoleMenus = (roleId: number) => {
  return request.get({ url: '/system/app-client/role/get-menus', params: { roleId } })
}
