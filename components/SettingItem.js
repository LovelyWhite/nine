import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { EvilIcons } from '@expo/vector-icons';

const SettingItem = ({ item, onItemPress }) => {
    const { title, description, extra, showArrow } = item
    return <>
        <TouchableOpacity activeOpacity={0.6} onPress={onItemPress} style={styles.container}>
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
            <View style={styles.iconLine}>
                <Text style={styles.extra}>{extra}</Text>
                {showArrow && <EvilIcons name="chevron-right" size={24} color="#909399" />}
            </View>
        </TouchableOpacity>
    </>
}
export default SettingItem

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 70,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 5,
        padding: 20,
        flex: 1
    },
    title: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    description: {
        color: '#909399',
        fontSize: 14,
    },
    extra: {
        color: '#909399',
        fontSize: 14,
        textAlignVertical: 'center',
        lineHeight: 14
    },
    iconLine: {
        display: 'flex',
        flexDirection: 'row'
    }
})