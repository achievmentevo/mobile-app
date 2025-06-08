import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useTopics } from '../context/TopicContext';

export default function CreateThemeScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { addTopic } = useTopics();

  const handleCreate = () => {
    if (title.trim()) {
      addTopic(title.trim());
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Text style={styles.header}>Создание тематики</Text>

        <TextInput
          style={styles.input}
          placeholder="Название темы"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#999"
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Описание (необязательно)"
          value={description}
          onChangeText={setDescription}
          multiline
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleCreate}
        >
          <Text style={styles.primaryText}>Создать</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.outlineButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.outlineText}>Отмена</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    borderColor: '#1E90FF',
    borderWidth: 1.5,
    marginBottom: 20,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: '#1E90FF',
  },
  primaryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: '#1E90FF',
    backgroundColor: '#fff',
  },
  outlineText: {
    color: '#1E90FF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
