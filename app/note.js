import React, { useRef, useState } from 'react'
import { Text, TouchableOpacity, StyleSheet, Alert, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { Stack, useRouter } from 'expo-router'
import { getNotes } from '../engine/note'
import dayjs from 'dayjs'

import { Animated } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { RectButton } from 'react-native-gesture-handler'
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

export default function Note() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const itemRefs = useRef({}).current
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const router = useRouter()

  const fetchNotes = async (page) => {
    try {
      const { items } = await getNotes(page, 20)
      return items
    } catch (e) {
      Alert.alert('提示', e?.message, [{ text: '确定' }])
      return []
    }
  }

  const renderFooter = () => {
    if (!isLoading) {
      return null
    }

    return (
      <View style={styles.footerContainer}>
        <Text style={styles.loadMoreText}>加载中...</Text>
      </View>
    )
  }

  const renderRightAction = (text, color, _id) => {
    const pressHandler = async () => {
      itemRefs[_id].close()
    }
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}
        >
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    )
  }
  const renderRightActions = (_id) => (
    <View
      style={{
        width: 64,
        flexDirection: 'row',
      }}
    >
      {renderRightAction('删除', '#dd2c00', _id)}
    </View>
  )
  const renderItem = ({ item }) => {
    return (
      <Swipeable
        key={item._id}
        ref={(ref) => (itemRefs[item._id] = ref)}
        renderRightActions={() => renderRightActions(item._id)}
      >
        <View style={styles.itemContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.itemTitle}>{item?.title || '未命名记事'}</Text>
            <View style={styles.headerRight}>
              <Text style={styles.itemTime}>
                {dayjs(item.createdAt).fromNow()}
              </Text>
              <AntDesign name='right' size={10} color='#00000066' />
            </View>
          </View>
          <View style={styles.itemTextContainer}>
            <Text
              lineBreakMode='tail'
              numberOfLines={3}
              style={styles.itemText}
            >
              {item.text}
            </Text>
          </View>
        </View>
      </Swipeable>
    )
  }

  const handleLoadMore = () => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    fetchNotes(page).then((newData) => {
      setIsLoading(false)
      if (newData.length > 0) {
        setPage(page + 1)
        setData([...data, ...newData])
      }
    })
  }

  const handleRefreshing = () => {
    if (isRefreshing) {
      return
    }
    setIsRefreshing(true)
    fetchNotes(1).then((newData) => {
      setIsRefreshing(false)
      if (newData.length > 0) {
        setPage(2)
        setData(newData)
      }
    })
  }

  const onAddNotePress = () => {
    router.push('add-note-modal')
  }

  const headerRight = () => {
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={onAddNotePress}>
        <AntDesign
          style={styles.headerRightButton}
          name='plus'
          size={24}
          color='black'
        />
      </TouchableOpacity>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTintColor: '#000',
          headerRight,
          headerBackTitleVisible: false,
          headerTitle: `记事本(${data.length})`,
        }}
      />
      <FlashList
        renderFooter={renderFooter}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        estimatedItemSize={200}
        refreshing={isRefreshing}
        onRefresh={handleRefreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    paddingTop: 5,
    paddingHorizontal: 10,
    height: 90,
  },
  headerRightButton: {
    padding: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTextContainer: {},
  itemText: {
    flexWrap: 'wrap',
    color: '#999',
  },
  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
  itemTitle: {
    fontWeight: 'bold',
  },
  itemTime: {
    color: '#00000066',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  footerContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadMoreText: {
    color: '#999',
  },
})
