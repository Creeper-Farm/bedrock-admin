<script setup lang="ts">
import {computed, onMounted, ref, watch, type Component} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useUserStore} from '@/store/user';
import * as Icons from '@ant-design/icons-vue';
import {Modal, message} from 'ant-design-vue';
import {logout} from "@/api/auth.ts";
import {queryUserInfo} from "@/api/user.ts";

// --- 状态管理 ---
const collapsed = ref(false);
const openKeys = ref<string[]>([]);
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 安全获取图标组件，解决 TS 报错
const getIcon = (iconName: any): Component => {
  const name = String(iconName || '');
  const icon = (Icons as Record<string, any>)[name];
  return (icon as Component) || Icons.FileOutlined;
};

// --- 逻辑计算 ---
const menuRoutes = computed(() => {
  const root = router.options.routes.find(r => r.path === '/');
  return root?.children?.filter(item => item.meta?.title && !item.meta.hidden) || [];
});

const selectedKeys = computed(() => [route.path]);

const breadcrumbs = computed(() => {
  return route.matched.filter(item => item.meta?.title);
});

// --- 交互逻辑 ---
const initMenuState = () => {
  const matched = route.matched;
  if (matched.length > 2) {
    const parentPath = matched[matched.length - 2].path;
    if (!openKeys.value.includes(parentPath)) {
      openKeys.value = [parentPath];
    }
  }
};

const fetchUserInfo = async () => {
  try {
    const data = await queryUserInfo();
    userStore.setUserInfo(data);
  } catch (e) {
    console.error('Fetch user info error:', e);
  }
};

const handleLogout = () => {
  Modal.confirm({
    title: '安全退出',
    content: '确认要退出 Bedrock Admin 系统吗？',
    centered: true,
    onOk: async () => {
      try {
        await logout();
      } finally {
        userStore.clearToken();
        message.success('已安全退出');
        await router.replace('/login');
      }
    },
  });
};

const onMenuClick = ({key}: { key: string }) => {
  if (route.path !== key) router.push(key);
};

onMounted(() => {
  fetchUserInfo();
  initMenuState();
});

watch(collapsed, (val) => {
  if (val) openKeys.value = [];
  else initMenuState();
});
</script>

<template>
  <a-layout class="main-layout">
    <a-layout-sider
        v-model:collapsed="collapsed"
        :trigger="null"
        collapsible
        width="240"
        class="sider-container"
    >
      <div class="logo-wrapper" @click="router.push('/')">
        <div class="logo-box">B</div>
        <transition name="logo-text-fade">
          <span v-if="!collapsed" class="logo-text">Bedrock Admin</span>
        </transition>
      </div>

      <a-menu
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
          theme="dark"
          mode="inline"
          class="menu-custom"
          @click="onMenuClick"
      >
        <template v-for="item in menuRoutes" :key="item.path">
          <a-sub-menu v-if="item.children && item.children.length > 0" :key="item.path">
            <template #icon>
              <component :is="getIcon(item.meta?.icon)"/>
            </template>
            <template #title>{{ item.meta?.title }}</template>
            <a-menu-item v-for="sub in item.children" :key="sub.path">
              {{ sub.meta?.title }}
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item v-else :key="item.path">
            <template #icon>
              <component :is="getIcon(item.meta?.icon)"/>
            </template>
            {{ item.meta?.title }}
          </a-menu-item>
        </template>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="header-main">
        <div class="header-left">
          <div class="trigger-icon" @click="collapsed = !collapsed">
            <Icons.MenuUnfoldOutlined v-if="collapsed"/>
            <Icons.MenuFoldOutlined v-else/>
          </div>
          <a-breadcrumb class="breadcrumb-align">
            <a-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
              <span :class="{ 'breadcrumb-last': index === breadcrumbs.length - 1 }">
                {{ item.meta.title }}
              </span>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>

        <div class="header-right">
          <a-space :size="4">
            <div class="header-action-item">
              <Icons.SearchOutlined/>
            </div>
            <div class="header-action-item">
              <a-badge :count="5" :offset="[-2, 6]" size="small">
                <Icons.BellOutlined style="font-size: 18px"/>
              </a-badge>
            </div>

            <a-dropdown placement="bottomRight" :arrow="{ pointAtCenter: true }">
              <div class="user-dropdown-trigger">
                <a-avatar size="small" :src="userStore.userInfo?.avatar">
                  <template #icon>
                    <Icons.UserOutlined/>
                  </template>
                </a-avatar>
                <span class="user-name">{{ userStore.userInfo?.username || 'root' }}</span>
                <Icons.DownOutlined class="arrow-icon"/>
              </div>
              <template #overlay>
                <a-menu class="user-menu">
                  <a-menu-item key="profile">
                    <Icons.ProfileOutlined/>
                    个人设置
                  </a-menu-item>
                  <a-menu-divider/>
                  <a-menu-item key="logout" danger @click="handleLogout">
                    <Icons.LogoutOutlined/>
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </div>
      </a-layout-header>

      <a-layout-content class="content-main">
        <router-view v-slot="{ Component }">
          <transition name="page-slide" mode="out-in">
            <div :key="route.path" class="page-card">
              <component :is="Component"/>
            </div>
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.main-layout {
  height: 100vh;
  overflow: hidden;
}

/* --- 侧边栏样式优化 --- */
:deep(.ant-layout-sider) {
  background: #001529; /* 统一色值 */
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.logo-wrapper {
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  background: #001529;
  cursor: pointer;
  overflow: hidden;
}

.logo-box {
  width: 32px;
  height: 32px;
  background: #1677ff;
  color: #fff;
  border-radius: 6px;
  font-size: 18px;
  font-weight: bold;
  line-height: 32px;
  text-align: center;
  flex-shrink: 0;
}

.logo-text {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin-left: 12px;
  white-space: nowrap;
}

.menu-custom {
  border: none;
  height: calc(100vh - 64px);
  overflow-y: auto;
}

/* --- 顶栏样式优化 --- */
.header-main {
  background: #fff;
  padding: 0 12px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 99;
}

.header-left {
  display: flex;
  align-items: center;
  height: 64px;
}

.trigger-icon {
  padding: 0 20px;
  font-size: 18px;
  height: 64px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.trigger-icon:hover {
  background: #f9f9f9;
  color: #1677ff;
}

.breadcrumb-align {
  display: flex;
  align-items: center;
  height: 64px;
}

.breadcrumb-last {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

/* --- 右侧用户信息区（核心修复） --- */
.header-right {
  margin-right: 12px;
  height: 64px;
  display: flex;
  align-items: center;
}

.header-action-item {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
  color: rgba(0, 0, 0, 0.65);
}

.user-dropdown-trigger {
  height: 40px; /* 限制高度，解决“过高”问题 */
  padding: 0 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
  margin-left: 4px;
}

.header-action-item:hover,
.user-dropdown-trigger:hover {
  background: rgba(0, 0, 0, 0.04);
}

.user-name {
  margin: 0 8px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.75);
  line-height: 1; /* 确保文字不偏移 */
}

.arrow-icon {
  font-size: 10px;
  color: #bfbfbf;
}

/* --- 内容区与动画 --- */
.content-main {
  background: #f0f2f5;
  padding: 16px;
  overflow-y: auto;
}

.page-card {
  min-height: 100%;
  background: #fff;
  padding: 24px;
  border-radius: 4px;
}

.logo-text-fade-enter-active {
  transition: opacity 0.3s;
}

.logo-text-fade-enter-from, .logo-text-fade-leave-to {
  opacity: 0;
}

.page-slide-enter-active, .page-slide-leave-active {
  transition: all 0.3s ease;
}

.page-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.page-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.user-menu {
  min-width: 150px;
}
</style>