import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { BASE_URL, SETTING_KEY } from './constants'

export const getSettings = async () => {
  const res = await AsyncStorage.getItem(SETTING_KEY)
  return JSON.parse(res) || {}
}
export const setSettings = async (params) => {
  await AsyncStorage.setItem(SETTING_KEY, JSON.stringify(params))
}

export const biu = async (userId, message) => {
  if (!userId) {
    throw new Error('请先设置你要发送的用户哦～')
  }
  await axios.post(`${BASE_URL}/user/${userId}/biu`, { message })
}
export const loveText = async () => {
  let { data } = await axios.get('https://api.mcloc.cn/love')
  return data
}
