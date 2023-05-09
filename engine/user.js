import { BASE_URL } from './constants'
import { getSettings, post } from './utils'

export const biu = async (content) => {
  let { sendToId, userId } = await getSettings()
  if (!sendToId || !userId) {
    throw new Error('请先设置你自己和要发送的用户ID哦～')
  }
  await post(`${BASE_URL}/users/${sendToId}/biu`, { content, userId })
}
