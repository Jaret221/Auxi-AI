import { StyleSheet } from 'react-native';
import { Colorsth } from './Colors'; // Importamos la paleta

export const AppThemeProtocolo = StyleSheet.create({
  // Contenedor principal (para el gradiente)
  gradientBackground: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 20,
    // No necesitamos overlay si usamos LinearGradient
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colorsth.background, 
  },
  loadingText: {
    color: Colorsth.light,
    marginTop: 10,
    fontSize: 16,
  },
  // Input con estilo neón
  input: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: Colorsth.light,
    borderWidth: 1,
    borderColor: Colorsth.primary,
    // Sombra para efecto neón
    shadowColor: Colorsth.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 8,
  },
  // Tarjeta con estilo neón
  card: {
    backgroundColor: Colorsth.cardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 166, 0.3)', // Borde Rosa
    shadowColor: Colorsth.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colorsth.light,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colorsth.light,
    marginTop: 10,
    marginBottom: 5,
  },
  // Botones base
  button: {
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1, 
    minWidth: 100,
    // Sombra base
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: Colorsth.dark, // Texto oscuro para botones brillantes
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Variantes de botones neón
  primaryButton: {
    backgroundColor: Colorsth.primary,
    shadowColor: Colorsth.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colorsth.secondary,
    shadowColor: Colorsth.secondary,
  },
  warningButton: {
    backgroundColor: Colorsth.warning,
    shadowColor: Colorsth.warning,
    flexGrow: 1,
    minWidth: '48%',
  },
  dangerButton: {
    backgroundColor: Colorsth.danger,
    shadowColor: Colorsth.danger,
    flexGrow: 1,
    minWidth: '48%',
  },
  infoButton: {
    backgroundColor: Colorsth.info,
    shadowColor: Colorsth.info,
  }
});