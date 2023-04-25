import { Stack } from "expo-router"
import { FlashList } from "@shopify/flash-list"
import SettingItem from "../components/SettingItem"
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { useState } from "react"
import { setSettings, getSettings, loveText } from '../engine/utils'
import Toast from "react-native-root-toast"
const settingList = [
  {
    propName: 'message',
    title: '发送内容',
    description: '设置触发爱心将发送给对方的文字'
  },
  {
    propName: 'userId',
    title: '发送对象',
    description: '你的爱心将发送给该对象'
  }
]
function Setting() {
  const [modalVisible, setModalVisible] = useState(false)
  const [canClickRandomText, setCanClickRandomText] = useState(true)
  const [modalText, changeModalText] = useState('')
  let [currentSettingIndex, changeCurrentSettingIndex] = useState(0)
  const onItemPress = async (index) => {
    changeCurrentSettingIndex(index)
    const settings = await getSettings()
    changeModalText(settings[settingList[index].propName]);
    setModalVisible(true)
  }

  const onModalComplete = async () => {
    const settings = await getSettings()
    settings[settingList[currentSettingIndex].propName] = modalText
    await setSettings(settings)
    setModalVisible(false)
    Toast.show('设置成功', { duration: Toast.durations.SHORT })
  }

  const onRandomTextClick = () => {
    setCanClickRandomText(false)
    loveText().then(text => {
      changeModalText(text)
    }).finally(() => { setCanClickRandomText(true) })
  }

  return <>
    <Stack.Screen options={{ headerBackTitleVisible: false, headerTitle: '设置' }} />
    <FlashList
      data={settingList}
      renderItem={({ item, index }) => <SettingItem {...item} onItemPress={() => { onItemPress(index) }} />}
      estimatedItemSize={4}
    />
    <Modal
      animationType='slide'
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <TouchableWithoutFeedback style={styles.overlay} onPress={() => setModalVisible(false)}>
        <View style={styles.modalCenteredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeaderView}>
              <Text style={styles.modalTitle}>{settingList[currentSettingIndex].title}</Text>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={onModalComplete}>
                <Text style={styles.modalComplete}>完成</Text>
              </TouchableOpacity>
            </View>
            <TextInput textAlignVertical="top"
              placeholder="请输入..."
              returnKeyType='next'
              returnKeyLabel='换行'
              multiline={true}
              autoCapitalize='none'
              autoFocus={true}
              style={styles.modalTextInput}
              onChangeText={changeModalText}
              value={modalText} />
            {(currentSettingIndex == 0) &&
              <TouchableOpacity disabled={!canClickRandomText}
                activeOpacity={0.6}
                onPress={onRandomTextClick}
                style={styles.randomButton}>
                <Text style={styles.randomButtonText}>随机一条 {!canClickRandomText && "..."}</Text>
              </TouchableOpacity>}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  </>
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1
  },
  modalCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D3DCE6',
    paddingVertical: 10,
    height: 60,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingLeft: 20,
  },
  modalTitle: {
    fontSize: 16,
    color: '#000',
    padding: 10
  },
  modalTextInput: {
    padding: 20,
    paddingTop: 10,
    borderRadius: 10,
    height: 140,
  },
  modalComplete: {
    fontSize: 16,
    color: '#1D8CE0',
    height: 60,
    paddingHorizontal: 20,
    textAlignVertical: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '80%',
    height: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10
  },
  randomButton: {
    transform: [{ translateY: -30 }],
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  randomButtonText: {
    width: 70,
    height: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#475669'
  }
})

export default Setting

