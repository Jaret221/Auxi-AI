// src/styles/appTheme.ts
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const colors = {
  primary: '#00677F',
  secondary: '#50C878',
  background: '#F0F8FF',
  white: '#FFFFFF',
  black: '#000000',
  text: '#333333',
  textLight: '#777777',
  error: '#E74C3C',
  
  // Colores del gradiente de HomeScreen
  gradientStart: '#E0F7FA', // <--- Aquí está 'gradientStart'
  gradientMid: '#FFFFFF',
  gradientEnd: '#E8F5E9',

  menuBackground: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Define tus espaciados
const spacing = {
  xs: 4,
  sm: 8,
  md: 16, // <--- Aquí está 'md'
  lg: 24,
  xl: 32,
};

// Define tu tipografía
const typography = {
  h1: { fontSize: 28, fontWeight: 'bold', color: colors.primary },
  h2: { fontSize: 24, fontWeight: '600', color: colors.primary },
  h3: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  body: { fontSize: 16, color: colors.text },
};

// Define elementos de layout comunes
const layout = {
  window: { width, height },
  shadow: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 20,
    circle: 999,
  },
  container: {
    flex: 1,
    padding: spacing.md,
  },
};

export const appTheme = {
  colors,
  spacing,
  typography,
  layout,
};