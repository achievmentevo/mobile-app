import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from 'expo-router';


const LEVELS = [
    { id: 'rookie', title: 'Новичок', icon: '🌱', min: 0 },
    { id: 'apprentice', title: 'Ученик', icon: '📘', min: 10 * 3600 },
    { id: 'practitioner', title: 'Практик', icon: '🔧', min: 100 * 3600 },
    { id: 'pro', title: 'Профи', icon: '🎓', min: 500 * 3600 },
    { id: 'expert', title: 'Эксперт', icon: '💡', min: 1000 * 3600 },
    { id: 'mentor', title: 'Наставник', icon: '🔥', min: 5000 * 3600 },
    { id: 'master', title: 'Мастер', icon: '🏆', min: 10000 * 3600 },
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
        const progressTotal = totalTime + time;
      
        const newUnlocked = LEVELS
          .filter(ach => !unlockedAchievements.includes(ach.id) && progressTotal >= ach.min)
          .map(ach => ach.id);
      
        if (newUnlocked.length > 0) {
          const updated = [...unlockedAchievements, ...newUnlocked];
          setUnlockedAchievements(updated);
          AsyncStorage.setItem(`@achievements_${topicName}`, JSON.stringify(updated));
        }
      }, [time, totalTime]);
            

    // save sessions
    useEffect(() => {
        const saveSessions = async () => {
            try {
                await AsyncStorage.setItem(`@sessions_${topicName}`, JSON.stringify(sessions));
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
          setSessions(newSessions);
          setTime(0);
      
          // 🔧 Добавь пересчёт totalTime вручную
          const newTotal = newSessions.reduce((sum, session) => sum + session, 0);
          setTotalTime(newTotal);
      
          await AsyncStorage.setItem(
            `@sessions_${topicName}`,
            JSON.stringify(newSessions)
          );
      
        } catch (e) {
          console.error('Ошибка сохранения:', e);
        }
      };
          
    const getNextLevel = (time: number) => {
    for (let i = 0; i < LEVELS.length - 1; i++) {
        if (time < LEVELS[i + 1].min) {
        return { current: LEVELS[i], next: LEVELS[i + 1] };
        }
    }
    return { current: LEVELS[LEVELS.length - 1], next: null };
    };
      
    return (
        <View style={styles.main}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/')} style={styles.backWrapper}>
                    <Text style={styles.backButton}>← Назад</Text>
                </TouchableOpacity>
            </View>

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
                <View style={styles.achievementsContainer}>
                    <Text style={styles.achievementsTitle}>Прогресс</Text>
                    {(() => {
                        const progressTotal = totalTime + time;
                        const { current, next } = getNextLevel(progressTotal);
                        const progress = next ? (progressTotal - current.min) / (next.min - current.min) : 1;

                        return (
                        <View style={styles.levelBox}>
                            <Text style={styles.levelText}>{current.icon} {current.title}</Text>
                            <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                            </View>
                            {next ? (
                            <Text style={styles.progressText}>
                                {Math.floor(progress * 100)}% до уровня {next.title} ({Math.floor((next.min - totalTime) / 3600)} ч)
                            </Text>
                            ) : (
                            <Text style={styles.progressText}>Достигнут максимальный уровень 🎉</Text>
                            )}
                        </View>
                        );
                    })()}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
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
        width: '100%',
      },
      
      achievementsTitle: {
        color: '#1E90FF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'left',
      },
      
      achievementsScroll: {
        paddingHorizontal: 10,
      },
      
      achievementItem: {
        alignItems: 'center',
        marginRight: 16,
        width: 60,
      },
      
      achievementIcon: {
        fontSize: 32,
        opacity: 0.4,
      },
      
      unlocked: {
        opacity: 1,
      },
      
      header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
      },
      
      backWrapper: {
        paddingVertical: 4,
        paddingHorizontal: 6,
      },
      
      backButton: {
        fontSize: 16,
        color: '#1E90FF',
        fontWeight: 'bold',
      },
      levelBox: {
        alignItems: 'center',
        marginTop: 10,
      },
      
      levelText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E90FF',
        marginBottom: 8,
      },
      
      progressBar: {
        width: '100%',
        height: 10,
        backgroundColor: '#eee',
        borderRadius: 5,
        overflow: 'hidden',
      },
      
      progressFill: {
        height: '100%',
        backgroundColor: '#1E90FF',
        borderRadius: 5,
      },
      
      progressText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        textAlign: 'center',
      },
      
});
  