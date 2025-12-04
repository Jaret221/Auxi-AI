import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  // ImageBackground, // Eliminado para usar LinearGradient
  Animated,
  Easing,
  SafeAreaView // Añadido para un layout correcto
} from 'react-native';
import * as Speech from 'expo-speech';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient'; // Importado para el fondo
// Se asume que AppThemeProtocolo y Colorsth están definidos en sus respectivas rutas
import { AppThemeProtocolo } from '../../styles/AppThemeProtocol';
import { Colorsth } from '../../styles/Colors';
// const BACKGROUND_IMAGE = require('../../../assets/Fondos/protocol.png'); // Eliminado

// --- TIPADO ---
type FirstAidProtocol = {
  keywords: string[];
  title: string;
  steps: string[];
  severity: 'leve' | 'moderada' | 'grave';
  immediateActions: string[];
  color: string;
};

type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'loading';

// --- COMPONENTE PRINCIPAL ---
const ProtocolSearchScreen = ({ route }) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState<FirstAidProtocol | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('idle');
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 0.9,
    voice: null
  });
  const [loading, setLoading] = useState(true);
  const [voices, setVoices] = useState([]);
  // Animaciones para los botones
  const buttonScale = new Animated.Value(1);
  const buttonOpacity = new Animated.Value(1);

  // --- PROTOCOLOS DE PRIMEROS AUXILIOS ---
  const firstAidProtocols: FirstAidProtocol[] = [
    {
      keywords: ['quemadura', 'quemado', 'fuego', 'calor', 'quemó', 'ampolla', 'agua hirviendo', 'grasas calientes', 'piel roja', 'piel ampollada', 'quemadura tercer grado'],
      title: 'Quemaduras',
      severity: 'moderada',
      color: Colorsth.warning,
      immediateActions: [
        'Enfriar la zona con agua a temperatura ambiente durante 10-15 minutos',
        'No usar hielo directamente ni cremas caseras',
        'Cubrir con gasa estéril sin presionar',
      ],
      steps: [
        '1. Identificar el tipo de quemadura (leve, moderada, grave)',
        '2. Enfriar con agua limpia sin frotar la zona',
        '3. Cubrir con tela limpia sin aplicar cremas',
        '4. Buscar atención médica si la quemadura es extensa o en zonas delicadas',
      ],
    },
    {
      keywords: ['herida', 'corte', 'sangrado', 'hemorragia', 'raspón', 'punzadura', 'sangrado leve', 'sangrado abundante', 'chorro de sangre'],
      title: 'Heridas y Sangrado',
      severity: 'moderada',
      color: Colorsth.warning,
      immediateActions: [
        'Aplicar presión con gasa o paño limpio',
        'Elevar la extremidad afectada',
        'No retirar objetos incrustados',
      ],
      steps: [
        '1. Lavar la herida con agua limpia',
        '2. Aplicar presión continua',
        '3. Cubrir con vendaje estéril',
        '4. Buscar ayuda si el sangrado no se detiene tras 10 minutos',
      ],
    },
    {
      keywords: ['insolación', 'golpe de calor', 'deshidratación', 'temperatura alta', 'exposición solar', 'mareo por calor', 'agotamiento por calor'],
      title: 'Insolación/Golpe de Calor',
      severity: 'grave',
      color: Colorsth.danger,
      immediateActions: [
        'Mover a la persona a un lugar fresco y sombreado',
        'Aplicar paños húmedos fríos en cuello, axilas e ingle',
        'Ofrecer líquidos frescos (no alcohólicos) si está consciente',
      ],
      steps: [
        '1. Evaluar nivel de conciencia',
        '2. Bajar la temperatura corporal gradualmente',
        '3. No administrar medicamentos para la fiebre',
        '4. Si pierde el conocimiento, colocarla en posición lateral de seguridad',
        '5. Trasladar a centro médico urgentemente',
      ],
    },
    {
      keywords: ['fractura', 'hueso roto', 'quebradura', 'fisura ósea', 'fractura abierta', 'fractura cerrada', 'dolor intenso', 'deformidad', 'hinchazón'],
      title: 'Fracturas Óseas',
      severity: 'grave',
      color: Colorsth.danger,
      immediateActions: [
        'Inmovilizar la zona afectada sin intentar enderezar el hueso',
        'Aplicar compresas frías para reducir hinchazón (no directamente sobre la piel)',
        'No dar alimentos ni líquidos por si requiere cirugía',
      ],
      steps: [
        '1. Evaluar si es fractura abierta (hueso visible) o cerrada',
        '2. Para fracturas abiertas: cubrir con gasa estéril sin presionar',
        '3. Inmovilizar con férula o tablilla incluyendo las articulaciones adyacentes',
        '4. En extremidades, mantener elevadas para reducir hinchazón',
        '5. Trasladar a centro médico urgentemente evitando movimientos bruscos',
      ],
    },
    {
      keywords: ['ahogamiento', 'asfixia', 'atragantamiento', 'obstrucción vía aérea', 'no puede respirar', 'tos débil', 'incapacidad para hablar', 'labios azules'],
      title: 'Atragantamiento/Asfixia',
      severity: 'grave',
      color: Colorsth.danger,
      immediateActions: [
        'Si la persona tose con fuerza: animar a seguir tosiendo',
        'Si no puede toser, hablar o respirar: aplicar maniobra de Heimlich',
        'En bebés: realizar golpes en la espalda y compresiones torácicas',
      ],
      steps: [
        '1. Para adultos/niños conscientes:',
        '   - Colocarse detrás y rodear su cintura',
        '   - Hacer puño con una mano y colocarlo sobre el abdomen (entre ombligo y esternón)',
        '   - Agarrar el puño con la otra mano y realizar compresiones rápidas hacia arriba y adentro',
        '2. Si la persona pierde el conocimiento: comenzar RCP',
        '3. En embarazadas/obesos: realizar compresiones torácicas en lugar de abdominales',
        '4. Buscar atención médica incluso si se resuelve el atragantamiento',
      ],
    },
    {
      keywords: ['reacción alérgica', 'alergia', 'anafilaxia', 'picadura', 'alergeno', 'hinchazón cara', 'dificultad respiratoria', 'urticaria', 'picazón'],
      title: 'Reacción Alérgica Grave',
      severity: 'grave',
      color: Colorsth.danger,
      immediateActions: [
        'Identificar y retirar el alérgeno si es posible (ej. aguijón)',
        'Administrar autoinyector de epinefrina (EpiPen) si está disponible',
        'Colocar a la persona en posición semisentada si tiene dificultad respiratoria',
      ],
      steps: [
        '1. Evaluar signos de anafilaxia (hinchazón, dificultad respiratoria, pulso débil)',
        '2. Usar epinefrina siguiendo instrucciones del dispositivo',
        '3. Llamar a emergencias inmediatamente',
        '4. Si no mejora en 5-15 minutos, usar segunda dosis si disponible',
        '5. No administrar antihistamínicos orales como primer tratamiento',
        '6. Si pierde el conocimiento, colocarla en posición lateral de seguridad',
        '7. Iniciar RCP si deja de respirar',
      ],
    },
    {
      keywords: ['convulsión', 'epilepsia', 'ataque', 'temblores', 'pérdida de conciencia', 'movimientos involuntarios', 'espasmos'],
      title: 'Convulsiones',
      severity: 'moderada',
      color: Colorsth.warning,
      immediateActions: [
        'Proteger la cabeza con algo suave',
        'Retirar objetos peligrosos del alrededor',
        'No intentar sujetar a la persona ni meter objetos en la boca',
        'Cronometrar la duración de la convulsión',
      ],
      steps: [
        '1. Colocar a la persona de lado (posición lateral de seguridad)',
        '2. Aflojar ropa apretada, especialmente alrededor del cuello',
        '3. Esperar a que termine la convulsión naturalmente',
        '4. Después de la convulsión:',
        '   - Mantener vía aérea despejada',
        '   - No dar alimentos/líquidos hasta estar completamente alerta',
        '   - Proporcionar un lugar tranquilo para recuperarse',
        '5. Buscar ayuda médica si:',
        '   - Es la primera convulsión',
        '   - Dura más de 5 minutos',
        '   - Ocurre en el agua',
        '   - La persona está embarazada o tiene diabetes',
      ],
    },
    {
      keywords: ['desmayo', 'síncope', 'pérdida de conciencia', 'mareo', 'palidez', 'sudor frío', 'vista nublada'],
      title: 'Desmayos',
      severity: 'leve',
      color: Colorsth.success,
      immediateActions: [
        'Colocar a la persona boca arriba y elevar las piernas 30-45 cm',
        'Aflojar ropa apretada',
        'Asegurar buena ventilación',
      ],
      steps: [
        '1. Verificar respiración y pulso',
        '2. Si no respira: iniciar RCP y llamar a emergencias',
        '3. Si respira:',
        '   - Mantener posición con piernas elevadas',
        '   - No ofrecer alimentos/líquidos hasta recuperación completa',
        '   - Cuando despierte, hacerlo sentarse lentamente',
        '4. Investigar posibles causas (ayuno prolongado, calor excesivo, etc.)',
        '5. Buscar atención médica si:',
        '   - No recupera conciencia en 1-2 minutos',
        '   - Presenta convulsiones',
        '   - Tiene dolor en el pecho o dificultad para hablar',
      ],
    },
    {
      keywords: ['intoxicación', 'veneno', 'sobredosis', 'medicamentos', 'productos químicos', 'ingestión tóxica', 'inhalación tóxica'],
      title: 'Intoxicaciones',
      severity: 'grave',
      color: Colorsth.danger,
      immediateActions: [
        'Identificar el tóxico (guardar envase/restos)',
        'Llamar a centro de toxicología inmediatamente',
        'No inducir vómito a menos que lo indique un profesional',
      ],
      steps: [
        '1. Para intoxicación por ingestión:',
        '   - No dar leche ni aceite (pueden empeorar absorción)',
        '   - Para sustancias corrosivas: enjuagar boca con agua',
        '2. Para intoxicación por inhalación:',
        '   - Llevar a la persona a aire fresco',
        '   - Asegurar vías respiratorias',
        '3. Para intoxicación cutánea:',
        '   - Quitar ropa contaminada',
        '   - Lavar con agua corriente durante 15-20 minutos',
        '4. Para intoxicación ocular:',
        '   - Lavar ojo con agua corriente (de nariz hacia afuera) durante 15 minutos',
        '5. Trasladar urgentemente a centro médico con información del tóxico',
      ],
    },
    {
      keywords: ['picadura', 'mordedura', 'abeja', 'avispa', 'araña', 'serpiente', 'alacrán', 'escorpión', 'medusa'],
      title: 'Picaduras y Mordeduras',
      severity: 'moderada',
      color: Colorsth.warning,
      immediateActions: [
        'Lavar zona con agua y jabón',
        'Aplicar compresa fría para reducir hinchazón',
        'Retirar aguijón raspando (no con pinzas)',
        'Inmovilizar extremidad si es mordedura de serpiente',
      ],
      steps: [
        '1. Identificar el animal (importante para tratamiento)',
        '2. Para picaduras de abeja/avispa:',
        '   - Retirar aguijón sin apretar el saco de veneno',
        '   - Aplicar compresa fría',
        '3. Para mordedura de serpiente:',
        '   - Mantener la zona afectada por debajo del corazón',
        '   - No succionar veneno, no hacer torniquete',
        '   - Marcar zona de hinchazón con hora para monitorear progreso',
        '4. Para arañas/alacranes:',
        '   - Aplicar compresa fría',
        '   - Capturar el animal si es seguro para identificación',
        '5. Buscar atención médica si:',
        '   - Signos de reacción alérgica',
        '   - Dolor intenso o hinchazón progresiva',
        '   - Mordedura de serpiente venenosa',
      ],
    },
    {
      keywords: ['hipotermia', 'frío', 'temperatura baja', 'escalofríos', 'congelación', 'tiritona', 'piel pálida'],
      title: 'Hipotermia',
      severity: 'grave',
      color: Colorsth.danger,
      immediateActions: [
        'Mover a la persona a lugar cálido y seco',
        'Quitar ropa mojada cuidadosamente',
        'Cubrir con mantas secas (calentar primero tronco, luego extremidades)',
      ],
      steps: [
        '1. Evaluar nivel de conciencia y temperatura corporal',
        '2. Calentamiento pasivo (cubrir con mantas, aislar del suelo)',
        '3. Si está consciente y puede tragar: ofrecer líquidos calientes no alcohólicos',
        '4. No frotar ni masajear extremidades (riesgo de daño tisular)',
        '5. Para congelación:',
        '   - Sumergir en agua tibia (37-39°C) hasta que piel se sonrojee',
        '   - No usar calor directo (estufas, fuego)',
        '6. Evitar que camine si tiene congelación en pies',
        '7. Trasladar a centro médico urgentemente',
      ],
    },
    {
      keywords: ['shock', 'choque', 'trauma', 'pulso rápido', 'piel fría', 'palidez', 'sudoración', 'confusión'],
      title: 'Shock',
      severity: 'grave',
      color: Colorsth.danger,
      immediateActions: [
        'Llamar a emergencias inmediatamente',
        'Acostar a la persona con pierlas elevadas 30 cm (excepto si lesión cabeza/cuello)',
        'Cubrir con manta para mantener temperatura corporal',
      ],
      steps: [
        '1. Identificar posible causa (hemorragia, trauma, alergia, etc.)',
        '2. Controlar hemorragias si las hay',
        '3. Aflojar ropa apretada',
        '4. No dar alimentos ni líquidos',
        '5. Monitorizar consciencia y respiración',
        '6. Si vomita: colocar de lado para evitar aspiración',
        '7. Si pierde el conocimiento: verificar respiración y prepararse para RCP',
        '8. Mantener caliente pero no sobrecalentar',
      ],
    },
    {
      keywords: ['diabetes', 'hipoglucemia', 'azúcar baja', 'insulina', 'mareo diabético', 'temblor', 'confusión', 'sudoración'],
      title: 'Emergencias Diabéticas',
      severity: 'moderada',
      color: Colorsth.warning,
      immediateActions: [
        'Si está consciente y puede tragar: dar azúcar de acción rápida (jugo, caramelos)',
        'Si inconsciente: no poner nada en la boca',
        'Buscar identificación médica (brazalete, collar)',
      ],
      steps: [
        '1. Evaluar nivel de conciencia',
        '2. Para hipoglucemia (azúcar baja):',
        '   - Dar 15g de carbohidratos simples (ej. 1/2 vaso de jugo)',
        '   - Repetir en 15 minutos si no mejora',
        '3. Para hiperglucemia (azúcar alta):',
        '   - No dar insulina a menos que sea el propio paciente',
        '   - Buscar atención médica urgente',
        '4. Si pierde el conocimiento:',
        '   - Colocar en posición lateral de seguridad',
        '   - No administrar nada por boca',
        '   - Llamar a emergencias',
        '5. Monitorizar signos vitales hasta que llegue ayuda',
      ],
    },
  ];

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true
      })
    ]).start();
  };

  const readEssentialInfo = () => {
    if (!selectedProtocol || loading) return;
    
    animateButton();
    setPlaybackStatus('loading');
    
    const actionsText = `Acciones inmediatas: ${selectedProtocol.immediateActions.join('. ')}`;
    const stepsText = `Pasos del protocolo: ${selectedProtocol.steps.join('. ')}`;
    
    setTimeout(() => {
      Speech.speak(`${actionsText}. ${stepsText}`, {
        language: 'es',
        rate: voiceSettings.rate,
        voice: voiceSettings.voice,
        onStart: () => setPlaybackStatus('playing'),
        onDone: () => setPlaybackStatus('idle'),
        onStopped: () => setPlaybackStatus('idle'),
      });
    }, 300);
  };

  const pauseReading = () => {
    animateButton();
    if (playbackStatus === 'playing') {
      Speech.pause();
      setPlaybackStatus('paused');
    }
  };

  const resumeReading = () => {
    animateButton();
    if (playbackStatus === 'paused') {
      Speech.resume();
      setPlaybackStatus('playing');
    }
  };

  const stopReading = () => {
    animateButton();
    Speech.stop();
    setPlaybackStatus('idle');
  };

  const handleSearchFromDetail = () => {
    stopReading();
    setSelectedProtocol(null);
  };

  const handleSelectProtocol = (protocol: FirstAidProtocol) => {
    setSelectedProtocol(protocol);
    setSearchText('');
  };

  const handleBack = () => {
    setSearchText('');
    setSelectedProtocol(null);
    stopReading();
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('voiceSettings');
        if (savedSettings) {
          setVoiceSettings(JSON.parse(savedSettings));
        }
        
        const availableVoices = await Speech.getAvailableVoicesAsync();
        setVoices(availableVoices.filter(v => v.language.includes('es')));
        
        // Determinar una voz por defecto si no hay una guardada
        if (!voiceSettings.voice && availableVoices.length > 0) {
             const defaultVoice = availableVoices.find(v => v.language.includes('es'));
             if (defaultVoice) {
                setVoiceSettings(prev => ({ ...prev, voice: defaultVoice.identifier }));
             }
        }

        if (route.params?.voiceSettings) {
          setVoiceSettings(route.params.voiceSettings);
          await AsyncStorage.setItem('voiceSettings', JSON.stringify(route.params.voiceSettings));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [route.params]);

  // 🚨 CORRECCIÓN DE ERROR APLICADA AQUÍ
  const filteredProtocols = firstAidProtocols.filter(protocol => 
    protocol.keywords.some(keyword => 
      keyword?.toLowerCase().includes(searchText.toLowerCase())
    ) ||
    protocol.title?.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <LinearGradient
        colors={[Colorsth.background, Colorsth.dark]} // Fondo oscuro
        style={AppThemeProtocolo.loadingContainer}
      >
        <ActivityIndicator size="large" color={Colorsth.light} />
        <Text style={AppThemeProtocolo.loadingText}>Cargando configuración...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[Colorsth.background, Colorsth.dark]} // Fondo oscuro/futurista
      style={AppThemeProtocolo.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/*
            APLICANDO TOP APARTIR a la barra de búsqueda (TextInput) 
            Añadido marginTop: 20 (subido de 40)
          */}
          <TextInput
            style={[AppThemeProtocolo.input, { marginTop: 20 }]} 
            placeholder="Buscar protocolo (ej. quemadura, herida)..."
            placeholderTextColor={Colorsth.textDimmed}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
            clearButtonMode="while-editing"
          />

          {selectedProtocol ? (
            <ScrollView style={[AppThemeProtocolo.card, { flex: 1 }]}>
              <View style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.2)', paddingBottom: 15, marginBottom: 15 }}>
                <Text style={[AppThemeProtocolo.title, {color: selectedProtocol.color}]}>
                  {selectedProtocol.title}
                </Text>
                <Text style={[AppThemeProtocolo.subtitle, { color: Colorsth.light, marginTop: 0 }]}>
                  Gravedad: {selectedProtocol.severity?.toUpperCase()}
                </Text>
              </View>

              {/* CONTROLES DE LECTURA (con espaciado mejorado) */}
              <View style={styles.controlsContainer}>
                 {/* Nueva Búsqueda - Botón destacado */}
                 <TouchableOpacity 
                    style={[AppThemeProtocolo.button, AppThemeProtocolo.infoButton, { minWidth: '100%', marginBottom: 10 }]}
                    onPress={handleSearchFromDetail}
                  >
                    <Text style={AppThemeProtocolo.buttonText}>🔍 Nueva Búsqueda</Text>
                  </TouchableOpacity>

                {playbackStatus === 'idle' || playbackStatus === 'loading' ? (
                  // Botón Leer Protocolo
                  <Animated.View style={{ transform: [{ scale: buttonScale }], flexGrow: 1 }}>
                    <TouchableOpacity 
                      style={[AppThemeProtocolo.button, AppThemeProtocolo.primaryButton]}
                      onPress={readEssentialInfo}
                      disabled={!voiceSettings.voice || playbackStatus === 'loading'}
                    >
                      {playbackStatus === 'loading' ? (
                        <ActivityIndicator color={Colorsth.dark} />
                      ) : (
                        <Text style={AppThemeProtocolo.buttonText}>
                          {voiceSettings.voice ? '🔊 Leer Protocolo' : 'Voz no disponible'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                ) : playbackStatus === 'playing' ? (
                  <>
                    {/* Botón Pausar */}
                    <Animated.View style={{ transform: [{ scale: buttonScale }], flexGrow: 1, marginRight: 10 }}>
                      <TouchableOpacity 
                        style={[AppThemeProtocolo.button, AppThemeProtocolo.warningButton]}
                        onPress={pauseReading}
                      >
                        <Text style={AppThemeProtocolo.buttonText}>⏸ Pausar</Text>
                      </TouchableOpacity>
                    </Animated.View>
                    {/* Botón Detener */}
                    <Animated.View style={{ transform: [{ scale: buttonScale }], flexGrow: 1 }}>
                      <TouchableOpacity 
                        style={[AppThemeProtocolo.button, AppThemeProtocolo.dangerButton]}
                        onPress={stopReading}
                      >
                        <Text style={AppThemeProtocolo.buttonText}>🛑 Detener</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  </>
                ) : playbackStatus === 'paused' ? (
                  <>
                    {/* Botón Reanudar */}
                    <Animated.View style={{ transform: [{ scale: buttonScale }], flexGrow: 1, marginRight: 10 }}>
                      <TouchableOpacity 
                        style={[AppThemeProtocolo.button, AppThemeProtocolo.primaryButton]}
                        onPress={resumeReading}
                      >
                        <Text style={AppThemeProtocolo.buttonText}>▶️ Reanudar</Text>
                      </TouchableOpacity>
                    </Animated.View>
                    {/* Botón Detener */}
                    <Animated.View style={{ transform: [{ scale: buttonScale }], flexGrow: 1 }}>
                      <TouchableOpacity 
                        style={[AppThemeProtocolo.button, AppThemeProtocolo.dangerButton]}
                        onPress={stopReading}
                      >
                        <Text style={AppThemeProtocolo.buttonText}>🛑 Detener</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  </>
                ) : null}
              </View>

              {/* Contenido del Protocolo */}
              <Text style={[AppThemeProtocolo.subtitle, { color: Colorsth.primary }]}>Acciones inmediatas:</Text>
              <View style={[styles.textContainer, { borderLeftColor: selectedProtocol.color }]}>
                {selectedProtocol.immediateActions.map((action, index) => (
                  <Text key={index} style={styles.actionItem}>⚡ {action}</Text>
                ))}
              </View>
              
              <Text style={[AppThemeProtocolo.subtitle, { color: Colorsth.primary }]}>Protocolo completo:</Text>
              <View style={[styles.textContainer, { borderLeftColor: selectedProtocol.color }]}>
                {selectedProtocol.steps.map((step, index) => (
                  <Text key={index} style={styles.stepItem}>{step}</Text>
                ))}
              </View>
               
               {/*
                 AJUSTE DE POSICIÓN: Botón Volver a Búsqueda
                 Cambiado marginTop: 40 a marginTop: 20 (subido)
               */}
              <TouchableOpacity 
                style={[AppThemeProtocolo.button, AppThemeProtocolo.secondaryButton, { marginTop: 20, minWidth: '100%' }]}
                onPress={handleBack}
              >
                <Text style={[AppThemeProtocolo.buttonText, { color: Colorsth.secondary }]}>← Volver a Búsqueda</Text>
              </TouchableOpacity>

            </ScrollView>
          ) : (
            <View style={styles.listContainer}>
              {searchText.length > 0 && (
                <View style={{ marginBottom: 15 }}>
                  <Text style={{ color: Colorsth.textDimmed, fontSize: 14 }}>
                     Resultados de la búsqueda para: "{searchText}"
                  </Text>
                </View>
              )}

              {filteredProtocols.length > 0 ? (
                <FlatList
                  data={filteredProtocols}
                  keyExtractor={(item) => item.title}
                  renderItem={({item}) => (
                    <TouchableOpacity 
                      style={[styles.protocolCard, {borderLeftColor: item.color}]}
                      onPress={() => handleSelectProtocol(item)}
                    >
                      <Text style={[styles.protocolTitle, { color: item.color }]}>{item.title}</Text>
                      <Text style={styles.protocolKeywords}>
                        Palabras clave: {item.keywords.slice(0, 3).join(', ')}...
                      </Text>
                      {/* 🚨 CORRECCIÓN DE ERROR APLICADA AQUÍ */}
                      <Text style={styles.protocolSeverity}>
                        Gravedad: {item.severity?.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <View style={[AppThemeProtocolo.card, { alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
                  <Text style={[AppThemeProtocolo.title, { textAlign: 'center', fontSize: 20 }]}>
                    Protocolo no encontrado
                  </Text>
                  <Text style={[AppThemeProtocolo.subtitle, { textAlign: 'center', fontSize: 16, color: Colorsth.textDimmed }]}>
                    No se encontraron protocolos para "{searchText}". Intenta con otras palabras clave (ej. "fractura", "veneno").
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

// Estilos específicos del componente (Adaptados al tema oscuro/neón)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20, // Padding horizontal
  },
  // Mejora del espaciado entre los botones y uso de flexWrap
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Alinear a la izquierda para mejor flujo
    marginBottom: 20, 
    flexWrap: 'wrap',
    gap: 10, // Utilizar gap para espaciado entre elementos
    alignItems: 'center',
  },
  // Card del protocolo en la lista de resultados
  protocolCard: {
    ...AppThemeProtocolo.card, // Hereda el estilo neón de la tarjeta
    borderLeftWidth: 5,
    padding: 18,
    marginBottom: 12, 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Más sutil
  },
  // Título del protocolo en la lista
  protocolTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    color: Colorsth.light, // Texto claro por defecto
  },
  // Palabras clave en la lista
  protocolKeywords: {
    fontSize: 14,
    color: Colorsth.textDimmed,
    opacity: 0.8,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  // Severidad en la lista
  protocolSeverity: {
    fontSize: 14,
    color: Colorsth.secondary, 
    fontWeight: '700',
  },
  // Contenedor de texto para acciones/pasos
  textContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Fondo oscuro semi-transparente
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: Colorsth.secondary,
  },
  // Elementos de acción inmediata
  actionItem: {
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 5,
    color: Colorsth.light,
    lineHeight: 24,
  },
  // Pasos del protocolo
  stepItem: {
    fontSize: 16,
    marginBottom: 10,
    color: Colorsth.light,
    lineHeight: 24,
  },
  listContainer: {
    flex: 1,
  },
});

export default ProtocolSearchScreen;