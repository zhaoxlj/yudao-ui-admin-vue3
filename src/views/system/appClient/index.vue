<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="用户名称" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入用户名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" />搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" />重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="用户名称" align="center" prop="username" />
      <el-table-column label="用户昵称" align="center" prop="nickname" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" width="280">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="handleResetSecret(scope.row.userId)"
            v-hasPermi="['system:app-client:reset-secret']"
          >
            重置密钥
          </el-button>
          <el-button
            link
            type="primary"
            @click="handleAssignRole(scope.row.userId)"
            v-hasPermi="['system:app-client:assign-role']"
          >
            分配角色
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 密钥展示对话框 -->
  <Dialog v-model="secretDialogVisible" title="客户端密钥" width="600px">
    <el-alert
      title="请妥善保管此密钥，关闭后将无法再次查看！"
      type="warning"
      :closable="false"
      show-icon
      class="mb-20px"
    />
    <el-form label-width="100px">
      <el-form-item label="用户名称">
        <el-input v-model="secretData.username" disabled />
      </el-form-item>
      <el-form-item label="客户端密钥">
        <el-input v-model="secretData.clientSecret" readonly>
          <template #append>
            <el-button @click="copySecret">复制</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="生成时间">
        <el-input v-model="secretData.generateTime" disabled />
      </el-form-item>
    </el-form>
  </Dialog>

  <!-- 角色分配对话框 -->
  <Dialog v-model="roleDialogVisible" title="分配客户端角色" width="600px">
    <el-form v-loading="roleFormLoading" label-width="100px">
      <el-form-item label="用户名称">
        <el-input v-model="roleData.username" disabled />
      </el-form-item>
      <el-form-item label="角色列表">
        <el-select
          v-model="roleData.roleIds"
          multiple
          filterable
          placeholder="请选择角色"
          class="w-full"
        >
          <el-option
            v-for="role in roleList"
            :key="role.id"
            :label="role.name"
            :value="role.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="roleFormLoading" type="primary" @click="submitRoleForm">确 定</el-button>
      <el-button @click="roleDialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as AppClientApi from '@/api/system/appClient'
import * as AppClientRoleApi from '@/api/system/appClientRole'
import { useClipboard } from '@vueuse/core'

defineOptions({ name: 'AppClientUser' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  username: undefined,
  status: undefined
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AppClientApi.getAppClientUserPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 密钥相关 */
const secretDialogVisible = ref(false)
const secretData = ref({
  username: '',
  clientSecret: '',
  generateTime: ''
})

/** 重置密钥 */
const handleResetSecret = async (userId: number) => {
  try {
    await message.confirm('确定要重置客户端密钥吗？原密钥将失效！', '警告')
    const data = await AppClientApi.resetClientSecret(userId)
    secretData.value = {
      username: data.username,
      clientSecret: data.clientSecret,
      generateTime: data.generateTime
    }
    secretDialogVisible.value = true
    message.success('重置密钥成功')
  } catch {}
}

/** 复制密钥 */
const { copy } = useClipboard()
const copySecret = () => {
  copy(secretData.value.clientSecret)
  message.success('复制成功')
}

/** 分配角色 */
const roleDialogVisible = ref(false)
const roleFormLoading = ref(false)
const roleData = ref({
  userId: undefined as number | undefined,
  username: '',
  roleIds: [] as number[]
})
const roleList = ref<any[]>([])

const handleAssignRole = async (userId: number) => {
  roleDialogVisible.value = true
  roleFormLoading.value = true
  roleData.value = {
    userId,
    username: '',
    roleIds: []
  }
  try {
    // 加载用户信息
    const user = await AppClientApi.getAppClientUser(userId)
    roleData.value.username = user.username
    
    // 加载角色列表
    roleList.value = await AppClientRoleApi.getAppClientRoleList()
    
    // TODO: 加载已分配的角色
  } finally {
    roleFormLoading.value = false
  }
}

/** 提交角色分配 */
const submitRoleForm = async () => {
  if (!roleData.value.userId) return
  roleFormLoading.value = true
  try {
    await AppClientApi.assignClientRole(roleData.value.userId, roleData.value.roleIds)
    message.success('分配角色成功')
    roleDialogVisible.value = false
  } finally {
    roleFormLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
