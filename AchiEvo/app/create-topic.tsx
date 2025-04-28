import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
import { useTopics } from '..//context/TopicContext'




export default function CreateThemeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');


  const {addTopic} = useTopics();

  const handleCreate = () => {
    if (title.trim()) {
      addTopic(title.trim());
    }
    router.back()
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Название темы"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#999"
      />
      
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Описание"
        value={description}
        onChangeText={setDescription}
        multiline
        placeholderTextColor="#999"
      />
      
      <TouchableOpacity 
        style={styles.createButton}
        onPress={handleCreate}
      >
        <Text style={styles.createButtonText}>Создать</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelButtonText}>Отмена</Text>
      </TouchableOpacity>
    </View>
  );
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
    color: '#1E90FF',
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: '#1E90FF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: '#1E90FF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#1E90FF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
