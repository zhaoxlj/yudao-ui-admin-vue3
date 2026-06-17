<template>
  <div v-if="!clientInfo" class="flex flex-col items-center justify-center h-full">
    <el-empty description="暂无客户端密钥" />
    <el-button type="primary" @click="handleGenerate">生成密钥</el-button>
  </div>
  <div v-else class="px-4">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="用户账号">{{ clientInfo.username }}</el-descriptions-item>
      <el-descriptions-item label="客户端密钥">
        <div class="flex items-center gap-2">
          <span class="font-mono">{{ clientInfo.clientSecret }}</span>
          <el-button link type="primary" @click="handleCopy">
            <Icon icon="ep:copy-document" />
          </el-button>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="生成时间">{{ formatDate(clientInfo.generateTime) }}</el-descriptions-item>
    </el-descriptions>
    <div class="mt-4">
      <el-button type="primary" @click="handleReset">重新生成密钥</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'
import {
  getUserClientSecret,
  generateUserClientSecret,
  resetUserClientSecret,
  UserClientSecretVO
} from '@/api/system/user/profile'
import { useClipboard } from '@vueuse/core'

defineOptions({ name: 'ClientSecret' })

const message = useMessage()
const { copy } = useClipboard()

const clientInfo = ref<UserClientSecretVO | null>(null)

const loadClientSecret = async () => {
  const data = await getUserClientSecret()
  clientInfo.value = data || null
}

const handleGenerate = async () => {
  try {
    await message.confirm('确定要生成客户端密钥吗？', '提示')
    const data = await generateUserClientSecret()
    clientInfo.value = data
    message.success('生成密钥成功')
  } catch {}
}

const handleReset = async () => {
  try {
    await message.confirm('确定要重新生成客户端密钥吗？原密钥将失效！', '警告')
    const data = await resetUserClientSecret()
    clientInfo.value = data
    message.success('重新生成密钥成功')
  } catch {}
}

const handleCopy = () => {
  if (clientInfo.value?.clientSecret) {
    copy(clientInfo.value.clientSecret)
    message.success('复制成功')
  }
}

onMounted(() => {
  loadClientSecret()
})
</script>
