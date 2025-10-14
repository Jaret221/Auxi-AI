// src/theme/AppTheme.js
import { StyleSheet } from 'react-native';

export const AppThemeProtocolo = StyleSheet.create({
  // Estilos generales
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
  },
  
  // Componentes comunes
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  
  // Textos
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  
  // Botones
  button: {
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    elevation: 3,
    minWidth: '30%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Variantes de botones
  primaryButton: {
    backgroundColor: '#27AE60',
    borderColor: '#219653',
  },
  secondaryButton: {
    backgroundColor: '#3498DB',
    borderColor: '#2980B9',
  },
  dangerButton: {
    backgroundColor: '#E74C3C',
    borderColor: '#C0392B',
  },
  warningButton: {
    backgroundColor: '#F39C12',
    borderColor: '#E67E22',
  },
  
  // Inputs
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    color: '#333',
    marginBottom: 12,
  },
  
  // Loading
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
});

// Colores exportables para usar en componentes
export const Colorsth = {
  primary: '#27AE60',
  secondary: '#3498DB',
  danger: '#E74C3C',
  warning: '#F39C12',
  info: '#9B59B6',
  light: '#ECF0F1',
  dark: '#2C3E50',
  success: '#2ECC71',
};