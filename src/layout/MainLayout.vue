<script setup lang="ts">
import {ref, computed} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useUserStore} from '@/store/user';
import {
  MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined,
  LogoutOutlined, ProfileOutlined, BellOutlined, SearchOutlined
} from '@ant-design/icons-vue';
import {Modal, message} from 'ant-design-vue';
import {logout} from "@/api/auth.ts";

const collapsed = ref(false);
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 动态生成面包屑
const breadcrumbs = computed(() => {
  return route.matched.filter(item => item.meta && item.meta.title);
});

// 退出登录逻辑
const handleLogout = () => {
  Modal.confirm({
    title: '提示',
    content: '确认退出当前系统吗？',
    onOk: async () => {
      await logout() // 调用退出登录接口
      userStore.clearToken();
      message.success('已安全退出');
      await router.replace('/login');
    },
  });
};

const userAvatar = ref('');
</script>

<template>
  <a-layout class="main-layout" style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">Bedrock</div>
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="header-container">
        <div class="header-left">
          <component
              :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined"
              class="trigger-icon"
              @click="() => (collapsed = !collapsed)"
          />
          <a-breadcrumb class="breadcrumb">
            <a-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
              {{ item.meta.title }}
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>

        <div class="header-right">
          <a-space size="middle">
            <span class="action-item"><search-outlined/></span>
            <a-badge :count="5" dot>
              <span class="action-item"><bell-outlined/></span>
            </a-badge>

            <a-dropdown>
              <div class="user-info">
                <a-avatar size="small" :src="userAvatar">
                  <template #icon>
                    <UserOutlined/>
                  </template>
                </a-avatar>
                <span class="username">管理员</span>
              </div>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="profile">
                    <template #icon>
                      <profile-outlined/>
                    </template>
                    个人设置
                  </a-menu-item>
                  <a-menu-divider/>
                  <a-menu-item key="logout" @click="handleLogout">
                    <template #icon>
                      <logout-outlined/>
                    </template>
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </div>
      </a-layout-header>

      <a-layout-content class="content-body">
        <router-view/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.header-container {
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
}

.trigger-icon {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
  margin-right: 24px;
}

.trigger-icon:hover {
  color: #1677ff;
}

.header-right {
  display: flex;
  align-items: center;
}

.action-item {
  font-size: 18px;
  cursor: pointer;
  padding: 0 12px;
  display: inline-block;
  transition: all 0.3s;
}

.action-item:hover {
  background: #f5f5f5;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 12px;
  transition: all 0.3s;
}

.user-info:hover {
  background: #f5f5f5;
}

.username {
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.85);
}

.content-body {
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
}
</style>