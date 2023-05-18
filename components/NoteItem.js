import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native'
import Tooltip from 'rn-tooltip'
import { Feather, AntDesign } from '@expo/vector-icons'
import { MOODS } from '../engine/constants'
import { useEffect, useState } from 'react'
import { changePrivate } from '../engine/note'
import Toast from 'react-native-root-toast'
import { useRouter } from 'expo-router'

const NoteItem = ({ item }) => {
  const [isPrivate, setIsPrivate] = useState(item.isPrivate)
  const [showRef, setShowRef] = useState(false)
  const router = useRouter()
  useEffect(() => {
    setIsPrivate(item.isPrivate)
  }, [item])
  const onPrivateButtonPress = async () => {
    try {
      const { isPrivate } = await changePrivate(item._id)
      setIsPrivate(isPrivate)
    } catch (e) {
      Toast.show(e?.message, Toast.durations.SHORT)
    }
  }
  const onAddNotePress = () => {
    router.push('add-note-modal')
    router.setParams({ refNoteId: item._id, refNoteText: item.text })
  }
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeaderContainer}>
        <ScrollView
          style={{ flex: 1 }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <Text numberOfLines={1} style={styles.itemTitle}>
            {item?.title || '未命名记事'}
          </Text>
        </ScrollView>
        <Tooltip
          backgroundColor='#eeeeeeaa'
          width={200}
          popover={
            <Text style={{ color: '#646464', width: 200, textAlign: 'center' }}>
              {item.createdAtText}
            </Text>
          }
        >
          <Text style={styles.itemTime}>{item.fromNow}</Text>
        </Tooltip>
      </View>
      <TouchableWithoutFeedback
        activeOpacity={0.5}
        onLongPress={onAddNotePress}
      >
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemText}>{item.text}</Text>
        </View>
      </TouchableWithoutFeedback>
      {item.refNoteId && (
        <View style={styles.itemRefContainer}>
          <TouchableOpacity
            style={styles.itemRefButton}
            activeOpacity={0.5}
            onPress={() => {
              setShowRef(!showRef)
            }}
          >
            <AntDesign
              name={showRef ? 'down' : 'right'}
              size={12}
              color='#64646499'
            />
            <Text style={styles.itemRefButtonText}>引用内容</Text>
          </TouchableOpacity>
          {showRef && (
            <View style={styles.itemRefTextContainer}>
              <Text style={styles.itemRefText}>{item?.refNote?.text}</Text>
            </View>
          )}
        </View>
      )}
      <View style={styles.itemFooterContainer}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.itemMoodsContainer}
        >
          {item?.moods?.map((mood) => (
            <Tooltip
              key={item._id + mood}
              backgroundColor='#eeeeeeee'
              width={50}
              popover={
                <Text style={{ color: '#646464' }}>
                  {MOODS[mood].translate}
                </Text>
              }
            >
              <Text style={styles.itemMood}>{MOODS[mood].emoji}</Text>
            </Tooltip>
          ))}
        </ScrollView>
        <View style={styles.createrContainer}>
          <Text style={styles.createrText}>{item.userId}</Text>
          {item.isOwner ? (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                onPrivateButtonPress(item)
              }}
            >
              <Feather
                style={styles.privateButton}
                name={isPrivate ? 'eye-off' : 'eye'}
                size={14}
                color='#646464'
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  )
}
export default NoteItem

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    margin: 5,
    borderRadius: 10,
  },
  itemHeaderContainer: {
    marginTop: 10,
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 25,
  },
  itemTextContainer: {
    marginHorizontal: 15,
    marginBottom: 5,
  },
  itemText: {
    color: '#646464',
  },
  itemTitle: {
    fontWeight: 'bold',
  },
  itemTime: {
    fontWeight: 'bold',
    color: '#646464',
    textAlign: 'right',
    width: 70,
  },
  itemRefButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemRefButtonText: {
    marginLeft: 5,
    fontSize: 13,
    color: '#646464',
  },
  itemRefContainer: {
    paddingHorizontal: 10,
  },
  itemRefTextContainer: {
    marginHorizontal: 5,
    marginBottom: 5,
  },
  itemRefText: {
    fontSize: 12,
    color: '#707070cc',
  },
  itemFooterContainer: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#64646422',
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemMoodsContainer: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 5,
  },
  itemMood: {
    paddingRight: 2,
    fontSize: 15,
  },
  createrContainer: {
    height: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  createrText: {
    color: '#646464',
  },
  privateButton: {
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 0,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})
