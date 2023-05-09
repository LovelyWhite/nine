import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name='index' />
      <Stack.Screen name='setting' />
      <Stack.Screen name='add-note-modal' options={{ presentation: 'modal' }} />
    </Stack>
  )
}
