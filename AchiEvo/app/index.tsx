import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useTopics } from '../context/TopicContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LEVELS = [
  { id: 'rookie', title: 'Новичок', icon: '🌱', min: 0 },
  { id: 'apprentice', title: 'Ученик', icon: '📘', min: 10 * 3600 },
  { id: 'practitioner', title: 'Практик', icon: '🔧', min: 100 * 3600 },
  { id: 'pro', title: 'Профи', icon: '🎓', min: 500 * 3600 },
  { id: 'expert', title: 'Эксперт', icon: '💡', min: 1000 * 3600 },
  { id: 'mentor', title: 'Наставник', icon: '🔥', min: 5000 * 3600 },
  { id: 'master', title: 'Мастер', icon: '🏆', min: 10000 * 3600 },
];


export default function HomeScreen() {
  const { topics } = useTopics();
  const [topicStats, setTopicStats] = useState<Record<string, { total: number, achievements: string[] }>>({});

  useEffect(() => {
    const loadStats = async () => {
      const stats: Record<string, { total: number, achievements: string[] }> = {};

      for (const topic of topics) {
        const rawSessions = await AsyncStorage.getItem(`@sessions_${topic.name}`);
        const rawAchievements = await AsyncStorage.getItem(`@achievements_${topic.name}`);

        const sessions = rawSessions ? JSON.parse(rawSessions) : [];
        const total = sessions.reduce((sum: number, sec: number) => sum + sec, 0);

        const achievements = rawAchievements ? JSON.parse(rawAchievements) : [];

        stats[topic.name] = {
          total,
          achievements
        };
      }

      setTopicStats(stats);
    };

    loadStats();
  }, [topics]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}ч ${m}м ${s}с`;
  };

  const getLevelForTime = (totalSeconds: number) => {
    let current = LEVELS[0];
    for (const level of LEVELS) {
      if (totalSeconds >= level.min) {
        current = level;
      }
    }
    return current;
  };
  
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.header}>AchiEvo</Text>

          <ScrollView>
            {topics.map((topic) => {
              const stats = topicStats[topic.name] || { total: 0, achievements: [] };
              const level = getLevelForTime(stats.total);

              return (
                  <TouchableOpacity
                      key={topic.id}
                      style={styles.themeItem}
                      onPress={() => router.push(`/topic?name=${topic.name}`)}
                    >
                      <Text style={styles.themeText}>{topic.name}</Text>
                      <Text style={styles.levelText}>
                        {level.icon} {level.title} · {formatTime(stats.total)}
                      </Text>

                      {stats.achievements.length > 0 && (
                        <View style={styles.achievementsRow}>
                          {stats.achievements.map((achId) => {
                            const ach = LEVELS.find((a) => a.id === achId);
                            return ach ? (
                              <Text key={ach.id} style={styles.achievementIcon}>{ach.icon}</Text>
                            ) : null;
                          })}
                        </View>
                      )}
                </TouchableOpacity>
              );
            })}
        </ScrollView>

        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/create-topic')}
        >
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F2F6FC',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    position: 'relative',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E90FF',
    textAlign: 'center',
    marginBottom: 20,
  },
  topicsWrapper: {
    paddingBottom: 100,
  },
  topicCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  topicName: {
    fontSize: 16,
    color: '#1E90FF',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 100,
    paddingHorizontal: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#1E90FF',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: '#fff',
    marginTop: -2,
  },
  infoText: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  achievementsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  
  achievementIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  themeItem: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  themeText: {
    fontSize: 16,
    color: '#1E90FF',
    fontWeight: '600',
  },
  levelText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  
});
