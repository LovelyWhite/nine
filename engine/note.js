import dayjs from 'dayjs'
import { BASE_URL } from './constants'
import { get, getSettings, post } from './utils'

export const getNotes = async (page, perPage) => {
  const res = await get(`${BASE_URL}/notes`, {
    page,
    perPage,
    sort: '-_id',
  })
  let { userId } = await getSettings()
  res.items = res.items.map((e) => ({
    ...e,
    isOwner: userId === e.userId,
    createdAtText: dayjs(e.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    fromNow: dayjs(e.createdAt).fromNow(false),
  }))
  return res
}
export const changePrivate = async (noteId) => {
  return await post(`${BASE_URL}/notes/${noteId}/private`)
}
export const deleteNote = (noteId) => {}
export const addNote = async (params) => {
  await post(`${BASE_URL}/notes`, params)
}
