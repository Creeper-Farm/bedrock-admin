<template>
	<div class="login-container">
		<div class="login-content">
			<div class="login-header">
				<div class="logo-area">
					<div class="logo-box">B</div>
					<span class="logo-text">Bedrock Admin</span>
				</div>
				<div class="desc">企业级中后台管理系统基础框架</div>
			</div>

			<a-card :bordered="false" class="login-card">
				<a-tabs v-model:activeKey="activeKey" centered>
					<a-tab-pane key="account" tab="账号密码登录">
						<a-form
							:model="loginState"
							layout="vertical"
							@finish="onFinish"
						>
							<a-form-item
								name="username"
								:rules="[{ required: true, message: '请输入用户名' }]"
							>
								<a-input v-model:value="loginState.username" size="large" placeholder="用户名: admin">
									<template #prefix>
										<user-outlined style="color: rgba(0,0,0,.25)"/>
									</template>
								</a-input>
							</a-form-item>

							<a-form-item
								name="password"
								:rules="[{ required: true, message: '请输入密码' }]"
							>
								<a-input-password v-model:value="loginState.password" size="large"
												  placeholder="密码: 123456">
									<template #prefix>
										<lock-outlined style="color: rgba(0,0,0,.25)"/>
									</template>
								</a-input-password>
							</a-form-item>

							<div class="login-form-ops">
								<a-checkbox v-model:checked="loginState.remember">自动登录</a-checkbox>
								<a class="login-form-forgot">忘记密码</a>
							</div>

							<a-form-item>
								<a-button
									type="primary"
									html-type="submit"
									size="large"
									block
									:loading="loading"
								>
									确定登录
								</a-button>
							</a-form-item>
						</a-form>
					</a-tab-pane>
				</a-tabs>
			</a-card>

			<div class="login-footer">
				Copyright © 2026 Creeper-Farm
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue';
import {UserOutlined, LockOutlined} from '@ant-design/icons-vue';
import {message} from 'ant-design-vue';
import {useUserStore} from '@/store/user';
import {useRouter, useRoute} from 'vue-router';
import {login} from '@/api/auth';

const activeKey = ref('account');
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const loading = ref(false);

const loginState = reactive({
	username: '',
	password: '',
	remember: true,
});

const onFinish = async (values: any) => {
	loading.value = true;
	try {
		const res = await login(values.username, values.password);
		const {accessToken, refreshToken} = res;

		userStore.setToken(accessToken, refreshToken);

		message.success('登录成功，欢迎回来！');

		const redirect = (route.query.redirect as string) || '/';
		await router.replace(redirect);
	} catch (error) {
		console.error('登录流程异常', error);
	} finally {
		loading.value = false;
	}
};
</script>

<style scoped>
.login-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	overflow: auto;
	/* 经典的 Ant Design 浅蓝色渐变背景 */
	background-color: #f0f2f5;
	background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TV2t91tODv97f9797.svg');
	background-repeat: no-repeat;
	background-position: center 110px;
	background-size: 100%;
}

.login-content {
	padding: 32px 0;
	flex: 1;
}

@media (min-width: 768px) {
	.login-content {
		padding: 112px 0 24px;
	}
}

.login-header {
	text-align: center;
	margin-bottom: 40px;
}

.logo-area {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 12px;
}

.logo-box {
	width: 44px;
	height: 44px;
	background: #1677ff;
	color: #fff;
	border-radius: 8px;
	font-size: 24px;
	font-weight: bold;
	line-height: 44px;
	margin-right: 16px;
}

.logo-text {
	font-size: 33px;
	color: rgba(0, 0, 0, 0.85);
	font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
	font-weight: 600;
	position: relative;
	top: 2px;
}

.desc {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.45);
	margin-top: 12px;
}

.login-card {
	width: 368px;
	margin: 0 auto;
	background: #fff;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	border-radius: 8px;
}

.login-form-ops {
	margin-bottom: 24px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.login-footer {
	text-align: center;
	padding: 24px;
	color: rgba(0, 0, 0, 0.45);
	font-size: 14px;
}

/* 覆盖 Tabs 底部边距 */
:deep(.ant-tabs-nav) {
	margin-bottom: 24px;
}
</style>