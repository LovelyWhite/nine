import { Stack } from 'expo-router'
import { FlashList } from '@shopify/flash-list'
import SettingItem from '../components/SettingItem'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { useState } from 'react'
import { setSettings, getSettings, loveText } from '../engine/utils'
import { createdAt, fetchUpdateAsync } from 'expo-updates'
import Toast from 'react-native-root-toast'
const SETTING_LIST = {
  message: {
    type: 'textInput',
    title: '发送内容',
    description: '设置下一次将发送给对方的文字',
    showArrow: true,
  },
  sendToId: {
    type: 'textInput',
    title: '发送对象',
    description: '你的爱心将发送给该对象',
    showArrow: true,
  },
  userId: {
    type: 'textInput',
    title: '我的 ID',
    description: '设置自己的 ID',
    showArrow: true,
  },
  version: {
    type: 'normal',
    title: '版本更新推送时间',
    description: '点击手动更新至最新版本',
    extra: createdAt?.toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      hour12: false,
    }),
    showArrow: false,
  },
}
function Setting() {
  const [modalVisible, setModalVisible] = useState(false)
  const [settingList] = useState(SETTING_LIST)
  const [canClickRandomText, setCanClickRandomText] = useState(true)
  const [modalText, changeModalText] = useState('')
  let [selectedSetting, setSelectedSetting] = useState('message')

  const onItemPress = async (key) => {
    setSelectedSetting(key)
    const itemType = settingList[key].type
    if (itemType === 'textInput') {
      const settings = await getSettings()
      changeModalText(settings[key])
      setModalVisible(true)
      return
    }
    if (key === 'version') {
      Toast.show('开始更新~', { duration: Toast.durations.SHORT })
      fetchUpdateAsync()
        .then((result) => {
          if (result.isNew == false) {
            Toast.show('已经是最新版本啦~', { duration: Toast.durations.SHORT })
            return
          }
          Toast.show('更新成功~', { duration: Toast.durations.SHORT })
        })
        .catch((err) => {
          Toast.show(err.message)
        })
    }
  }

  const onModalComplete = async () => {
    const settings = await getSettings()
    settings[selectedSetting] = modalText
    await setSettings(settings)
    setModalVisible(false)
    Toast.show('设置成功', { duration: Toast.durations.SHORT })
  }

  const onRandomTextClick = () => {
    setCanClickRandomText(false)
    loveText()
      .then((text) => {
        changeModalText(text)
      })
      .catch((e) => {
        Toast.show(e.message, { duration: Toast.durations.SHORT })
      })
      .finally(() => {
        setCanClickRandomText(true)
      })
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTintColor: '#000',
          headerBackTitleVisible: false,
          headerTitle: '设置',
        }}
      />
      <FlashList
        data={Object.keys(settingList)}
        renderItem={({ item }) => (
          <SettingItem
            item={settingList[item]}
            onItemPress={() => {
              onItemPress(item)
            }}
          />
        )}
        estimatedItemSize={4}
      />
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <View style={styles.modalView}>
                <View style={styles.modalHeaderView}>
                  <Text style={styles.modalTitle}>
                    {settingList[selectedSetting].title}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={onModalComplete}
                  >
                    <Text style={styles.modalComplete}>完成</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  textAlignVertical='top'
                  placeholder='请输入...'
                  multiline={true}
                  autoCapitalize='none'
                  autoFocus={true}
                  style={styles.modalTextInput}
                  onChangeText={changeModalText}
                  value={modalText}
                />
                {selectedSetting == 'message' && (
                  <TouchableOpacity
                    disabled={!canClickRandomText}
                    activeOpacity={0.6}
                    onPress={onRandomTextClick}
                    style={styles.randomButton}
                  >
                    <Text style={styles.randomButtonText}>
                      随机一条 {!canClickRandomText && '...'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  overlay: {
    justifyContent: 'flex-end',
    backgroundColor: '#000',
  },
  modalHeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D3DCE6',
    paddingVertical: 10,
    height: 50,
    paddingLeft: 20,
  },
  modalTitle: {
    fontSize: 16,
    color: '#000',
  },
  modalTextInput: {
    padding: 20,
    paddingTop: 10,
    height: 150,
  },
  modalComplete: {
    fontSize: 16,
    color: '#1D8CE0',
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  modalView: {
    backgroundColor: 'white',
    alignSelf: 'center',
    width: '100%',
    height: 200,
  },
  randomButton: {
    transform: [{ translateY: -50 }],
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  randomButtonText: {
    width: 100,
    height: 50,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 50,
    color: '#475669',
  },
})

export default Setting
