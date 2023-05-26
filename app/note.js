import React, { useRef, useState } from 'react'
import { TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { MasonryFlashList } from '@shopify/flash-list'
import { Stack, useNavigation, useRouter } from 'expo-router'
import { getNotes } from '../engine/note'
import NoteItem from '../components/NoteItem'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Note() {
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [canLoadMore, setCanLoadMore] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const TextCountHeightRatio = useRef(1.1453).current
  const router = useRouter()
  const navigation = useNavigation()
  const { bottom } = useSafeAreaInsets()

  const fetchNotes = async (page) => {
    try {
      const { items, total } = await getNotes(page, 30)
      setTotal(total)
      return items
    } catch (e) {
      Alert.alert('提示', e?.message, [{ text: '确定' }])
      return []
    }
  }

  const handleLoadMore = () => {
    if (!canLoadMore || isLoading) {
      return
    }
    setIsLoading(true)
    fetchNotes(page).then((newData) => {
      setIsLoading(false)
      setCanLoadMore(false)
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
      <TouchableOpacity activeOpacity={0.5} onPress={onAddNotePress}>
        <AntDesign
          style={styles.headerRightButton}
          name='plus'
          size={24}
          color='black'
        />
      </TouchableOpacity>
    )
  }
  React.useEffect(() => {
    return navigation.addListener('focus', handleRefreshing)
  }, [navigation])

  const calcHeight = (text) => {
    const textLength = encodeURI(text).split(/%..|./).length - 1
    return textLength / TextCountHeightRatio
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerBackTitleVisible: false,
          headerTintColor: '#000',
          headerRight,
          headerTitle: `记事本(${total})`,
        }}
      />
      <MasonryFlashList
        disableHorizontalListHeightMeasurement={true}
        optimizeItemArrangement={true}
        overrideItemLayout={(layout, item) => {
          layout.size = calcHeight(item.text)
        }}
        data={data}
        numColumns={2}
        extraData={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <NoteItem item={item} />}
        estimatedItemSize={50}
        refreshing={isRefreshing}
        onRefresh={handleRefreshing}
        onMomentumScrollEnd={handleLoadMore}
        onEndReached={() => setCanLoadMore(true)}
        onEndReachedThreshold={0.01}
        contentContainerStyle={{ paddingHorizontal: 5, paddingBottom: bottom }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  headerRightButton: {
    padding: 5,
  },
})
