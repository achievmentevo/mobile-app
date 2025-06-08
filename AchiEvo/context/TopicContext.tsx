import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Topic {
id: number;
name: string;
}

interface TopicContextType {
topics: Topic[];
addTopic: (name: string) => Promise<void>;
}

const TopicContext = createContext<TopicContextType>({
topics: [],
addTopic: async () => {},
});
  
export const TopicProvider = ({ children }: { children: React.ReactNode }) => {
    const [topics, setThemes] = useState<Topic[]>([]);
  
    // Загрузка тем при старте
    useEffect(() => {
      const loadTopics = async () => {
        const savedTopics = await AsyncStorage.getItem('@topics');
        if (savedTopics) {
          setThemes(JSON.parse(savedTopics));
        }
      };
      loadTopics();
    }, []);
  
    // Добавление новой темы
    const addTopic = async (name: string) => {
      const newTopic = { id: Date.now(), name };
      const updatedTopics = [...topics, newTopic];
      setThemes(updatedTopics);
      await AsyncStorage.setItem('@topics', JSON.stringify(updatedTopics));
    };
  
    return (
      <TopicContext.Provider value={{ topics, addTopic }}>
        {children}
      </TopicContext.Provider>
    );
  };
  
export const useTopics = () => useContext(TopicContext);
  