import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Pressable,
  SafeAreaView,
  Alert,
  Dimensions, // Importar Dimensions para cálculos de tamaño
  Image, // ¡Importar el componente Image!
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// Módulos de Mapa y Ubicación
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
// Importamos el script de emergencia (asumiendo que existe)
import { sendEmergencySMS } from './utils/emergencyContact';

// Importación de estilos y tema (asegúrate de que estas rutas sean correctas)
import { appTheme } from '../styles/appTheme';
import { styles } from '../styles/HomeScreen.styles';

// Tipado para las coordenadas de ubicación
interface LocationCoords {
  latitude: number;
  longitude: number;
}

// CONSTANTES
const MAP_TOOLS_BAR_WIDTH_VISIBLE = 65;

// COLORES PARA DEGRADADO VERTICAL:
const LIGHT_TOP_COLOR = '#FFFFFF';
const FUTURISTIC_BG_MAIN = '#303cbd';
const FUTURISTIC_BG_END = '#545a91ff';
const WhiteF = '#deccd2ff';

export default function HomeScreen({ navigation }: any) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mapToolsVisible, setMapToolsVisible] = useState(true);
  
  // [CORRECCIÓN] Inicializamos mapVisible en FALSE para evitar que se abra al inicio
  const [mapVisible, setMapVisible] = useState(false); 

  const mapRef = useRef<MapView>(null);
  const slideAnim = useRef(new Animated.Value(280)).current;
  const mapToolsSlideAnim = useRef(new Animated.Value(0)).current;

  // Animación para la imagen
  const imageAnim = useRef(new Animated.Value(0)).current;

  // EFECTO para obtener la ubicación al cargar la pantalla y animar la imagen
  useEffect(() => {
    // Aún cargamos la ubicación en segundo plano, aunque el mapa no se muestre
    getCurrentLocation();

    // Animación de la imagen: Aparecer y hacer un pequeño "bounce"
    Animated.timing(imageAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  /**
   * Obtiene la ubicación actual del usuario y solicita permisos si es necesario.
   * @returns Las coordenadas de ubicación o null si falla.
   */
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('El permiso de ubicación fue denegado.');
      return null;
    }

    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      return currentLocation.coords;
    } catch (e) {
      setErrorMsg('No se pudo obtener la ubicación actual.');
      return null;
    }
  };

  /**
   * Muestra u oculta el menú lateral (Derecha) con animación.
   */
  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: 280,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 10,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  /**
   * Muestra u oculta la barra lateral de herramientas del mapa (Izquierda) con animación.
   */
  const toggleMapTools = () => {
    const targetValue = mapToolsVisible ? -(MAP_TOOLS_BAR_WIDTH_VISIBLE + 20) : 0;

    Animated.timing(mapToolsSlideAnim, {
      toValue: targetValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMapToolsVisible(!mapToolsVisible));
  };

  /**
   * Alterna la visibilidad del mapa.
   */
  const toggleMapVisibility = () => {
    setMapVisible(prev => !prev);
    // Si se hace visible y ya tenemos la ubicación, centramos el mapa inmediatamente
    if (!mapVisible && location) {
      recenterMap();
    }
  };


  /**
   * Navega a una pantalla y cierra el menú.
   */
  const handleNavigation = (screen: string, params: any = {}) => {
    navigation.navigate(screen, params);
    if (menuVisible) {
        toggleMenu();
    }
  };

  /**
   * Maneja el cierre de sesión simulado.
   */
  const handleLogout = () => {
    Alert.alert('Sesión Cerrada', 'Sesión cerrada correctamente');
    toggleMenu();
    navigation.navigate('Login');
  };

  /**
   * Centra el mapa en la ubicación actual del usuario.
   */
  const recenterMap = async () => {
    // Si el mapa no está visible, lo hacemos visible primero
    if (!mapVisible) {
      setMapVisible(true);
    }
    
    // Si la ubicación ya está cargada, la usamos, si no, la obtenemos de nuevo
    const coords = location || await getCurrentLocation();
    
    if (coords && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  // 1. ESTILO DINÁMICO DEL CONTENEDOR DEL MAPA (Alineación con la barra izquierda)
  const mapContainerStyle = {
    // Si la barra está visible, el margen izquierdo empuja el mapa más allá de la barra.
    marginLeft: mapToolsVisible ? MAP_TOOLS_BAR_WIDTH_VISIBLE : Dimensions.get('window').width * 0.05,

    // Si la barra está visible, reducimos el ancho para que quepa en el espacio restante más el margen derecho (5% de la pantalla).
    width: mapToolsVisible
        ? Dimensions.get('window').width - MAP_TOOLS_BAR_WIDTH_VISIBLE - (Dimensions.get('window').width * 0.05)
        : Dimensions.get('window').width * 0.9,

    // Controlar la altura para "mitad de tamaño" (aprox. 45% de la altura de la ventana) o "oculto" (0)
    height: mapVisible
        ? Dimensions.get('window').height * 0.45
        : 0,

    // Si no es visible, quitamos los márgenes verticales para que no ocupe espacio
    marginTop: mapVisible ? 20 : 0,
    marginBottom: mapVisible ? 20 : 0,
  };

  // 2. Ajuste de posición del botón de toggle (para que se mantenga fijo fuera/dentro de la barra)
  const mapToggleButtonDynamicStyle = {
    transform: [{
      translateX: mapToolsVisible ? MAP_TOOLS_BAR_WIDTH_VISIBLE : 0
    }]
  };


  // Gradiente vertical principal (Fondo de toda la pantalla)
  const gradientColors = [
    LIGHT_TOP_COLOR,
    LIGHT_TOP_COLOR,
    FUTURISTIC_BG_MAIN,
    FUTURISTIC_BG_END,
  ];

  const gradientLocations = [
    0.0,
    0.10,
    0.30,
    1.0,
  ];

  return (
    // Se añade el degradado vertical para el fondo completo
    <LinearGradient
      colors={gradientColors}
      locations={gradientLocations}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>

        {/* HEADER FUTURISTA (Barra Superior) */}
        <View style={styles.futuristicHeaderContainer}>
          <View style={styles.futuristicHeader}>
            <TouchableOpacity style={styles.menuToggleButton} onPress={toggleMenu}>
              <Ionicons name="menu" size={28} style={styles.headerIcon} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Fin del Header */}

        {/* Body (Contenedor principal para el mapa y controles) */}
        <View style={styles.body}>

          {/* BARRA DE HERRAMIENTAS DEL MAPA (Izquierda - ABSOLUTO) */}
          <Animated.View
            style={[
              styles.mapToolsBar,
              { transform: [{ translateX: mapToolsSlideAnim }] }
            ]}
          >

            {/* 1. BOTÓN HELP */}
            <TouchableOpacity
              style={styles.helpButtonMapTools}
              onPress={() => handleNavigation('Help')}
            >
              <Ionicons name="help-circle-outline" size={24} color={appTheme.colors.white} />
            </TouchableOpacity>

            {/* 2. BOTÓN SOS (Llamada de emergencia) */}
            <TouchableOpacity
              style={styles.sosButton}
              onPress={sendEmergencySMS}
            >
              <Ionicons name="flash-sharp" size={24} color={appTheme.colors.white} />
            </TouchableOpacity>

            {/* 3. BOTÓN TOGGLE MAP (Alterna visibilidad) */}
            <TouchableOpacity
              style={styles.recenterButton}
              onPress={toggleMapVisibility}
            >
              <Ionicons
                name={mapVisible ? "map-outline" : "map-sharp"}
                size={24}
                color={appTheme.colors.white}
              />
            </TouchableOpacity>
            
            {/* 4. BOTÓN RECENTER (Solo visible si el mapa está abierto) */}
            {mapVisible && (
              <TouchableOpacity
                style={[styles.recenterButton, {marginTop: 10}]}
                onPress={recenterMap}
              >
                <Ionicons 
                  name="locate-outline" // Icono de centrar/localizar
                  size={24} 
                  color={appTheme.colors.white} 
                />
              </TouchableOpacity>
            )}
            
          </Animated.View>

          {/* BOTÓN TOGGLE para la barra de herramientas del mapa (Flecha - ABSOLUTO) */}
          <Animated.View style={[styles.mapToolsToggleButtonContainer, mapToggleButtonDynamicStyle]}>
            <TouchableOpacity
              style={styles.mapToolsToggleButton}
              onPress={toggleMapTools}
            >
              <Ionicons
                name={mapToolsVisible ? "chevron-back-circle-outline" : "chevron-forward-circle-outline"}
                size={30}
                color={appTheme.colors.neonBlue}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Nuevo Contenedor de Gradiente para el Fondo Diagonal (Cuerpo de la aplicación) */}
          <LinearGradient
            colors={[FUTURISTIC_BG_MAIN, WhiteF]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.bodyContentWrapper}
          >

            {/* MAPA */}
            {/* Solo se renderiza si mapVisible es TRUE. Si no hay location, muestra el Placeholder */}
            {mapVisible && (location ? (
                <MapView
                  ref={mapRef}
                  style={[styles.map, mapContainerStyle]}
                  initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  // Deshabilitamos la interacción por defecto para que no se mueva al inicio
                  scrollEnabled={mapVisible}
                  zoomEnabled={mapVisible}
                >
                  <Marker
                    coordinate={location}
                    title="Tu Ubicación Actual"
                    pinColor="red"
                  />
                </MapView>
              ) : (
                <View style={[styles.mapPlaceholder, mapContainerStyle]}>
                  <Text style={styles.mapPlaceholderText}>
                    {errorMsg || 'Cargando ubicación...'}
                  </Text>
                </View>
              ))
            }

            {/* IMAGEN CON ANIMACIÓN Y BORDE DE RADIO */}
            <Animated.View style={[
                styles.imageContainer,
                {
                    opacity: imageAnim,
                    transform: [{
                        scale: imageAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0.8, 1.05, 1],
                        }),
                    }],
                }
            ]}>
                <Image
                    source={require('../../assets/Fondos/new/Newlog.png')}
                    style={styles.animatedImage}
                />
            </Animated.View>

            {/* Texto "La IA que siempre te cuida" */}
            <Text style={styles.auxiCareText}>
                La IA que siempre te cuida
            </Text>

            {/* Chat Button (Acceso al chat con AuxiIA) */}
            <TouchableOpacity
              style={styles.auxiChatButton}
              onPress={() => navigation.navigate('Chat')}
            >
              <Text style={styles.auxiChatText}>AuxiChat</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Menú lateral animado (Side Menu - DERECHA) */}
        {menuVisible && (
          <>
            <Pressable style={styles.overlay} onPress={toggleMenu} />

            <Animated.View
              style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}
            >
              <Text style={styles.menuTitle}>Menú Principal</Text>

              {/* Items del Menú */}
              <MenuItem
                icon="person-outline"
                text="Datos de Usuario"
                onPress={() => handleNavigation('Profile', { id: 1 })}
              />
              <MenuItem
                icon="document-text-outline"
                text="Historial Médico"
                onPress={() => handleNavigation('HistorialMedico')}
              />
              <MenuItem
                icon="list-outline"
                text="Protocolos"
                onPress={() => handleNavigation('ProtocolSearch')}
              />
              <MenuItem
                icon="mic-outline"
                text="Voice Settings"
                onPress={() => handleNavigation('VoiceSettings')}
              />
              <MenuItem
                icon="book-outline"
                text="Términos y Condiciones"
                onPress={() => handleNavigation('Terminos')}
              />

              {/* Botón de Logout */}
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

// Sub-componente para los items del menú
const MenuItem = ({ icon, text, onPress }: { icon: any, text: string, onPress: () => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons
      name={icon}
      size={20}
      style={styles.menuItemIcon}
    />
    <Text style={styles.menuItemText}>{text}</Text>
  </TouchableOpacity>
);