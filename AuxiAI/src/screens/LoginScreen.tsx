import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform,
  ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../servicios/api';

export default function LoginScreen({ navigation }: any) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!correo || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await api.post('/auth/login', { correo, password });

      // Limpiar token viejo y guardar el nuevo
      await AsyncStorage.removeItem('token');
      await AsyncStorage.setItem('token', response.data.token);

      Alert.alert('Éxito', 'Login exitoso');

      // Navegar a Home garantizando que el token esté guardado
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error: any) {
      console.log(error.response?.data);
      Alert.alert('Error', error.response?.data?.message || 'Ocurrió un error');
    }
  };

  return (
    <ImageBackground source={require('../../assets/AuxiFondo.png')} style={styles.background}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.card}>
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: 25, elevation: 5 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#0d6efd' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, marginBottom: 15, fontSize: 16, backgroundColor: '#fff' },
  button: { backgroundColor: '#0d6efd', borderRadius: 10, paddingVertical: 12, marginBottom: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
  link: { marginTop: 10, textAlign: 'center', color: '#0d6efd', fontWeight: '500' },
});
