import { Stack, useNavigation } from 'expo-router'
import React, { useCallback, useRef, useState } from 'react'
import Checkbox from 'expo-checkbox'
import {
  Alert,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { StyleSheet, Text } from 'react-native'
import { MOODS } from '../engine/constants'
import DropDownPicker from 'react-native-dropdown-picker'
import { addNote } from '../engine/note'

export default function AddNote() {
  let MOODS_LIST = []
  Object.keys(MOODS).forEach((e) => {
    MOODS_LIST.push({
      label: MOODS[e].translate,
      value: e,
      icon: () => <Text>{MOODS[e].emoji}</Text>,
    })
  })
  const [text, setText] = useState('')
  const [title, setTitle] = useState('')
  const [textCount, setTextCount] = useState(0)
  const [isPrivate, setIsPrivate] = useState(true)

  const [isMoodsPickerOpen, setIsMoodsPickerOpen] = useState(false)
  const [selectedMoods, setSelectedMoods] = useState(['happy'])
  const [moods, setMoods] = useState(MOODS_LIST)
  const [isCompleteDisabled, setCompleteDisabled] = useState(false)

  let titleRef = useRef(null).current
  const navigation = useNavigation()

  const onCompleteButtonPress = async () => {
    setCompleteDisabled(true)
    try {
      if (textCount == 0) {
        throw new Error('还没有输入任何内容哦～')
      }
      await addNote({
        title,
        moods: selectedMoods,
        isPrivate,
        text,
      })
      Alert.alert(
        '提示',
        '创建成功~',
        [{ text: '返回记事本', onPress: navigation.goBack }],
        { cancelable: false }
      )
    } catch (e) {
      Alert.alert('提示', e?.message, [{ text: '确定' }])
    } finally {
      setCompleteDisabled(false)
    }
  }

  const completeButton = () => {
    return (
      <TouchableOpacity
        disabled={isCompleteDisabled}
        activeOpacity={0.6}
        onPress={onCompleteButtonPress}
      >
        <Text style={styles.modalComplete}>
          创建{isCompleteDisabled ? '中...' : ''}
        </Text>
      </TouchableOpacity>
    )
  }
  const onTextInputChange = (text) => {
    setText(text)
    setTextCount(text.length)
  }
  return (
    <>
      <Stack.Screen
        options={{
          headerTintColor: '#000',
          headerBackTitleVisible: false,
          headerTitle: '创建笔记',
          headerRight: completeButton,
        }}
      />
      <TextInput
        autoCapitalize='none'
        placeholder='标题～'
        returnKeyType='next'
        onChangeText={setTitle}
        textAlignVertical='center'
        style={styles.titleInput}
        autoFocus={true}
        value={title}
        onSubmitEditing={() => titleRef.focus()}
        maxLength={30}
      />
      <TextInput
        ref={(ref) => (titleRef = ref)}
        style={styles.textInput}
        onChangeText={onTextInputChange}
        textAlignVertical='top'
        placeholder='请输入内容...'
        multiline={true}
        autoCapitalize='none'
        value={text}
        maxLength={500}
      />
      <View style={styles.textCounterContainer}>
        <Text style={styles.textCounter}>{`${textCount}/500`}</Text>
      </View>
      <TouchableWithoutFeedback
        onPress={() => {
          setIsMoodsPickerOpen(false)
        }}
      >
        <View style={styles.footer}>
          <View
            style={{
              width: '100%',
              position: 'absolute',
              backgroundColor: '#fff',
              height: 40,
            }}
          ></View>
          <View style={styles.moodsLabelContainer}>
            <Text style={styles.moodsLabel}>心情:</Text>
          </View>
          <View style={styles.moodsContainer}>
            <DropDownPicker
              hideSelectedItemIcon={true}
              placeholderStyle={{
                color: '#475669',
                textAlign: 'right',
              }}
              showBadgeDot={false}
              showArrowIcon={false}
              itemProps={{ activeOpacity: 0.6 }}
              props={{ activeOpacity: 0.6 }}
              open={isMoodsPickerOpen}
              flatListProps={{
                initialNumToRender: MOODS_LIST.length,
              }}
              style={{
                minHeight: 40,
                borderWidth: 0,
                borderRadius: 0,
                paddingHorizontal: 0,
                backgroundColor: '#00000000',
                paddingLeft: 10,
              }}
              value={selectedMoods}
              renderBadgeItem={({ IconComponent, props, value, onPress }) => {
                const __onPress = useCallback(() => {
                  if (selectedMoods.length === 1) {
                    return
                  }
                  onPress(value)
                }, [onPress, value])
                return (
                  <TouchableOpacity {...props} onPress={__onPress}>
                    {IconComponent()}
                  </TouchableOpacity>
                )
              }}
              items={moods}
              tickIconStyle={{ opacity: 0.6, width: 15, height: 15 }}
              dropDownContainerStyle={{
                borderRadius: 5,
                borderWidth: 0,
                alignSelf: 'flex-start',
                position: 'relative',
                top: 1,
                elevation: 1,
                shadowColor: '#000',
                shadowOffset: { height: 10, width: 1 },
                width: 120,
                shadowOpacity: 1,
                shadowRadius: 5,
              }}
              listMode='SCROLLVIEW'
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
              listItemContainerStyle={{
                height: 40,
              }}
              min={1}
              max={6}
              setOpen={setIsMoodsPickerOpen}
              setValue={setSelectedMoods}
              setItems={setMoods}
              multiple={true}
              mode='BADGE'
            />
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              setIsPrivate(!isPrivate)
            }}
          >
            <View style={styles.privateContainer}>
              <Checkbox
                style={styles.privateCheckbox}
                value={isPrivate}
                onValueChange={setIsPrivate}
                color={isPrivate ? '#1D8CE0' : undefined}
              />
              <Text style={styles.privateText}>仅自己可见</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </>
  )
}

const styles = StyleSheet.create({
  modalComplete: {
    fontSize: 18,
    padding: 5,
    color: '#1D8CE0',
  },
  textCounterContainer: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 150,
  },
  textCounter: {
    width: 60,
    height: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 40,
    color: '#47566977',
  },
  textInput: {
    backgroundColor: '#fff',
    height: 140,
    padding: 10,
    paddingBottom: 40,
    fontSize: 15,
    borderBottomWidth: 0.4,
    borderBottomColor: '#eeeeeeee',
  },
  titleInput: {
    backgroundColor: '#fff',
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    textAlignVertical: 'center',
    justifyContent: 'center',
  },
  moodsLabelContainer: {
    paddingLeft: 10,
    height: 40,
    justifyContent: 'center',
    marginRight: 5,
  },
  moodsLabel: {
    fontSize: 14,
    textAlignVertical: 'center',
    color: '#475669',
  },
  moodsContainer: {
    flex: 1,
  },
  privateContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
  },
  privateCheckbox: {
    width: 13,
    height: 13,
  },
  privateText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#475669',
  },
  footer: {
    flex: 1,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
})
