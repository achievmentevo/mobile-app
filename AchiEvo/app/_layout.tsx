import { Stack } from "expo-router";
import { TopicProvider } from '@/context/TopicContext';

export default function RootLayout() {
  return (
    <TopicProvider>
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
            <Stack.Screen 
                name="topic"
                options={{ 
                title: 'Topic',
                headerTitleStyle: {
                    color: '#1E90FF' // Синий цвет как в AchiEvo
                },
                }}
        
            />
        </Stack>
    </TopicProvider>
  );
}
