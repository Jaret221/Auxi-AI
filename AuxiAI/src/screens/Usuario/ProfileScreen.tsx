import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ActivityIndicator,
  Alert, TouchableOpacity, ScrollView, KeyboardTypeOptions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../servicios/api'; // Asegúrate de que esta ruta sea correcta
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// --- DEFINICIÓN DE INTERFACES ---
interface User {
  id: number;
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
  telefonoEmergencia: string;
}

// --- CONSTANTES DE ESTILO ---
const COLORS = {
  // Colores futuristas (similares a HomeScreen)
  BG_MAIN: '#1E1E3F', // Fondo oscuro principal
  BG_CARD: 'rgba(255, 255, 255, 0.08)', // Tarjeta semi-transparente oscura
  NEON_BLUE: '#00BFFF', // Azul neón para acentos
  NEON_PURPLE: '#7B68EE', // Púrpura neón
  TEXT_LIGHT: '#E0E0E0', // Texto claro
  TEXT_ACCENT: '#FFFFFF', // Texto de título
};

// --- SUB-COMPONENTE: FieldCard (MOVIDO FUERA DEL COMPONENTE PRINCIPAL) ---
// MOVER ESTE COMPONENTE EVITA EL PROBLEMA DE RE-RENDERIZACIÓN DEL TECLADO
interface FieldCardProps {
  label: string;
  value: string;
  setter: (text: string) => void;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

const FieldCard = ({ label, value, setter, editable = false, keyboardType = 'default' }: FieldCardProps) => (
  <View style={profileStyles.fieldCard}>
    <Text style={profileStyles.label}>{label}</Text>
    <TextInput
      style={[
        profileStyles.input,
        !editable && profileStyles.readOnlyInput,
        editable && profileStyles.editableInput
      ]}
      value={value}
      onChangeText={setter}
      editable={editable}
      keyboardType={keyboardType}
      placeholderTextColor="#888"
    />
  </View>
);


// --- COMPONENTE PRINCIPAL ---
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

      // Guardar el perfil completo al cargarlo
      await AsyncStorage.setItem('userProfile', JSON.stringify(res.data)); 
      
      setUser(res.data);
      setNombre(res.data.nombre);
      setApellidos(res.data.apellidos);
      setTelefono(res.data.telefono);
      setTelefonoEmergencia(res.data.telefonoEmergencia);
    } catch (error: any) {
      console.log('Error fetching profile:', error.message);
      Alert.alert('Error', 'No se pudo cargar tu perfil. Por favor inicia sesión de nuevo.');
      // navigation.navigate('Login'); // Descomentar si quieres redirigir a Login
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

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No se encontró token');

      const res = await api.put(
        '/auth/me',
        { nombre, apellidos, telefono, telefonoEmergencia },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Guardar el perfil actualizado
      await AsyncStorage.setItem('userProfile', JSON.stringify(res.data));

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
      <View style={profileStyles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.NEON_BLUE} />
        <Text style={{color: COLORS.TEXT_LIGHT, marginTop: 10}}>Cargando perfil...</Text>
      </View>
    );
  }

  if (!user) return null;

  return (
    <LinearGradient
      colors={[COLORS.BG_MAIN, COLORS.BG_MAIN, '#303cbd']} // Gradiente oscuro/futurista
      style={profileStyles.gradientBackground}
    >
      <ScrollView
        contentContainerStyle={profileStyles.container}
        keyboardShouldPersistTaps="handled" // Permite que el teclado persista
      >
        {/* Botón volver */}
        <TouchableOpacity style={profileStyles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.NEON_BLUE} />
          <Text style={profileStyles.backText}>Volver</Text>
        </TouchableOpacity>

        <View style={profileStyles.card}>
          <Text style={profileStyles.title}>Datos de Usuario</Text>

          {/* Campos de Perfil */}
          <FieldCard label="Nombre" value={nombre} setter={setNombre} editable={editing} />
          <FieldCard label="Apellidos" value={apellidos} setter={setApellidos} editable={editing} />
          
          {/* Correo - No editable */}
          <FieldCard label="Correo Electrónico" value={user.correo} setter={() => {}} editable={false} /> 
          
          <FieldCard label="Teléfono" value={telefono} setter={setTelefono} editable={editing} keyboardType="numeric" />
          <FieldCard label="Teléfono de Emergencia" value={telefonoEmergencia} setter={setTelefonoEmergencia} editable={editing} keyboardType="numeric" />

          <TouchableOpacity
            style={[profileStyles.button, editing ? profileStyles.saveButton : profileStyles.editButton]}
            onPress={editing ? handleUpdate : () => setEditing(true)}
          >
            <Text style={profileStyles.buttonText}>
              {editing ? 'Guardar Cambios' : 'Editar Perfil'}
            </Text>
          </TouchableOpacity>
          
          {editing && (
              <TouchableOpacity
                style={profileStyles.cancelButton}
                onPress={() => {
                  setEditing(false);
                  // Opcional: Recargar los datos originales si cancela
                  if(user) {
                      setNombre(user.nombre);
                      setApellidos(user.apellidos);
                      setTelefono(user.telefono);
                      setTelefonoEmergencia(user.telefonoEmergencia);
                  }
                }}
              >
                <Text style={profileStyles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
          )}

        </View>
      </ScrollView>
    </LinearGradient>
  );
};

// --- ESTILOS MEJORADOS ---
const profileStyles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: COLORS.BG_MAIN,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backText: {
    color: COLORS.NEON_BLUE,
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '700',
  },
  card: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: COLORS.BG_CARD, // Fondo oscuro semi-transparente
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: COLORS.NEON_PURPLE, // Borde neón
    // Sombra de caja para efecto de brillo
    shadowColor: COLORS.NEON_PURPLE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_ACCENT,
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: COLORS.NEON_BLUE, // Efecto de texto neón
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  fieldCard: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    padding: 12,
    borderRadius: 10,
    color: COLORS.TEXT_ACCENT,
    borderWidth: 1,
  },
  readOnlyInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: COLORS.TEXT_LIGHT,
  },
  editableInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: COLORS.NEON_BLUE, // Borde de edición neón
    borderWidth: 2,
  },
  button: {
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignSelf: 'center',
    minWidth: '70%',
  },
  editButton: {
    backgroundColor: COLORS.NEON_BLUE, // Botón de Editar
  },
  saveButton: {
    backgroundColor: COLORS.NEON_PURPLE, // Botón de Guardar
  },
  buttonText: {
    color: COLORS.TEXT_ACCENT,
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    alignSelf: 'center',
  },
  cancelButtonText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  }
});

export default ProfileScreen;