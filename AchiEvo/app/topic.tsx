import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";


const ACHIEVEMENTS = [
    { id: 'start', icon: '🚀', threshold: 1 },
    { id: 'start-10', icon: '🔵', threshold: 10 },
    { id: 'start-100', icon: '📱', threshold: 100 },
    { id: '10-hours', icon: '📚', threshold: 10 * 3600 },
    { id: '100-hours', icon: '💪', threshold: 100 * 3600 },
    { id: '1000-hours', icon: '🎓', threshold: 1000 * 3600 },
    { id: '10000-hours', icon: '🏆', threshold: 10000 * 3600 }
  ];  


export default function TopicTimer() {
    const { name } = useLocalSearchParams();
    const topicName = typeof name === 'string' ? name : name?.[0] || 'Тема';
    
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [sessions, setSessions] = useState<number[]>([])
    const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
    const [totalTime, setTotalTime] = useState(0);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    
    // загрузка сессий
    useEffect(() => {
        const loadSessions = async () => {
            try {
                const savedSessions = await AsyncStorage.getItem(`@sessions_${topicName}`);
                if (savedSessions) {
                    const sessionsData = JSON.parse(savedSessions);
                    setSessions(sessionsData);
                    const total = sessionsData.reduce((sum, session) => sum + session, 0);
                    setTotalTime(total);
                }
                const savedAchievements = await AsyncStorage.getItem(`@achievements_${topicName}`);
                if (savedAchievements) {
                    setUnlockedAchievements(JSON.parse(savedAchievements));
                }

            } catch (e) {
                console.log("Error while load sessions", e)
            }
        };
        loadSessions();   
    }, [topicName])

    useEffect(() => {
        const checkAchievements = async () => {
            const newUnlocked = ACHIEVEMENTS
                .filter(ach => !unlockedAchievements.includes(ach.id) && totalTime >= ach.threshold)
                .map(ach => ach.id);

            if (newUnlocked.length > 0) {
                const updated = [...unlockedAchievements, ...newUnlocked];
                setUnlockedAchievements(updated);
                await AsyncStorage.setItem(
                    `@achievements_${topicName}`,
                    JSON.stringify(updated)
                );                
            }
        };

        checkAchievements();
    }, [totalTime]);


    // save sessions
    useEffect(() => {
        const saveSessions = async () => {
            try {
                await AsyncStorage.setItem(`sessions_${topicName}`, JSON.stringify(sessions));
            } catch (e) { console.error("Error while save session", e)}
        }

        if (saveSessions.length > 0) {
            saveSessions()
        }
    }, [sessions, topicName])

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

    const handleStop = async () => {
        setIsRunning(false);
        const newSessions = [...sessions, time];
        try {
            // Обновляем локальное состояние
            setSessions(newSessions);
            setTime(0);

            // Параллельно сохраняем в AsyncStorage
            await Promise.all([
                // Сохраняем массив длительностей для текущей темы
                AsyncStorage.setItem(
                    `@sessions_${topicName}`,
                    JSON.stringify(newSessions)
                ),
                
            ]);
            
        } catch (e) {
            console.error('Ошибка сохранения:', e);
        }

    }

    const activeAchievements = ACHIEVEMENTS.filter(ach => 
        unlockedAchievements.includes(ach.id)
    );


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
            {sessions
                .slice() // Копируем массив, чтобы не мутировать оригинал
                .reverse() // Сортируем по убыванию (новые сверху)
                .slice(0, 5) // Берем первые 5
                .map((session, index) => (
                <Text key={index} style={styles.sessionText}>
                    Сессия {sessions.length - index}: {formatTime(session)}
                </Text>
                ))
            }
            </View>
            {activeAchievements.length > 0 && (
                <View style={styles.achievementsContainer}>
                    <Text style={styles.achievementsTitle}>Ваши ачивки</Text>
                    <View style={styles.achievementsIcons}>
                        {activeAchievements.map(ach => (
                            <Text key={ach.id} style={styles.achievementIcon}>
                                {ach.icon}
                            </Text>
                        ))}
                    </View>
                </View>
            )}
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
    achievementsContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    achievementsTitle: {
        color: '#1E90FF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    achievementsIcons: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    achievementIcon: {
        fontSize: 28,
        marginHorizontal: 8,
        marginVertical: 4,
    },

  });
  