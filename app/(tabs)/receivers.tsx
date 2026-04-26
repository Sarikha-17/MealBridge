import React, { useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, FlatList, View, ActivityIndicator, Alert, 
  TouchableOpacity, SafeAreaView, Modal, Image, ImageBackground, Linking, 
  Platform
} from 'react-native';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from 'expo-sharing';
import { useRouter } from 'expo-router'; // Added this import
import { ThemedText } from '@/components/themed-text';

// @ts-ignore
import { db } from '../../firebaseConfig';

interface FoodListing {
  id: string;
  foodName: string;
  quantity: string | number; 
  status: string;
  foodImage?: string; 
  role?: 'donator' | 'merchant';
  locationCoords?: { latitude: number; longitude: number };
}

export default function ExploreScreen() {
  const router = useRouter(); // Initialize router
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{id: string, name: string} | null>(null);
  
  const viewShotRef = useRef<any>(null);

  useEffect(() => {
    // 1. Fetch available listings
    const q = query(collection(db, "listings"), where("status", "==", "available"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allData = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
      } as FoodListing));
      
      // 2. Filter logic: Show items < 20 packets for community peer-to-peer
      const communityDonations = allData.filter(item => {
          const qty = Number(item.quantity) || 1; 
          return qty < 20; 
      });
      
      setListings(communityDonations); 
      setLoading(false);
    }, (error) => {
      console.error("Firebase Sync Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleClaim = async (itemId: string, foodName: string) => {
    try {
      const foodRef = doc(db, "listings", itemId);
      await updateDoc(foodRef, { status: "claimed" });
      
      setSelectedItem({ id: itemId, name: foodName });
      setModalVisible(true);
    } catch (error: any) {
      Alert.alert("Error", "This item was just claimed by someone else.");
    }
  };

  const downloadQR = async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: "png",
        quality: 1.0,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Error", "Sharing not supported on this device.");
      }
    } catch (e) {
      Alert.alert("Error", "Failed to generate your pickup pass.");
    }
  };

  const openInMaps = (coords: { latitude: number; longitude: number }, foodName: string) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${coords.latitude},${coords.longitude}`;
    const url = Platform.select({
      ios: `${scheme}${foodName}@${latLng}`,
      android: `${scheme}${latLng}(${foodName})`
    });
    if (url) Linking.openURL(url);
  };

  const renderItem = ({ item }: { item: FoodListing }) => (
    <View style={styles.card}>
      <View style={styles.imageSection}>
        {item.foodImage ? (
          <Image source={{ uri: item.foodImage }} style={styles.foodPreview} />
        ) : (
          <View style={[styles.typeIndicator, { backgroundColor: item.role === 'merchant' ? '#E8F8F5' : '#FDEDEC' }]}>
            <ThemedText style={styles.typeIcon}>{item.role === 'merchant' ? '🏪' : '🏠'}</ThemedText>
          </View>
        )}
      </View>
      
      <View style={styles.cardContent}>
        <ThemedText style={styles.foodTitle} numberOfLines={1}>{item.foodName}</ThemedText>
        <ThemedText style={styles.quantityText}>📦 {item.quantity} Portions Available</ThemedText>
        
        {item.locationCoords && (
          <TouchableOpacity onPress={() => openInMaps(item.locationCoords!, item.foodName)}>
            <ThemedText style={styles.locationLink}>📍 Directions to Pickup</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.claimButton, { backgroundColor: item.role === 'merchant' ? '#2E9081' : '#E67E22' }]}
        onPress={() => handleClaim(item.id, item.foodName)}
      >
        <ThemedText style={styles.buttonText}>Claim</ThemedText>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#FFFEF9', '#FDF5E6']} style={StyleSheet.absoluteFill} />
      <ImageBackground source={require('../../assets/images/60251.jpg')} style={styles.absoluteBG} resizeMode="cover">
        <SafeAreaView style={styles.container}>
          <View style={styles.headerCentered}>
            <ThemedText style={styles.headerTitle}>Bridge Feed</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Community surplus available now</ThemedText>
          </View>
          
          {loading ? (
            <ActivityIndicator size="large" color="#E67E22" style={{ marginTop: 50 }} />
          ) : listings.length === 0 ? (
            <View style={styles.center}>
              <ThemedText style={styles.emptyText}>No small donations nearby.{"\n"}Check the Volunteer Dashboard for bulk missions!</ThemedText>
            </View>
          ) : (
            <FlatList
              data={listings}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}

          {/* QR PICKUP PASS MODAL */}
          <Modal animationType="fade" transparent={true} visible={modalVisible}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.successBadge}>
                  <ThemedText style={styles.successBadgeText}>ITEM RESERVED</ThemedText>
                </View>
                
                <ThemedText style={styles.modalTitle}>Pickup Pass</ThemedText>
                <ThemedText style={styles.modalSub}>{selectedItem?.name}</ThemedText>
                
                <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1.0 }} style={styles.qrCaptureArea}>
                  <View style={styles.qrInner}>
                    <QRCode value={selectedItem?.id || 'none'} size={180} color="#1A242F" backgroundColor="white" />
                    <ThemedText style={styles.qrFooterText}>Verification Code: {selectedItem?.id.slice(-6).toUpperCase()}</ThemedText>
                  </View>
                </ViewShot>

                <TouchableOpacity style={styles.downloadBtn} onPress={downloadQR}>
                  <ThemedText style={styles.downloadText}>📥 Save Pass to Phone</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeBtn} onPress={() => {
                  setModalVisible(false);
                  router.push('/(tabs)/dashboard'); // Correct usage of router
                }}>
                  <ThemedText style={styles.closeText}>I'm at the location</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteBG: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, paddingHorizontal: 15 },
  headerCentered: { alignItems: 'center', marginVertical: 30 },
  headerTitle: { fontSize: 34, fontWeight: '900', color: '#1A242F' },
  headerSubtitle: { fontSize: 14, color: '#7F8C8D', fontWeight: '600' },
  listContent: { paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  card: {
    backgroundColor: '#FFF', 
    padding: 15, borderRadius: 25, marginBottom: 15,
    flexDirection: 'row', alignItems: 'center', elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }
  },
  imageSection: { width: 65, height: 65, marginRight: 15 },
  foodPreview: { width: '100%', height: '100%', borderRadius: 15 },
  typeIndicator: { width: '100%', height: '100%', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  typeIcon: { fontSize: 24 },
  cardContent: { flex: 1 },
  foodTitle: { fontSize: 17, fontWeight: '800', color: '#1A242F' },
  quantityText: { fontSize: 13, color: '#95A5A6', marginTop: 3 },
  locationLink: { fontSize: 12, color: '#E67E22', marginTop: 8, fontWeight: '700' },
  claimButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 15 },
  buttonText: { color: '#FFF', fontWeight: '900' },
  emptyText: { textAlign: 'center', color: '#95A5A6', fontSize: 15, lineHeight: 22 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', width: '85%', padding: 30, borderRadius: 30, alignItems: 'center' },
  successBadge: { backgroundColor: '#E8F8F5', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10, marginBottom: 10 },
  successBadgeText: { color: '#27AE60', fontSize: 11, fontWeight: '900' },
  modalTitle: { fontSize: 28, fontWeight: '900', color: '#1A242F' },
  modalSub: { fontSize: 16, color: '#E67E22', marginBottom: 20, fontWeight: '700' },
  qrCaptureArea: { backgroundColor: '#FFF', padding: 20, borderRadius: 20 },
  qrInner: { alignItems: 'center' },
  qrFooterText: { marginTop: 10, fontSize: 10, color: '#BDC3C7' },
  downloadBtn: { backgroundColor: '#1A242F', padding: 18, borderRadius: 20, width: '100%', alignItems: 'center', marginTop: 25 },
  downloadText: { color: '#FFF', fontWeight: '800' },
  closeBtn: { marginTop: 20 },
  closeText: { color: '#BDC3C7', fontWeight: '700' } 
});