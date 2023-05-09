import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { SETTING_KEY } from './constants'

export const getSettings = async () => {
  const res = await AsyncStorage.getItem(SETTING_KEY)
  return JSON.parse(res) || {}
}
export const setSettings = async (params) => {
  await AsyncStorage.setItem(SETTING_KEY, JSON.stringify(params))
}

export const loveText = async () => {
  return await get('https://api.mcloc.cn/love')
}

export const get = async (url, params) => {
  try {
    const { data } = await axios.get(url, { params })
    return data
  } catch (e) {
    throw new Error(JSON.stringify(e?.response?.data) || e?.message)
  }
}

export const post = async (url, body) => {
  try {
    const { data } = await axios.post(url, body)
    return data
  } catch (e) {
    throw new Error(JSON.stringify(e?.response?.data) || e?.message)
  }
}
