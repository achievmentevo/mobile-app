import { Stack } from "expo-router";
import { TopicProvider } from '@/context/TopicContext';

export default function RootLayout() {
  return (
    <TopicProvider>
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen 
                name="create-topic"
                options={{ 
                presentation: 'modal',
                title: 'Create topic',
                }}
            />
            <Stack.Screen 
                name="topic"
                options={{ 
                title: 'Topic',
                }}
        
            />
        </Stack>
    </TopicProvider>
  );
}
