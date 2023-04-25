import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { EvilIcons } from '@expo/vector-icons';

const SettingItem = (props) => {
    const { onItemPress, title, description } = props
    return <>
        <TouchableOpacity activeOpacity={0.6} onPress={onItemPress} style={styles.container}>
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
            <EvilIcons name="chevron-right" size={24} color="#909399" />
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
        margin: 5,
        padding: 20
    },
    title: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    description: {
        color: '#909399',
        fontSize: 14
    }
})