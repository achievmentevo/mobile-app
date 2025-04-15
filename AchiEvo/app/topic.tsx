import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams } from 'expo-router';


export default function TopicTimer() {
    const { name } = useLocalSearchParams();
    const topicName = typeof name === 'string' ? name : name?.[0] || 'Тема';
    
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0)
    const [sessions, setSessions] = useState<number[]>([])

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(() => {
                setTime(prev => prev + 1)
            }, 1000)
        }
        return () => clearInterval(interval);
    }, [isRunning])

    const handleStart = () => {
        setIsRunning(true);
    }

    const handleStop = () => {
        setIsRunning(false);
        setSessions([...sessions, time]);
        setTime(0);
    }
    return (
        <View style={styles.container}>
            <Text style={styles.topicTitle}>{topicName}</Text>
            <Text style={styles.timer}>{formatTime(time)}</Text>
            {!isRunning ? (
                    <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                        <Text style={styles.buttonText}>▶ Старт</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.startButton} onPress={handleStop}>
                        <Text style={styles.buttonText}>⏹ Стоп</Text>
                    </TouchableOpacity>
                )
            }
            <View style={styles.sessionsContainer}>
                {sessions.map((session, index) => (
                    <Text key={index} style={styles.sessionText}>
                        Сессия {index + 1}: {formatTime(session)}
                    </Text>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    topicTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1E90FF',
      marginBottom: 40,
      textAlign: 'center',
    },
    timer: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#1E90FF',
      marginVertical: 40,
    },
    startButton: {
      backgroundColor: '#1E90FF',
      borderRadius: 50,
      paddingVertical: 15,
      paddingHorizontal: 30,
      marginTop: 20,
    },
    stopButton: {
      backgroundColor: '#FF3B30',
      borderRadius: 50,
      paddingVertical: 15,
      paddingHorizontal: 30,
      marginTop: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    sessionsContainer: {
      marginTop: 40,
      alignItems: 'center',
    },
    sessionText: {
      color: '#666',
      fontSize: 14,
      marginVertical: 5,
    },
  });
  