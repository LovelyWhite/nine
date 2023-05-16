import { App } from 'expo-router/entry'
import { RootSiblingParent } from 'react-native-root-siblings'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
export default (
  <RootSiblingParent>
    <App />
  </RootSiblingParent>
)
