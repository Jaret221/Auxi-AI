// src/utils/emergencyContact.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';

/**
 * Obtiene el número de emergencia del usuario desde el almacenamiento local ('userProfile').
 */
const getEmergencyNumber = async (): Promise<string | null> => {
  try {
    const userString = await AsyncStorage.getItem('userProfile');
    
    if (userString) {
      const user = JSON.parse(userString);
      // Retorna el número de emergencia guardado
      return user.telefonoEmergencia || null; 
    }
    return null; 
  } catch (error) {
    console.error("Error al obtener el número de emergencia:", error);
    return null;
  }
};

/**
 * Función principal que pide la ubicación, formatea el SMS y abre la app de mensajería.
 * tOMAR en cuenta que solo funciona por SMS, no usar en whats aun u otra plataforma de mensajeria*/
export const sendEmergencySMS = async () => {
  let location;
  const numeroEmergencia = await getEmergencyNumber();

  if (!numeroEmergencia) {
    Alert.alert(
      "Error de Contacto", 
      "No se encontró un número de emergencia guardado. Por favor, revisa tu perfil en 'Datos de Usuario'."
    );
    return;
  }

  try {
    // 1. Pedir y Obtener ubicación
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        "Permiso Denegado", 
        "Se necesita permiso de ubicación para enviar el SMS de emergencia."
      );
      return;
    }
    location = await Location.getCurrentPositionAsync({});

    // 2. Formatear mensaje (usando un enlace de Google Maps)
    const { latitude, longitude } = location.coords;
    const mapaLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    const mensaje = `Esta es un mensaje del servicio de AuxiAI, la persona de contacto de mergencia solicita tu ¡AYUDA! Necesita asistencia inmediata. Su ubicación actual es: ${mapaLink}`;

    // 3. Preparar la URL para el SMS
    const urlSms = `sms:${numeroEmergencia}?body=${encodeURIComponent(mensaje)}`;
    
    // Alerta de confirmación antes de abrir la app de SMS
    Alert.alert(
      "Alerta de Emergencia",
      `Se enviará un SMS de ayuda al número ${numeroEmergencia}. Presiona 'Enviar' en la siguiente pantalla.`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Enviar SMS", onPress: () => Linking.openURL(urlSms) }
      ]
    );

  } catch (error) {
    console.error("Error al enviar SMS de emergencia:", error);
    Alert.alert("Error", "Ocurrió un error al intentar enviar el SMS.");
  }
};