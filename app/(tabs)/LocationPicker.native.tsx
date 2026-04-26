import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
// USE THIS (Standard Expo path):
import { ThemedText } from '@/components/themed-text';

export function LocationPicker({ visible, onClose, onLocationSelect }: any) {
  const [region, setRegion] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);

  useEffect(() => {
    if (visible) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        let location = await Location.getCurrentPositionAsync({});
        const initialRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setRegion(initialRegion);
        setMarker(initialRegion);
      })();
    }
  }, [visible]);

  const handleConfirm = () => {
    if (marker) {
      onLocationSelect(marker);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {region ? (
          <MapView
            style={styles.map}
            initialRegion={region}
            onPress={(e) => setMarker(e.nativeEvent.coordinate)}
          >
            {marker && <Marker coordinate={marker} />}
          </MapView>
        ) : (
          <View style={styles.loading}><ThemedText>Loading Map...</ThemedText></View>
        )}
        
        <View style={styles.footer}>
          <ThemedText style={styles.hint}>Move the pin to the pickup spot</ThemedText>
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <ThemedText style={styles.confirmText}>Confirm Location</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
            <ThemedText style={styles.cancelText}>Cancel</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  footer: { 
    padding: 20, 
    backgroundColor: '#FFF', 
    borderTopLeftRadius: 25, 
    borderTopRightRadius: 25,
    elevation: 10
  },
  hint: { textAlign: 'center', marginBottom: 15, color: '#7F8C8D', fontWeight: '600' },
  confirmBtn: { backgroundColor: '#2E9081', padding: 16, borderRadius: 15, alignItems: 'center' },
  confirmText: { color: '#FFF', fontWeight: '900' },
  cancelBtn: { marginTop: 15, alignItems: 'center' },
  cancelText: { color: '#E74C3C', fontWeight: '700' }
});