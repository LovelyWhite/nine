import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { EvilIcons } from '@expo/vector-icons'

const SettingItem = ({ item, onItemPress }) => {
  const { title, description, extra, showArrow } = item
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={onItemPress}
        style={styles.container}
      >
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.iconLine}>
          <Text style={styles.extra}>{extra}</Text>
          {showArrow && (
            <EvilIcons name='chevron-right' size={24} color='#646464' />
          )}
        </View>
      </TouchableOpacity>
    </>
  )
}
export default SettingItem

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 85,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
  },
  description: {
    color: '#646464',
    textAlignVertical: 'center',
    fontSize: 15,
  },
  extra: {
    color: '#646464',
    textAlignVertical: 'center',
  },
  iconLine: {
    display: 'flex',
    flexDirection: 'row',
  },
})
