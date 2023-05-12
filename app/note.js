import React, { useRef, useState } from 'react'
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  View,
  ScrollView,
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { MasonryFlashList } from '@shopify/flash-list'
import Tooltip from 'rn-tooltip'
import { Stack, useRouter } from 'expo-router'
import { getNotes } from '../engine/note'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { MOODS } from '../engine/constants'
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

export default function Note() {
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const TextCountHeightRatio = useRef(1.1453).current

  const router = useRouter()

  const fetchNotes = async (page) => {
    try {
      const { items, total } = await getNotes(page, 10)
      setTotal(total)
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
  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemHeaderContainer}>
          <Text numberOfLines={1} style={styles.itemTitle}>
            {item?.title || '未命名记事'}
          </Text>
          <Tooltip
            backgroundColor='#eeeeeeaa'
            width={200}
            popover={
              <Text
                style={{ color: '#646464', width: 200, textAlign: 'center' }}
              >
                {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            }
          >
            <Text style={styles.itemTime}>
              {dayjs(item.createdAt).fromNow(false)}
            </Text>
          </Tooltip>
        </View>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemText}>{item.text}</Text>
        </View>
        <View style={styles.itemFooterContainer}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.itemMoodsContainer}
          >
            {item?.moods.map((mood) => (
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
          <Text style={styles.createrText}>
            From {item.userId}
            {item.isPrivate ? '*' : ''}
          </Text>
        </View>
      </View>
    )
  }

  const handleLoadMore = () => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    fetchNotes(page).then((newData) => {
      if (newData.length > 0) {
        setPage(page + 1)
        setData([...data, ...newData])
      }
      setIsLoading(false)
    })
  }

  const handleRefreshing = () => {
    if (isRefreshing) {
      return
    }
    setIsRefreshing(true)
    fetchNotes(1).then((newData) => {
      if (newData.length > 0) {
        setPage(2)
        setData(newData)
      }
      setIsRefreshing(false)
    })
  }

  const onAddNotePress = () => {
    router.push('add-note-modal')
  }

  const headerRight = () => {
    return (
      <TouchableOpacity activeOpacity={0.4} onPress={onAddNotePress}>
        <AntDesign
          style={styles.headerRightButton}
          name='plus'
          size={24}
          color='black'
        />
      </TouchableOpacity>
    )
  }
  const calcHeight = (text) => {
    const textLength = encodeURI(text).split(/%..|./).length - 1
    return textLength / TextCountHeightRatio
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTintColor: '#000',
          headerRight,
          headerBackTitleVisible: false,
          headerTitle: `记事本(${total})`,
        }}
      />
      <MasonryFlashList
        renderFooter={renderFooter}
        disableHorizontalListHeightMeasurement={true}
        optimizeItemArrangement={true}
        overrideItemLayout={(layout, item) => {
          layout.size = calcHeight(item.text)
        }}
        data={data}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        estimatedItemSize={150}
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
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 15,
    margin: 5,
    borderRadius: 10,
  },
  headerRightButton: {
    padding: 5,
  },
  itemHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    height: 25,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  itemTextContainer: {},
  itemText: {
    color: '#646464',
  },
  itemTitle: {
    fontSize: 16,
    flex: 1,
    fontWeight: 'bold',
  },
  itemTime: {
    fontWeight: 'bold',
    color: '#646464',
    textAlign: 'right',
    width: 70,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
    fontVariant: ['tabular-nums'],
  },
  itemFooterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
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
  createrText: {
    color: '#646464',
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
    color: '#646464',
  },
})
