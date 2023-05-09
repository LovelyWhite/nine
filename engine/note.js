import { BASE_URL } from './constants'
import { get, getSettings, post } from './utils'

export const getNotes = async (page, perPage) => {
  let { userId } = await getSettings()
  if (!userId) {
    throw new Error('请先设置我的 ID')
  }
  const res = await get(`${BASE_URL}/notes`, {
    page,
    perPage,
    userId,
    sort: '-_id',
  })
  return res
}
export const deleteNote = (noteId) => {}
export const addNote = async (params) => {
  let { userId } = await getSettings()
  if (!userId) {
    throw new Error('请先设置我的 ID')
  }
  await post(`${BASE_URL}/notes`, { ...params, userId })
}
