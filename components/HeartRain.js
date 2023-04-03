import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { View, StyleSheet, Animated, Dimensions } from 'react-native'
import * as Crypto from "expo-crypto"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const HEART_SIZE = 30

const Heart = forwardRef(({ heart }, ref) => {
  const position = new Animated.ValueXY(
    {
      x: parseInt(Crypto.getRandomBytes(4), 16) % SCREEN_WIDTH,
      y: SCREEN_HEIGHT
    }
  )
  const [opacity] = useState(new Animated.Value(0))

  const startAnimiate = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heart.y, {
          toValue: parseInt(Crypto.getRandomBytes(4), 16) % SCREEN_HEIGHT,
          duration: 0,
          useNativeDriver: true,
        }), Animated.timing(heart.x, {
          toValue: parseInt(Crypto.getRandomBytes(4), 16) % SCREEN_WIDTH,
          duration: 0,
          useNativeDriver: true,
        })
      ]),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(heart.x, {
          toValue: position.x,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(heart.y, {
          toValue: position.y,
          duration: 5000,
          useNativeDriver: true,
        }),
      ]),
    ]).start()
  }
  useImperativeHandle(ref, () => {
    return {
      startAnimiate
    }
  }, [])
  return (
    <Animated.Image
      source={require("../assets/heart.png")}
      style={[
        styles.heart,
        { transform: [{ translateX: heart.x }, { translateY: heart.y }], opacity },
      ]} />
  )
})

const createHeart = () => {
  return new Animated.ValueXY(0, 0)
}
const hearts = new Array()
for (let i = 0; i < 20; i++) {
  hearts.push(createHeart())
}
const HeartRain = (props, ref) => {
  const components = useRef(new Array())
  for (let i = 0; i < 20; i++) {
    components.current[i] = React.createRef()
  }
  const startAnimiate = () => {
    components.current.forEach(e => e.current.startAnimiate())
  }
  useImperativeHandle(ref, () => {
    return {
      startAnimiate
    }
  }, [])
  return <View pointerEvents='box-none' style={styles.container}>
    {hearts.map((heart, index) => (
      <Heart key={index} ref={components.current[index]} heart={heart} />
    ))}
  </View>
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
  },
  heart: {
    width: HEART_SIZE,
    height: HEART_SIZE,
    backgroundColor: 'transparent',
  },
})

export default React.forwardRef(HeartRain)
