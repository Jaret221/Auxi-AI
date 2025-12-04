// src/screens/HelpScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from "react-native";
import { appTheme } from "../../styles/appTheme";
import { TerminosContent } from '../components/TerminosContent'; 

export default function HelpScreen({ navigation }: any) {
  // Estado para controlar la visibilidad del modal
  const [modalVisible, setModalVisible] = useState(false);

  return (
    // MODIFICADO: Aplicando un estilo extra a la View principal para el borde superior.
    <View style={[appTheme.container, styles.mainContainerWithBorder]}>
      <Text style={styles.title}>Ayuda / Información</Text>
      <Text style={styles.text}>
        Aquí puedes colocar información de ayuda, tutoriales o instrucciones para el usuario.
      </Text>

      {/* Tarjeta Conócenos */}
      <View style={[styles.card, styles.cardWithBorder]}>
        <Text style={styles.cardTitle}>Conócenos</Text>
        <Text style={styles.cardText}>
          Somos AuxiAI, una aplicación diseñada para brindar asistencia inmediata en emergencias médicas, con información clara y fácil de usar.
        </Text>
      </View>

      {/* Botón para abrir los Términos y Condiciones */}
      <TouchableOpacity 
        style={styles.termsButton} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.termsButtonText}>Ver Términos y Condiciones</Text>
      </TouchableOpacity>
      
      {/* Botón Volver */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>

      {/* ----------------------------------------------------------------- */}
      {/* Modal de Términos y Condiciones */}
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
            {/* Título del modal */}
            <Text style={[styles.modalTitle, styles.modalTitleWithBorder]}>
              Términos y Condiciones
            </Text>
            
            <ScrollView style={styles.modalScrollView}>
              <TerminosContent />
            </ScrollView>

            <TouchableOpacity 
              style={[styles.button, styles.modalCloseButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ----------------------------------------------------------------- */}
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  // NUEVO ESTILO: Borde superior para la View principal
  mainContainerWithBorder: {
    borderTopWidth: 30,
    borderTopColor: '#ede2e2ff', // Un color gris claro para un borde sutil en el contenedor principal
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    marginHorizontal: 20,
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 30,
  },
  // Borde superior para la tarjeta "Conócenos"
  cardWithBorder: {
    borderTopWidth: 5,
    borderTopColor: '#3498db',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  cardText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#3498db",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10, 
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  termsButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#9b59b6",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  termsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: '600',
  },
  
  // ESTILOS DEL MODAL
  modalOverlay: { 
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
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
  modalTitle: { 
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  // Borde superior para el título del modal
  modalTitleWithBorder: {
    borderTopWidth: 5, 
    borderTopColor: '#9b59b6',
    paddingTop: 5,
    marginTop: -25,
  },
  modalScrollView: { 
    maxHeight: '70%',
  },
  modalCloseButton: { 
    marginTop: 20,
    backgroundColor: '#3498db',
  }
});