const axios = require('axios')

async function getWechatOpenId (code) {
  const appId = process.env.WECHAT_APPID
  const appSecret = process.env.WECHAT_SECRET

  try {
    const response = await axios.get('https://api.weixin.qq.com/sns/oauth2/access_token', {
      params: {
        appid: appId,
        secret: appSecret,
        code: code,
        grant_type: 'authorization_code'
      }
    })

    const { openid, access_token } = response.data

    // 如果你需要用户信息，可以再次调用微信接口
    const userInfoResponse = await axios.get('https://api.weixin.qq.com/sns/userinfo', {
      params: {
        access_token: access_token,
        openid: openid,
        lang: 'zh_CN'
      }
    })

    const userInfo = userInfoResponse.data

    return {
      openid: openid,
      nickname: userInfo.nickname,
      avatar: userInfo.headimgurl
    }

  } catch (error) {
    console.error('Error getting Wechat openid:', error)
    throw error
  }
}

module.exports = {
  getWechatOpenId,
}
