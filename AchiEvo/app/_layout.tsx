import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="create-topic"
        options={{ 
          presentation: 'modal',
          title: 'Create topic',
          headerTitleStyle: {
            color: '#1E90FF' // Синий цвет как в AchiEvo
          },      
        }}
      />
    </Stack>
  );
}
