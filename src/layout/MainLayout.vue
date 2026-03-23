<template>
	<a-layout style="min-height: 100vh">
		<a-layout-sider>侧边栏</a-layout-sider>
		<a-layout>
			<a-layout-header style="background: #fff; padding: 0">顶栏</a-layout-header>
			<a-layout-content style="margin: 16px">
				<div style="padding: 24px; background: #fff; min-height: 360px">
					<router-view/>
				</div>
			</a-layout-content>
		</a-layout>
	</a-layout>
</template>