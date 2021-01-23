/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios')
const { name: projectName } = require('../../package.json')
const pluginName = 'WorkWechatMsgPlugin'

const isDebug = false

module.exports = class WorkWechatMsgPlugin {
  constructor({ key, watchTap = 'CosWebpack' } = {}) {
    this.key = key
  }
  apply(compiler) {
    compiler.hooks.entryOption.tap(pluginName, () => {
      this.workWechatMsg(`${projectName} 前端项目开始构建`).then()
    })
    compiler.hooks.done.tap(this.watchTap', () => {
      this.workWechatMsg(
        `${projectName} 前端项目构建完成，代码已上传完毕`
      ).then()
    })
    compiler.hooks.failed.tap(this.watchTap, () => {
      this.workWechatMsg(`${projectName} 前端项目构建失败`).then()
    })
  }

  async workWechatMsg(content = '') {
    if (isDebug) {
      console.log(content)
      return
    }

    const data = {
      msgtype: 'markdown',
      markdown: { content }
    }
    try {
      await axios({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        url: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${this.key}`,
        data
      })
    } catch (error) {
      console.error('workWechatMsg err', error)
    }
  }
}
