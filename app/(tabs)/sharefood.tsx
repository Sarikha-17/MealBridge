import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Image, Alert, ActivityIndicator, Modal, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, onSnapshot } from "firebase/firestore";

// @ts-ignore
import { db } from '../../firebaseConfig';
import { ThemedText } from '@/components/themed-text';
import { LocationPicker } from './LocationPicker'; 

export default function DonateFoodForm() {
  const router = useRouter();
  
  // Basic States
  const [karma, setKarma] = useState(0);
  const [foodName, setFoodName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [coordinates, setCoordinates] = useState<{latitude: number, longitude: number} | null>(null);

  // Scanner States
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  // 1. Real-time Karma Listener
  useEffect(() => {
    // Replace 'Sarikha_Demo_Global' with your actual dynamic Auth UID if available
    const userRef = doc(db, "users", "Sarikha_Demo_Global");
    const unsub = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setKarma(snapshot.data().karmaPoints || 0);
      }
    });
    return () => unsub();
  }, []);

  // 2. Camera Handling
  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Required", "Camera access is needed to verify the food.");
      return;
    }
    let result = await ImagePicker.launchCameraAsync({ 
      allowsEditing: true, 
      aspect: [4, 3], 
      quality: 0.6 
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  // 3. QR Handover Logic
  const startScanner = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) return;
    }
    setScanned(false);
    setIsScanning(true);
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    setIsScanning(false);
    setLoading(true);
    try {
      const foodRef = doc(db, "listings", data);
      const userRef = doc(db, "users", "Sarikha_Demo_Global");
      
      await updateDoc(foodRef, { status: "delivered", deliveredAt: serverTimestamp() });
      await updateDoc(userRef, { karmaPoints: increment(50) });
      
      Alert.alert("Handover Verified! ✨", "Thank you for completing the cycle. +50 Karma Points!");
    } catch (error) {
      Alert.alert("Error", "Invalid QR code or transaction already completed.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Submission Logic
  const handlePost = async () => {
    if (!foodName || !coordinates || !image) {
      Alert.alert("Missing Info", "Please provide food name, a photo, and a pickup location.");
      return;
    }

    setLoading(true);
    try {
      const donationData = {
        foodName: foodName.trim(),
        locationCoords: coordinates,
        foodImage: image, // Ideally upload to Firebase Storage first in a production app
        status: "available",
        ownerId: "Sarikha_Demo_Global",
        createdAt: serverTimestamp(),
        type: "Donation",
      };

      await addDoc(collection(db, "listings"), donationData);

      Alert.alert("Live! 🍱", `Your ${foodName} has been listed on the Bridge.`);
      
      // Reset Form
      setFoodName(''); 
      setCoordinates(null); 
      setImage(null);
      router.back();

    } catch (e) {
      Alert.alert("Error", "Could not post donation. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#FFFEF9', '#FDF5E6']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.container}>
        <ImageBackground 
          source={require('../../assets/images/name.jpg')} 
          style={styles.absoluteBG}
          resizeMode="cover"
        />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Karma Stats Header */}
          <View style={styles.impactCard}>
            <LinearGradient colors={['#1A242F', '#2C3E50']} style={styles.impactGradient}>
              <ThemedText style={styles.statLabel}>YOUR KARMA BALANCE</ThemedText>
              <ThemedText style={styles.statNumber}>✨ {karma}</ThemedText>
            </LinearGradient>
          </View>

          <View style={styles.headerSection}>
            <View style={styles.badge}><ThemedText style={styles.badgeText}>COMMUNITY DONOR</ThemedText></View>
            <ThemedText style={styles.title}>List a Meal</ThemedText>
            <ThemedText style={styles.subtitle}>Help bridge the gap between waste and hunger.</ThemedText>
          </View>

          {/* Quick Handover Section */}
          <TouchableOpacity style={styles.scanBtn} onPress={startScanner}>
            <ThemedText style={styles.scanBtnText}>📸 Scan QR to Verify Handover</ThemedText>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} /><ThemedText style={styles.dividerText}>OR DONATE NEW</ThemedText><View style={styles.line} />
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            <TouchableOpacity style={styles.photoUploadBox} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <View style={styles.iconCircle}><ThemedText style={styles.icon}>📸</ThemedText></View>
                  <ThemedText style={styles.uploadText}>Take a Photo</ThemedText>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>What are you donating?</ThemedText>
              <TextInput 
                style={styles.input} 
                placeholder="e.g. 10 Packets of Veg Pulav" 
                placeholderTextColor="#999"
                value={foodName} 
                onChangeText={setFoodName} 
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Pickup Point</ThemedText>
              <TouchableOpacity 
                style={[styles.locationBtn, coordinates && styles.locationSet]} 
                onPress={() => setLocationModalVisible(true)}
              >
                <ThemedText style={[styles.locationBtnText, coordinates && { color: '#FFF' }]}>
                  {coordinates ? '📍 Location Pinned' : '🗺️ Select on Map'}
                </ThemedText>
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#E67E22" style={{ marginVertical: 20 }} />
            ) : (
              <TouchableOpacity style={styles.postBtn} onPress={handlePost}>
                <ThemedText style={styles.postBtnText}>Post Donation →</ThemedText>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={() => router.push('/donators')} style={styles.backBtn}>
            <ThemedText style={styles.backBtnText}>Go Back</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      <LocationPicker 
        visible={locationModalVisible} 
        onClose={() => setLocationModalVisible(false)} 
        onLocationSelect={(coords: any) => setCoordinates(coords)}
      />

      {/* QR Scanner Modal */}
      <Modal visible={isScanning} animationType="slide">
        <View style={styles.scannerContainer}>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
            <TouchableOpacity style={styles.closeScanner} onPress={() => setIsScanning(false)}>
              <ThemedText style={styles.closeScannerText}>Cancel</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  absoluteBG: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scrollContent: { paddingHorizontal: 25, paddingVertical: 40, alignItems: 'center' },
  impactCard: { width: '100%', borderRadius: 20, overflow: 'hidden', marginBottom: 25, elevation: 4 },
  impactGradient: { padding: 20, alignItems: 'center' },
  statLabel: { fontSize: 10, color: '#BDC3C7', fontWeight: '800', letterSpacing: 1 },
  statNumber: { fontSize: 32, color: '#FFF', fontWeight: '900', marginTop: 5 },
  headerSection: { marginBottom: 25, alignItems: 'center' },
  badge: { backgroundColor: '#FDEDEC', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginBottom: 10 },
  badgeText: { color: '#E67E22', fontSize: 10, fontWeight: '800' },
  title: { fontSize: 28, color: '#1A242F', fontWeight: '900' },
  subtitle: { fontSize: 14, color: '#7F8C8D', textAlign: 'center', marginTop: 5 },
  scanBtn: { backgroundColor: '#1A242F', padding: 18, borderRadius: 15, width: '100%', alignItems: 'center' },
  scanBtnText: { color: '#FFF', fontWeight: '800' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 30, width: '100%' },
  line: { flex: 1, height: 1, backgroundColor: '#DDD' },
  dividerText: { marginHorizontal: 10, fontSize: 10, color: '#999', fontWeight: '800' },
  formContainer: { width: '100%', backgroundColor: '#FFF', padding: 20, borderRadius: 25, elevation: 2 },
  photoUploadBox: { backgroundColor: '#F9F9F9', height: 160, borderRadius: 20, borderWidth: 2, borderColor: '#EEE', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  previewImage: { width: '100%', height: '100%', borderRadius: 20 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF', elevation: 2, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  icon: { fontSize: 24 },
  uploadText: { fontSize: 13, fontWeight: '700', color: '#7F8C8D' },
  inputGroup: { marginVertical: 12 },
  label: { fontSize: 14, fontWeight: '700', color: '#1A242F', marginBottom: 8 },
  input: { backgroundColor: '#F5F6F7', padding: 15, borderRadius: 12, fontSize: 16 },
  locationBtn: { padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E67E22', alignItems: 'center' },
  locationSet: { backgroundColor: '#E67E22' },
  locationBtnText: { fontWeight: '700', color: '#E67E22' },
  postBtn: { backgroundColor: '#E67E22', padding: 18, borderRadius: 15, marginTop: 20, alignItems: 'center' },
  postBtnText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  backBtn: { marginTop: 20, padding: 10 },
  backBtnText: { color: '#7F8C8D', fontWeight: '600' },
  scannerContainer: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: 250, height: 250, borderWidth: 2, borderColor: '#E67E22', borderRadius: 20 },
  closeScanner: { marginTop: 40, backgroundColor: '#FFF', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 20 },
  closeScannerText: { fontWeight: '800' }
});