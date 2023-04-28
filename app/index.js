import React from 'react'
import {
  StyleSheet,
  View,
  Animated,
  Text,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  Image,
} from 'react-native'
import { Stack } from 'expo-router'
import { SplashScreen, useRouter } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import HeartRain from '../components/HeartRain'
import { biu, getSettings } from '../engine/utils'
import Toast from 'react-native-root-toast'

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
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(heartImgScaleValue, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(heartImgScaleValue, {
          toValue: 0.8,
          duration: 500,
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
      Toast.show('biu~biu~biu~', { duration: Toast.durations.SHORT })
      const settings = await getSettings()
      await biu(settings.userId, settings.message)
      Toast.show('已成功提醒对方啦～', { duration: Toast.durations.SHORT })
    } catch (e) {
      Toast.show(e.toString(), { duration: Toast.durations.SHORT })
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

  const onBottomInfoPress = () => {
    router.push('/setting')
  }

  const onNotePress = () => {
    router.push('/note')
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    headerButtons: {
      position: 'absolute',
      top: inserts.top,
      right: inserts.right + 10,
      zIndex: 1,
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
      color: '#909399',
      paddingVertical: 10,
    },
  })

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {!isReady && <SplashScreen />}
      <HeartRain ref={heartRain} />
      <SafeAreaView style={styles.container}>
        <View style={styles.headerButtons}>
          <TouchableOpacity activeOpacity={0.6} onPress={onNotePress}>
            <Image
              style={styles.noteBotton}
              source={require('../assets/note-icon.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.heart}>
          <TouchableWithoutFeedback
            disabled={!isHeartClickable}
            onPressIn={onHeartImgPressIn}
            onPressOut={onHeartImgPressOut}
          >
            <Animated.View
              style={[
                styles.heartImg,
                {
                  transform: [
                    { translateY: -100 },
                    { scale: heartImgScaleValue },
                  ],
                },
                { borderWidth: 1 },
              ]}
            ></Animated.View>
            {/* <Animated.Image
              style={[styles.heartImg, { transform: [{ translateY: -100 }, { scale: heartImgScaleValue }] }]}
              source={require("../assets/heart.png")}
              contentFit="contain"
            /> */}
          </TouchableWithoutFeedback>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={onBottomInfoPress}
          style={styles.footer}
        >
          <Text
            style={[
              styles.footerText,
              Platform.OS === 'android' ? styles.footerAndroid : {},
            ]}
          >
            Powerd by 99
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  )
}
