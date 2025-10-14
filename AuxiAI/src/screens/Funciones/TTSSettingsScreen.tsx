import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ImageBackground,
  TouchableOpacity 
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Asegúrate de tener esta imagen en tus assets o usa una URL
const BACKGROUND_IMAGE = require('../../../assets/Fondos/setings.png'); 

const VoiceSettings = ({ navigation }) => {
  const [rate, setRate] = useState(0.8);
  const [voice, setVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ... (resto del código de useEffect y funciones permanece igual) ...
  useEffect(() => {
    const loadVoicesAndSettings = async () => {
      try {
        // Cargar configuración guardada
        const savedSettings = await AsyncStorage.getItem('voiceSettings');
        if (savedSettings) {
          const { rate: savedRate, voice: savedVoice } = JSON.parse(savedSettings);
          setRate(savedRate);
          
          // Cargar voces disponibles
          const availableVoices = await Speech.getAvailableVoicesAsync();
          const spanishVoices = availableVoices.filter(v => v.language.includes('es'));
          setVoices(spanishVoices);
          
          // Establecer voz guardada si existe
          if (savedVoice) {
            const foundVoice = spanishVoices.find(v => v.identifier === savedVoice);
            setVoice(foundVoice || spanishVoices[0]);
          } else {
            setVoice(spanishVoices[0]);
          }
        } else {
          // Cargar solo voces si no hay configuración guardada
          const availableVoices = await Speech.getAvailableVoicesAsync();
          const spanishVoices = availableVoices.filter(v => v.language.includes('es'));
          setVoices(spanishVoices);
          setVoice(spanishVoices[0]);
        }
      } catch (error) {
        console.error('Error loading voices:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadVoicesAndSettings();
  }, []);

  const testSettings = () => {
    if (!voice) return;
    
    Speech.speak('Esta es una prueba de la configuración de voz actual', {
      voice: voice.identifier,
      rate: rate,
      language: 'es'
    });
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await AsyncStorage.setItem('voiceSettings', JSON.stringify({
        rate,
        voice: voice?.identifier
      }));
      
      navigation.navigate('ProtocolSearch', { 
        voiceSettings: {
          rate,
          voice: voice?.identifier
        }
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Cargando voces disponibles...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Configuración de Voz</Text>
        
        <View style={styles.settingContainer}>
          <Text style={styles.label}>Velocidad: {rate.toFixed(1)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={1.5}
            step={0.1}
            value={rate}
            onValueChange={setRate}
            minimumTrackTintColor="#FF6B6B"
            maximumTrackTintColor="#FFFFFF"
            thumbTintColor="#FF6B6B"
          />
        </View>
        
        <View style={styles.settingContainer}>
          <Text style={styles.label}>Tipo de Voz:</Text>
          {voices.length > 0 ? (
            <Picker
              selectedValue={voice?.identifier}
              style={styles.picker}
              onValueChange={(itemValue) => {
                const selected = voices.find(v => v.identifier === itemValue);
                setVoice(selected);
              }}
            >
              {voices.map(v => (
                <Picker.Item 
                  key={v.identifier} 
                  label={`${v.name || 'Voz predeterminada'} (${v.language})`} 
                  value={v.identifier} 
                />
              ))}
            </Picker>
          ) : (
            <Text style={styles.errorText}>No se encontraron voces en español</Text>
          )}
        </View>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.saveButton,
              (saving || !voice) && styles.disabledButton
            ]}
            onPress={saveSettings}
            disabled={saving || !voice}
          >
            <Text style={styles.buttonText}>
              {saving ? "Guardando..." : "Guardar"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.testButton,
              !voice && styles.disabledButton
            ]}
            onPress={testSettings}
            disabled={!voice}
          >
            <Text style={styles.buttonText}>Probar Voz</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.backButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  settingContainer: {
    marginBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333333',
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  picker: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  buttonsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  testButton: {
    backgroundColor: '#2196F3',
    borderColor: '#0D47A1',
  },
  backButton: {
    backgroundColor: '#FF5722',
    borderColor: '#E64A19',
  },
  disabledButton: {
    backgroundColor: '#9E9E9E',
    borderColor: '#616161',
  },
  errorText: {
    color: '#FF5252',
    textAlign: 'center',
    paddingVertical: 10,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 5,
  },
});

export default VoiceSettings;