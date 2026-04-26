import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking, Platform, ImageBackground, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp, or } from 'firebase/firestore';
import QRCode from 'react-native-qrcode-svg';
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. CONFIGURE GEMINI
const API_KEY = "YOUR_GEMINI_API_KEY"; // Ensure this is replaced with your actual key
const genAI = new GoogleGenerativeAI(API_KEY);

type Mission = {
  id: string;
  foodName?: string;
  quantity?: number;
  priority?: string;
  locationCoords?: { latitude: number; longitude: number };
};

export default function VolunteerDashboard() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string>("Analyzing priority logistics...");
  const [aiLoading, setAiLoading] = useState(false);

  const [userLocation] = useState("Chennai, TN");
  const [badges] = useState([
    { id: 1, icon: '🎖️', name: 'Rookie', earned: true },
    { id: 2, icon: '🏆', name: 'Hunger Hero', earned: true },
    { id: 3, icon: '👑', name: 'Legend', earned: false },
    { id: 4, icon: '🌍', name: 'Eco Warrior', earned: false },
  ]);

  // 2. FIREBASE SYNC: Filter for Bulk (>=20) or Critical Priority
  useEffect(() => {
    const q = query(
      collection(db, "listings"),
      where("status", "==", "available")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Mission));
      
      // Filter for Mission-grade listings only
      const missionData = allData.filter(item => {
        const qty = Number(item.quantity) || 0;
        return qty >= 20 || item.priority === 'Critical';
      });

      // Sort: Critical First, then Quantity
      const sortedMissions = missionData.sort((a, b) => {
        if (a.priority === 'Critical' && b.priority !== 'Critical') return -1;
        if (a.priority !== 'Critical' && b.priority === 'Critical') return 1;
        return (Number(b.quantity) || 0) - (Number(a.quantity) || 0);
      });

      setMissions(sortedMissions);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 3. AI Dispatcher Analysis
  useEffect(() => {
    async function fetchAiGuidance() {
      if (missions.length > 0 && API_KEY !== "YOUR_GEMINI_API_KEY") {
        setAiLoading(true);
        try {
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const target = missions[0];
          const prompt = `Volunteer mission in Chennai: ${target.quantity} units of ${target.foodName}. 
          Provide a 1-sentence tip for heat safety and 1-sentence on CO2 prevention from landfills. Keep it under 40 words total.`;

          const result = await model.generateContent(prompt);
          setAiAdvice(result.response.text());
        } catch (error) {
          setAiAdvice("Priority mission detected. Keep food sealed and transport quickly to avoid spoilage.");
        } finally {
          setAiLoading(false);
        }
      }
    }
    fetchAiGuidance();
  }, [missions]);

  const openMapNavigation = (lat: number, lng: number, label: string) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    if (url) Linking.openURL(url);
  };

  const acceptMission = async (mission: Mission) => {
    try {
      await updateDoc(doc(db, "listings", mission.id), {
        status: "accepted",
        volunteerId: "Sarikha_Demo_User",
        acceptedAt: serverTimestamp()
      });
      setActiveMission(mission);
      if (mission.locationCoords) {
        openMapNavigation(mission.locationCoords.latitude, mission.locationCoords.longitude, mission.foodName || "Pickup");
      }
    } catch (e) {
      Alert.alert("Error", "Mission no longer available.");
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2E9081" /></View>;

  if (activeMission) {
    return (
      <View style={styles.verificationContainer}>
        <LinearGradient colors={['#2E9081', '#1A242F']} style={styles.verifyHeader}>
          <ThemedText style={styles.verifyTitle}>ACTIVE MISSION</ThemedText>
          <ThemedText style={styles.verifyFood}>{activeMission.foodName}</ThemedText>
        </LinearGradient>
        <View style={styles.qrSection}>
          <QRCode value={activeMission.id} size={220} color="#1A242F" />
          <ThemedText style={styles.qrHint}>Merchant: Scan this to verify handover.</ThemedText>
        </View>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => setActiveMission(null)}>
          <ThemedText style={styles.cancelBtnText}>Return to Dashboard</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={require('../../assets/images/imi.jpg')} style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          <View style={styles.locationHeader}>
            <ThemedText style={styles.locLabel}>CURRENT DISPATCH ZONE</ThemedText>
            <ThemedText style={styles.locText}>📍 {userLocation}</ThemedText>
          </View>

          <View style={styles.badgeSection}>
            <ThemedText style={styles.sectionTitle}>Your Volunteer Rank</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeScroll}>
              {badges.map(badge => (
                <View key={badge.id} style={[styles.badgeIconBox, !badge.earned && { opacity: 0.3 }]}>
                  <ThemedText style={styles.badgeEmoji}>{badge.icon}</ThemedText>
                  <ThemedText style={styles.badgeName}>{badge.name}</ThemedText>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* AI DISPATCH CARD */}
          {missions.length > 0 && (
            <LinearGradient 
              colors={missions[0].priority === 'Critical' ? ['#E74C3C', '#2C3E50'] : ['#1A242F', '#2E9081']} 
              style={styles.aiAdviceCard}
            >
              <View style={styles.aiHeaderRow}>
                <ThemedText style={styles.aiTitle}>🤖 AI LOGISTICS ANALYZER</ThemedText>
                {aiLoading && <ActivityIndicator size="small" color="#FFF" />}
              </View>
              
              <ThemedText style={styles.impactText}>
                Impact: ~{((Number(missions[0].quantity) || 0) * 0.45).toFixed(1)}kg CO2 offset
              </ThemedText>

              <ThemedText style={styles.aiText}>{aiAdvice}</ThemedText>
            </LinearGradient>
          )}

          <View style={styles.missionList}>
            <ThemedText style={styles.sectionTitle}>High-Impact Missions</ThemedText>
            {missions.length === 0 ? (
              <ThemedText style={styles.emptyText}>No bulk missions available. Small donations are handled by local peers.</ThemedText>
            ) : (
              missions.map((item) => (
                <View key={item.id} style={[styles.card, item.priority === 'Critical' && styles.criticalCard]}>
                  <View style={styles.cardHeader}>
                    <ThemedText style={styles.foodName}>{item.foodName}</ThemedText>
                    {item.priority === 'Critical' && (
                      <View style={styles.critBadge}><ThemedText style={styles.critText}>CRITICAL</ThemedText></View>
                    )}
                  </View>
                  <ThemedText style={styles.quantity}>📦 {item.quantity} Portions • Priority: {item.priority || 'Normal'}</ThemedText>
                  <TouchableOpacity 
                    style={[styles.acceptBtn, item.priority === 'Critical' && { backgroundColor: '#E74C3C' }]} 
                    onPress={() => acceptMission(item)}
                  >
                    <ThemedText style={styles.btnText}>Start Mission →</ThemedText>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  locationHeader: { padding: 25, borderBottomWidth: 1, borderColor: '#191818', marginTop: 20 },
  locLabel: { fontSize: 10, fontWeight: 'bold', color: '#000000', letterSpacing: 1 },
  locText: { fontSize: 18, fontWeight: '900', color: '#1A242F', marginTop: 4 },
  badgeSection: { paddingVertical: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginLeft: 25, marginBottom: 15, color: '#1A242F' },
  badgeScroll: { paddingLeft: 25, paddingRight: 10 },
  badgeIconBox: { alignItems: 'center', marginRight: 15, backgroundColor: 'rgba(255,255,255,0.9)', padding: 15, borderRadius: 20, width: 90, elevation: 2 },
  badgeEmoji: { fontSize: 28, marginBottom: 5 },
  badgeName: { fontSize: 10, fontWeight: 'bold', color: '#2E9081' },
  aiAdviceCard: { margin: 20, padding: 20, borderRadius: 25, elevation: 5 },
  aiHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  aiTitle: { color: '#FFF', fontSize: 10, fontWeight: '800', opacity: 0.8 },
  impactText: { color: '#FFF', fontSize: 20, fontWeight: '900', marginBottom: 5 },
  aiText: { color: '#FFF', fontSize: 13, fontWeight: '600', lineHeight: 18 },
  missionList: { paddingHorizontal: 25 },
  card: { backgroundColor: 'rgba(255,255,255,0.95)', padding: 20, borderRadius: 25, marginBottom: 15, elevation: 3 },
  criticalCard: { borderLeftWidth: 5, borderLeftColor: '#E74C3C' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  foodName: { fontSize: 18, fontWeight: '800', color: '#1A242F' },
  critBadge: { backgroundColor: '#E74C3C', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  critText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  quantity: { color: '#7F8C8D', marginTop: 5, fontWeight: '600' },
  acceptBtn: { backgroundColor: '#1A242F', padding: 15, borderRadius: 15, marginTop: 15, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: '800' },
  emptyText: { textAlign: 'center', color: '#7F8C8D', marginTop: 20, fontSize: 14 },
  verificationContainer: { flex: 1, backgroundColor: '#FFF' },
  verifyHeader: { padding: 50, alignItems: 'center' },
  verifyTitle: { color: '#FFF', opacity: 0.7, fontSize: 12, fontWeight: 'bold' },
  verifyFood: { color: '#FFF', fontSize: 26, fontWeight: '900', marginTop: 10 },
  qrSection: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  qrHint: { marginTop: 20, color: '#95A5A6', textAlign: 'center', paddingHorizontal: 40 },
  cancelBtn: { marginBottom: 40, padding: 15, alignItems: 'center' },
  cancelBtnText: { color: '#95A5A6', fontWeight: '600' }
});