import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sendMessage } from '../../servicios/chatService';

type Message = {
  id: string;
  text: string;
  from: 'user' | 'bot';
};

export const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text: input, from: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    const response = await sendMessage(input);
    const botMsg: Message = { id: (Date.now() + 1).toString(), text: response, from: 'bot' };
    setMessages((prev) => [...prev, botMsg]);
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });

    // Animación suave de burbujas
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [messages]);

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.from === 'user';
    return (
      <Animated.View
        style={[
          styles.msgContainer,
          isUser ? styles.userMsg : styles.botMsg,
          { opacity: fadeAnim },
        ]}
      >
        <Ionicons
          name={isUser ? 'person-circle' : 'chatbubble-ellipses'}
          size={30}
          color={isUser ? '#0f5132' : '#842029'}
          style={{ marginRight: 5 }}
        />
        <Text style={styles.msgText}>{item.text}</Text>
      </Animated.View>
    );
  };

  return (
    <ImageBackground
      source={require('../../../assets/AuxiFondo.png')}
      style={styles.background}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 10 }}
            renderItem={renderItem}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Escribe tu mensaje..."
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="send" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '80%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1e7dd',
  },
  botMsg: {
    alignSelf: 'flex-start',
    backgroundColor: '#f8d7da',
  },
  msgText: { fontSize: 16 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#0d6efd',
    borderRadius: 25,
    padding: 10,
  },
});
