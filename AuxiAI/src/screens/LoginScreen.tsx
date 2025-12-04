import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../servicios/api';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {
  const bubbles = Array.from({ length: 8 }, () => ({
    x: Math.random() * width,
    size: Math.random() * 30 + 20,
    animation: new Animated.Value(height),
    opacity: Math.random() * 0.5 + 0.3,
  }));

  const [correo, setCorreo] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    if (!correo || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await api.post('/auth/login', { correo, password });
      await AsyncStorage.removeItem('token');
      await AsyncStorage.setItem('token', response.data.token);
      Alert.alert('Éxito', 'Login exitoso');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error: any) {
      console.log(error.response?.data);
      Alert.alert('Error', error.response?.data?.message || 'Ocurrió un error');
    }
  };

const animateBubbles = () => {
  bubbles.forEach((bubble) => {
    bubble.animation.setValue(height);
    Animated.loop(
      Animated.timing(bubble.animation, {
        toValue: -bubble.size,
        duration: 3000, // 3 segundos de ritmo constante
        useNativeDriver: true,
      })
    ).start();
  });
};


  useEffect(() => {
    animateBubbles();
  }, []);

  return (
    <LinearGradient colors={['#00CED1', '#FFF8DC']} style={styles.background}>
      <View style={styles.bubbleContainer}>
        {bubbles.map((bubble, index) => (
          <Animated.View
            key={index}
            style={[
              styles.bubble,
              {
                left: bubble.x,
                width: bubble.size,
                height: bubble.size,
                opacity: bubble.opacity,
                transform: [{ translateY: bubble.animation }],
              },
            ]}
          />
        ))}
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.card}>
          <Image
            source={require('../../assets/Fondos/new/Newlog.png')}
            style={styles.logo}
          />

          <Text style={styles.title}>Bienvenido a AuxiAI</Text>

          <TextInput
            placeholder="Correo electrónico"
            style={styles.input}
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  bubbleContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Transparente
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
    borderRadius: 45,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#004D4D',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    width: '100%',
  },
  button: {
    backgroundColor: '#00CED1',
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  link: {
    marginTop: 10,
    textAlign: 'center',
    color: '#004D4D',
    fontWeight: '500',
  },
});
