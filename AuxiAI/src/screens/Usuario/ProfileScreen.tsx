import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ActivityIndicator,
  Alert, TouchableOpacity, ScrollView, ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../servicios/api';
import { Ionicons } from '@expo/vector-icons';

interface User {
  id: number;
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
  telefonoEmergencia: string;
}

const ProfileScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [telefonoEmergencia, setTelefonoEmergencia] = useState('');

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No se encontró token');

      const res = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setNombre(res.data.nombre);
      setApellidos(res.data.apellidos);
      setTelefono(res.data.telefono);
      setTelefonoEmergencia(res.data.telefonoEmergencia);
    } catch (error: any) {
      console.log('Error fetching profile:', error.message);
      Alert.alert('Error', 'No se pudo cargar tu perfil. Por favor inicia sesión de nuevo.');
      navigation.navigate('Login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    if (!nombre || !apellidos || !telefono || !telefonoEmergencia) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre)) {
      Alert.alert('Error', 'El nombre solo puede contener letras');
      return;
    }
    if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/.test(apellidos)) {
      Alert.alert('Error', 'Los apellidos solo pueden contener letras');
      return;
    }
    if (!/^\d{10}$/.test(telefono)) {
      Alert.alert('Error', 'El teléfono debe contener 10 dígitos');
      return;
    }
    if (!/^\d{10}$/.test(telefonoEmergencia)) {
      Alert.alert('Error', 'El teléfono de emergencia debe contener 10 dígitos');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No se encontró token');

      const res = await api.put(
        '/auth/me',
        { nombre, apellidos, telefono, telefonoEmergencia },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data);
      setEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error: any) {
      console.log('Error updating profile:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo actualizar tu perfil');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d6efd" />
      </View>
    );
  }

  if (!user) return null;

  const FieldCard = ({ label, value, setter, editable = false, keyboardType = 'default' }: any) => (
    <View style={styles.fieldCard}>
      <Text style={styles.label}>{label}</Text>
      {editable ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setter}
          editable={editable}
          keyboardType={keyboardType}
        />
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
  );

  return (
    <ImageBackground
      source={require('../../../assets/Fondos/4.png')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Botón de volver */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0d6efd" />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.title}>👤 Perfil de Usuario</Text>

          <FieldCard label="Nombre" value={nombre} setter={setNombre} editable={editing} />
          <FieldCard label="Apellidos" value={apellidos} setter={setApellidos} editable={editing} />
          <FieldCard label="Correo" value={user.correo} />
          <FieldCard label="Teléfono" value={telefono} setter={setTelefono} editable={editing} keyboardType="numeric" />
          <FieldCard label="Teléfono de Emergencia" value={telefonoEmergencia} setter={setTelefonoEmergencia} editable={editing} keyboardType="numeric" />

          <TouchableOpacity
            style={[styles.button, editing && styles.updateButton]}
            onPress={editing ? handleUpdate : () => setEditing(true)}
          >
            <Text style={styles.buttonText}>{editing ? 'Actualizar Datos' : 'Editar Perfil'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  backText: {
    color: '#0d6efd',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '600',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0d6efd',
    textAlign: 'center',
    marginBottom: 25,
  },
  fieldCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#212529',
  },
  input: {
    fontSize: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 25,
    backgroundColor: '#0d6efd',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    shadowColor: '#0d6efd',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  updateButton: {
    backgroundColor: '#198754',
    shadowColor: '#198754',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileScreen;
