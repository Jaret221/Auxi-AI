import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ScrollView, ImageBackground, KeyboardAvoidingView, Platform
} from 'react-native';
import api from '../servicios/api';

export default function RegisterScreen({ navigation }: any) {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefonoEmergencia, setTelefonoEmergencia] = useState('');
  const [password, setPassword] = useState('');

  const validarCampos = (): boolean => {
    if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre)) { Alert.alert('Error', 'Nombre inválido'); return false; }
    if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/.test(apellidos)) { Alert.alert('Error', 'Apellidos inválidos'); return false; }
    if (!/^\d{10}$/.test(telefono)) { Alert.alert('Error', 'Teléfono inválido'); return false; }
    if (!/^\d{10}$/.test(telefonoEmergencia)) { Alert.alert('Error', 'Tel. Emergencia inválido'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) { Alert.alert('Error', 'Correo inválido'); return false; }
    if (password.length < 6) { Alert.alert('Error', 'Contraseña muy corta'); return false; }
    return true;
  };

  const handleRegister = async () => {
    if (!nombre || !apellidos || !telefono || !correo || !telefonoEmergencia || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (!validarCampos()) return;

    try {
      await api.post('/auth/register', { nombre, apellidos, telefono, correo, telefonoEmergencia, password });
      Alert.alert('Éxito', 'Usuario registrado correctamente');
      navigation.navigate('Login');
    } catch (error: any) {
      console.log(error.response?.data);
      Alert.alert('Error', error.response?.data?.message || 'Ocurrió un error');
    }
  };

  return (
    <ImageBackground source={require('../../assets/AuxiFondo.png')} style={styles.background}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Registro en AuxiAI</Text>

            <TextInput placeholder="Nombre" style={styles.input} value={nombre} onChangeText={setNombre} />
            <TextInput placeholder="Apellidos" style={styles.input} value={apellidos} onChangeText={setApellidos} />
            <TextInput placeholder="Teléfono" style={styles.input} value={telefono} onChangeText={setTelefono} keyboardType="numeric" />
            <TextInput placeholder="Correo" style={styles.input} value={correo} onChangeText={setCorreo} keyboardType="email-address" />
            <TextInput placeholder="Tel. Emergencia" style={styles.input} value={telefonoEmergencia} onChangeText={setTelefonoEmergencia} keyboardType="numeric" />
            <TextInput placeholder="Contraseña" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: 25, elevation: 5 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#0d6efd' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, marginBottom: 15, fontSize: 16, backgroundColor: '#fff' },
  button: { backgroundColor: '#198754', borderRadius: 10, paddingVertical: 12, marginBottom: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
  link: { marginTop: 10, textAlign: 'center', color: '#0d6efd', fontWeight: '500' },
});
