const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
const port = process.env.port || process.env.npm_config_port || 80 // 端口