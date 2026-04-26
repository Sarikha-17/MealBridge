import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';

export function LocationPicker({ visible, onClose }: any) {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ThemedText style={styles.title}>Map Unavailable on Web</ThemedText>
          <ThemedText style={styles.text}>
            Native maps require a mobile device. Please test on **Expo Go** (Android/iOS) to use the map picker.
          </ThemedText>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <ThemedText style={styles.buttonText}>Got it</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  title: { fontSize: 20, fontWeight: '900', marginBottom: 15, color: '#1A242F' },
  text: { textAlign: 'center', marginBottom: 20, color: '#5D6D7E' },
  button: { backgroundColor: '#2E9081', borderRadius: 15, padding: 15, width: '100%' },
  buttonText: { color: 'white', fontWeight: '900', textAlign: 'center' },
});