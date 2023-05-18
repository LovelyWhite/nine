import React from 'react'
import {
  StyleSheet,
  View,
  Animated,
  Text,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native'
import { Stack } from 'expo-router'
import { SplashScreen, useRouter } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { AntDesign } from '@expo/vector-icons'
import HeartRain from '../components/HeartRain'
import { getSettings } from '../engine/utils'
import Toast from 'react-native-root-toast'
import { biu } from '../engine/user'

export default function Index() {
  const router = useRouter()
  const [isReady, setReady] = React.useState(false)
  const [isHeartClickable, setHeartClickable] = React.useState(true)
  const heartImgScaleValue = React.useRef(new Animated.Value(1)).current
  const heartRain = React.useRef(null)
  const inserts = useSafeAreaInsets()

  const [heartBeatAnimation] = React.useState(
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartImgScaleValue, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(heartImgScaleValue, {
          toValue: 0.8,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(heartImgScaleValue, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(heartImgScaleValue, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(heartImgScaleValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ])
    )
  )

  const onHeartImgPressIn = () => {
    Animated.timing(heartImgScaleValue, {
      toValue: 1.7,
      duration: 500,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        sendBiu()
        setHeartClickable(false)
        heartImgScaleValue.setValue(1)
        heartRain.current.startAnimiate()
        setTimeout(() => setHeartClickable(true), 5000)
      }
    })
  }

  const sendBiu = async () => {
    try {
      Toast.show('正在提醒对方～', { duration: Toast.durations.SHORT })
      const { message } = await getSettings()
      await biu(message)
      Toast.show('已成功提醒对方啦～', { duration: Toast.durations.SHORT })
    } catch (e) {
      Toast.show(e.message, { duration: Toast.durations.SHORT })
    }
  }

  const onHeartImgPressOut = () => {
    heartBeatAnimation.start()
  }

  React.useEffect(() => {
    Promise.all([
      new Promise((reslove) => {
        heartBeatAnimation.start()
        reslove()
      }),
      new Promise((reslove) => {
        setTimeout(() => {
          reslove()
        }, 1500)
      }),
    ])
      .then()
      .finally(() => {
        setReady(true)
      })
  }, [])

  const onSettingPress = () => {
    router.push('/setting')
  }

  const onNotePress = () => {
    router.push('/note')
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    headerButtonsContainer: {
      position: 'absolute',
      top: inserts.top + 10,
      right: inserts.right + 15,
      zIndex: 1,
    },
    headerButton: {
      marginBottom: 5,
      padding: 5,
      alignItems: 'center',
    },
    headerButtonText: {
      color: '#646464',
    },
    noteBotton: {
      width: 50,
      height: 50,
    },
    heart: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heartImg: {
      height: 150,
      width: 150,
    },
    historyBtn: {
      height: 50,
      width: 50,
    },
    footer: {
      alignItems: 'center',
    },
    footerAndroid: {
      marginBottom: 15,
    },
    footerText: {
      color: '#646464',
      paddingVertical: 5,
    },
  })

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {!isReady && <SplashScreen />}
      <HeartRain ref={heartRain} />
      <SafeAreaView style={styles.container}>
        <View style={styles.headerButtonsContainer}>
          <TouchableOpacity
            style={styles.headerButton}
            activeOpacity={0.5}
            onPress={onNotePress}
          >
            <AntDesign name='edit' size={25} color='black' />
            <Text style={styles.headerButtonText}>记事</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            activeOpacity={0.5}
            onPress={() => Toast.show('正在开发~')}
          >
            <AntDesign name='hdd' size={25} color='black' />
            <Text style={styles.headerButtonText}>历史</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            activeOpacity={0.5}
            onPress={onSettingPress}
          >
            <AntDesign name='setting' size={25} color='black' />
            <Text style={styles.headerButtonText}>设置</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.heart}>
          <TouchableWithoutFeedback
            disabled={!isHeartClickable}
            onPressIn={onHeartImgPressIn}
            onPressOut={onHeartImgPressOut}
          >
            <Animated.Image
              style={[
                styles.heartImg,
                {
                  transform: [
                    { translateY: -100 },
                    { scale: heartImgScaleValue },
                  ],
                },
              ]}
              source={require('../assets/heart.png')}
              contentFit='contain'
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              Platform.OS === 'android' ? styles.footerAndroid : {},
            ]}
          >
            Powerd by 99
          </Text>
        </View>
      </SafeAreaView>
    </>
  )
}
