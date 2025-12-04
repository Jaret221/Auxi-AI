import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  Modal, // MODIFICADO: Importar Modal
} from 'react-native';
import api from '../servicios/api';
// MODIFICADO: Importar el componente que contiene el texto de los términos
import { TerminosContent } from './components/TerminosContent'; 

const { width, height } = Dimensions.get('window');

export default function RegisterScreen({ navigation }: any) {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefonoEmergencia, setTelefonoEmergencia] = useState('');
  const [password, setPassword] = useState('');
  // NUEVO: Estados para el checkbox y el modal
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Animaciones (Tu código se mantiene igual)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const cardY = useRef(new Animated.Value(0)).current;
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 1000, useNativeDriver: true }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim1, { toValue: 1, duration: 6000, useNativeDriver: true }),
        Animated.timing(waveAnim1, { toValue: 0, duration: 6000, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim2, { toValue: 1, duration: 8000, useNativeDriver: true }),
        Animated.timing(waveAnim2, { toValue: 0, duration: 8000, useNativeDriver: true }),
      ])
    ).start();
    const keyboardShow = Keyboard.addListener('keyboardDidShow', () => {
      Animated.timing(cardY, {
        toValue: -60,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
    const keyboardHide = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(cardY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, []);

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

    // NUEVO: Validación del checkbox
    if (!aceptaTerminos) {
      Alert.alert('Atención', 'Debes aceptar los Términos y Condiciones para registrarte.');
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
    <View style={styles.background}>
      {/* Ondas animadas (Tu código se mantiene igual) */}
      <Animated.View
        style={[
          styles.wave,
          {
            backgroundColor: '#A9A9A9',
            transform: [
              { translateX: waveAnim1.interpolate({ inputRange: [0, 1], outputRange: [-width / 2, width / 2] }) },
              { scale: waveAnim1.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) },
            ],
            opacity: waveAnim1.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.3] }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.wave,
          {
            backgroundColor: '#2F4F4F',
            transform: [
              { translateX: waveAnim2.interpolate({ inputRange: [0, 1], outputRange: [width / 2, -width / 2] }) },
              { scale: waveAnim2.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) },
            ],
            opacity: waveAnim2.interpolate({ inputRange: [0, 1], outputRange: [0.05, 0.25] }),
          },
        ]}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY }, { translateY: cardY }],
              },
            ]}
          >
            <Image source={require('../../assets/Fondos/new/Newlog.png')} style={styles.logo} />
            <Text style={styles.title}>Registro en AuxiAI</Text>

            <TextInput placeholder="Nombre" style={styles.input} value={nombre} onChangeText={setNombre} />
            <TextInput placeholder="Apellidos" style={styles.input} value={apellidos} onChangeText={setApellidos} />
            <TextInput placeholder="Teléfono" style={styles.input} value={telefono} onChangeText={setTelefono} keyboardType="numeric" />
            <TextInput placeholder="Correo" style={styles.input} value={correo} onChangeText={setCorreo} keyboardType="email-address" />
            <TextInput placeholder="Tel. Emergencia" style={styles.input} value={telefonoEmergencia} onChangeText={setTelefonoEmergencia} keyboardType="numeric" />
            <TextInput placeholder="Contraseña" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

            {/* NUEVO: Checkbox de Términos y Condiciones */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setAceptaTerminos(!aceptaTerminos)}
              >
                {aceptaTerminos && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              
              <View style={styles.termsTextContainer}>
                <Text style={styles.checkboxLabel}>Acepto los </Text>
                {/* MODIFICADO: El onPress abre el modal */}
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text style={styles.termsLink}>Términos y Condiciones</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* FIN DEL CHECKBOX */}

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* NUEVO: Modal de Términos y Condiciones */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Términos y Condiciones</Text>
            
            <ScrollView style={styles.modalScrollView}>
              
              <TerminosContent /> {/* MODIFICADO: Se llama al componente de contenido */}
              
            </ScrollView>

            <TouchableOpacity 
              style={[styles.button, {marginTop: 20}]} // Reutilizamos el estilo del botón
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* FIN DEL MODAL */}

    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  wave: {
    position: 'absolute',
    width: width * 2,
    height: height,
    borderRadius: 999,
  },
  card: {
    backgroundColor: 'rgba(169,169,169,0.25)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  logo: { width: 90, height: 90, marginBottom: 10, borderRadius: 45 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#A9A9A9' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    width: '100%',
  },
  button: { backgroundColor: '#00CED1', borderRadius: 12, paddingVertical: 14, marginTop: 10, width: '100%' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'center' },
  link: { marginTop: 15, textAlign: 'center', color: '#A9A9A9', fontWeight: '500' },

  // --- NUEVOS ESTILOS PARA CHECKBOX Y MODAL ---
  checkboxContainer: { // NUEVO
    flexDirection: 'row',
    alignItems: 'flex-start', 
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 5,
  },
  checkbox: { // NUEVO
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#A9A9A9',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkmark: { // NUEVO
    color: '#00CED1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsTextContainer: { // NUEVO
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  checkboxLabel: { // NUEVO
    color: '#A9A9A9',
    fontSize: 14,
  },
  termsLink: { // NUEVO
    color: '#00CED1',
    fontWeight: 'bold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  modalOverlay: { // NUEVO
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: { // NUEVO
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: { // NUEVO
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  modalScrollView: { // NUEVO
    maxHeight: '70%',
  },
  // NOTA: Los estilos modalText y modalSubTitle se movieron a TerminosContent.tsx
});