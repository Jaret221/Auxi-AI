import { StyleSheet, Dimensions } from 'react-native';
import { appTheme } from './appTheme'; 

const { width } = Dimensions.get('window');

// Definiciones de colores para la estética futurista
const FUTURISTIC_BG = '#4654eba8'; // Azul muy oscuro/casi negro (Personalizado)
const NEON_BLUE = '#50dbdbff'; // Azul cian neón (Personalizado)
const ERROR_NEON = '#FF005A'; // Rojo/Rosa neón para SOS
const WhiteF = '#deccd2e2'; // Tono Blanco/Rosa suave para fondo

// Dimensiones de la imagen para asegurar que sea un círculo centrado
const IMAGE_SIZE = width * 0.45; // Aproximadamente el 45% del ancho de la pantalla

export const styles = StyleSheet.create({
  // --- GRADIENTE DE FONDO ---
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  
  // --- HEADER FUTURISTA ---
  futuristicHeaderContainer: {
    paddingTop: appTheme.spacing.sm,
    backgroundColor: WhiteF,
    borderBottomWidth: 2,
    borderBottomColor: NEON_BLUE,
    borderTopWidth: 5,
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 8,
  },
  futuristicHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: appTheme.spacing.lg,
    paddingVertical: appTheme.spacing.md,
  },
  menuToggleButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: NEON_BLUE,
  },
  headerIcon: {
    color: NEON_BLUE,
  },
  
  // --- BODY & WRAPPER ---
  body: {
    flex: 1,
    paddingHorizontal: 0, 
    position: 'relative', 
  },
  bodyContentWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // Asegura que el contenido central (mapa/imagen/chat) tenga espacio
    paddingHorizontal: appTheme.spacing.lg, 
    paddingVertical: appTheme.spacing.xl,
  },
  
  // --- NUEVOS ESTILOS PARA LA IMAGEN ANIMADA ---
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2, // Borde de radio para hacerlo circular
    overflow: 'hidden', // Necesario para que la imagen respete el borde
    marginBottom: appTheme.spacing.xl, 
    marginTop: appTheme.spacing.md,
    // Borde doble neón para la estética futurista
    borderWidth: 5, 
    borderColor: NEON_BLUE, 
    backgroundColor: FUTURISTIC_BG, // Fondo para la imagen
    
    // Sombra de neón
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 15, 
  },
  animatedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    // La imagen no necesita borderRadius aquí si el contenedor lo tiene y usa overflow: 'hidden'
  },

  // Texto "La IA que siempre te cuida"
  auxiCareText: {
    ...appTheme.typography.body,
    color: WhiteF,
    fontSize: 22, // Ligeramente más grande para que destaque
    fontWeight: 'bold',
    marginBottom: appTheme.spacing.xl,
    textAlign: 'center',
    textShadowColor: FUTURISTIC_BG, 
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  // Chat Button
  auxiChatButton: {
    backgroundColor: NEON_BLUE,
    paddingVertical: appTheme.spacing.md,
    paddingHorizontal: appTheme.spacing.xl,
    borderRadius: appTheme.layout.borderRadius.large,
    marginBottom: appTheme.spacing.xl,
    borderWidth: 2,
    borderColor: appTheme.colors.white,
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 15,
  },
  auxiChatText: {
    ...appTheme.typography.h3,
    color: FUTURISTIC_BG,
    fontWeight: '900',
  },
  
  // --- MAPA ---
  map: {
    borderRadius: 15,
    borderWidth: 4,
    borderColor: NEON_BLUE, 
    overflow: 'hidden', 
  },
  mapPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a144e',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: NEON_BLUE,
  },
  mapPlaceholderText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
  },

  // --- BARRA DE HERRAMIENTAS DEL MAPA ---
  mapToolsBar: {
    position: 'absolute',
    top: 60, 
    left: 0, 
    zIndex: 10,
    backgroundColor: 'rgba(20, 57, 78, 0.6)', 
    borderRadius: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: NEON_BLUE,
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 10,
    width: 55,
    // Espaciado adicional en la barra para que no esté demasiado pegado al borde
    marginVertical: appTheme.spacing.lg,
    marginLeft: appTheme.spacing.sm,
  },
  mapToolsToggleButtonContainer: {
    position: 'absolute',
    top: 130, 
    left: 0, 
    zIndex: 15, 
    padding: 0,
  },
  mapToolsToggleButton: {
    padding: 10, 
    borderRadius: 16, 
    backgroundColor: '#0da2ff8a'
  },
  helpButtonMapTools: {
    backgroundColor: NEON_BLUE, 
    width: 45, 
    height: 50, 
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, 
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  sosButton: {
    backgroundColor: ERROR_NEON, 
    width: 45, 
    height: 50, 
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, 
    shadowColor: ERROR_NEON,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 12,
  },
  recenterButton: {
    backgroundColor: NEON_BLUE, 
    width: 45, 
    height: 50, 
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },

  // --- Estilos del Menú Lateral ---
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 100, // Ajustado para estar encima del resto del contenido pero debajo del menú
  },
  menuContainer: {
    position: 'absolute',
    top: 25, 
    right: 0,
    width: 280,
    height: '100%',
    backgroundColor: FUTURISTIC_BG,
    padding: appTheme.spacing.lg,
    zIndex: 101, // Debe ser el más alto
    borderLeftWidth: 2,
    borderLeftColor: NEON_BLUE,
    elevation: 10,
    borderRadius:10,
  },
  menuTitle: {
    ...appTheme.typography.h3,
    marginBottom: appTheme.spacing.lg,
    textAlign: 'center',
    color: NEON_BLUE,
    textShadowColor: NEON_BLUE,
    textShadowRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: appTheme.spacing.md,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
    marginBottom: appTheme.spacing.sm,
  },
  menuItemIcon: {
    color: NEON_BLUE,
    marginRight: appTheme.spacing.md,
  },
  menuItemText: {
    ...appTheme.typography.body,
    color: appTheme.colors.white,
  },
  logoutButton: {
    marginTop: 'auto', 
    padding: appTheme.spacing.md,
    borderRadius: 5,
    backgroundColor: ERROR_NEON, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: appTheme.colors.white,
    shadowColor: ERROR_NEON,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutText: {
    ...appTheme.typography.body,
    color: appTheme.colors.white,
    fontWeight: 'bold',
  },
  
  // Estilos obsoletos eliminados o mantenidos
  headerContainer: { display: 'none' },
  header: { display: 'none' },
  helpButton: { display: 'none' },
  helpText: { display: 'none' },
  sosText: { display: 'none' },
  centerPhrase: { display: 'none' } 
});