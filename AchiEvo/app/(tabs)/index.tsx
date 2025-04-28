import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { useTopics } from '../../context/TopicContext'


export default function HomeScreen() {
  const {topics} = useTopics();

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>AchiEvo</Text>
      </View>
        <ScrollView style={styles.themesContainer}>
          {topics.map((topic) => (
            <TouchableOpacity key={topic.id} style={styles.themeItem} onPress={() => router.push(`/topic?name=${topic.name}`)}>
              <Text style={styles.themeText}>{topic.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      <Link href="/create-topic" asChild>
        <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Создать тематику</Text>
          </TouchableOpacity>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E90FF', // Синий
    textAlign: 'center',
    marginVertical: 20,
  },
  themesContainer: {
    flex: 1,
    marginBottom: 20,
  },
  themeItem: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#1E90FF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  themeText: {
    color: '#1E90FF',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 80
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});