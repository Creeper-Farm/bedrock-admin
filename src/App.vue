<script setup lang="ts">
import {theme} from 'ant-design-vue';

const themeConfig = {
	algorithm: theme.defaultAlgorithm,
	token: {
		colorPrimary: '#1677ff',
		borderRadius: 6,
	},
};
</script>

<template>
	<a-config-provider :theme="themeConfig">
		<router-view/>
	</a-config-provider>
</template>