import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import {AntDesignVueResolver} from 'unplugin-vue-components/resolvers'

export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [
                AntDesignVueResolver({
                    importStyle: false, // 由于 ADVue 4.x 使用 CSS-in-JS，通常设为 false
                }),
            ],
        }),
    ],
    server: {
        host: '0.0.0.0', // 监听所有地址，包括局域网 IP
        port: 5173,      // 指定固定端口
        open: true       // 运行命令后自动在浏览器打开页面
    }
})