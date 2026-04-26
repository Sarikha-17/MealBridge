import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
// @ts-ignore
import { db } from '../../firebaseConfig';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';

export default function LeaderboardScreen() {
  const router = useRouter();
  const [topDonors, setTopDonors] = useState<any[]>([]);

  useEffect(() => {
    // This query fetches the top 5 users based on Karma + Green Points combined
    // Or you can just pick one (like karmaPoints) for simplicity
    const q = query(
  collection(db, "users"),
  orderBy("totalImpact", "desc"), // Changed from karmaPoints to totalImpact
  limit(5)
);

    const unsub = onSnapshot(q, (snapshot) => {
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as any[];

  // MANUALLY SORT here to ensure 200 points stays above 150 points
  const sortedData = data.sort((a, b) => {
    const totalA = (a.karmaPoints || 0) + (a.greenPoints || 0);
    const totalB = (b.karmaPoints || 0) + (b.greenPoints || 0);
    return totalB - totalA; // Highest points first
  });

  setTopDonors(sortedData);
});

    return () => unsub();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#1A242F', '#2C3E50']} style={StyleSheet.absoluteFill} />
      <ImageBackground 
                source={require('../../assets/images/6530.jpg')} 
                style={styles.absoluteBG}
                resizeMode="cover"
              >
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Impact Rankings</ThemedText>
          <ThemedText style={styles.subtitle}>Top Change-Makers on MealBridge</ThemedText>
        </View>

        <ScrollView contentContainerStyle={styles.listContainer}>
          {topDonors.map((user, index) => {
            const isMe = user.id === "Sarikha_Demo_Global";
            
            return (
              <View key={user.id} style={[styles.rankCard, isMe && styles.myCard]}>
                <View style={styles.rankBadge}>
                  <ThemedText style={styles.rankText}>{index + 1}</ThemedText>
                </View>
                
                <View style={styles.info}>
                  <ThemedText style={styles.nameText}>
                    {user.name} {isMe ? "(You)" : ""}
                  </ThemedText>
                  <View style={styles.pointsRow}>
                    <ThemedText style={styles.pointDetail}>✨ {user.karmaPoints || 0} Karma</ThemedText>
                    <ThemedText style={styles.pointDetail}>🌿 {user.greenPoints || 0} Green</ThemedText>
                  </View>
                </View>

                <View style={styles.totalBox}>
                  <ThemedText style={styles.totalText}>
                    {(user.karmaPoints || 0) + (user.greenPoints || 0)}
                  </ThemedText>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.backBtn}>
          <ThemedText style={styles.backBtnText}>Close Leaderboard</ThemedText>
        </TouchableOpacity>
      </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 40 },
  header: { marginBottom: 30, alignItems: 'center', paddingVertical: 20 },
  title: { fontSize: 28, fontWeight: '900', color: '#29b0cb', letterSpacing: 1 },
  subtitle: { fontSize: 14, color: '#3f799f', marginTop: 5 },
  listContainer: { gap: 15 },
  rankCard: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    padding: 15, 
    borderRadius: 20, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgb(190, 147, 79)'
  },
  myCard: { 
    backgroundColor: 'rgba(59, 114, 117, 0.2)', 
    borderColor: '#e6a52266',
    borderWidth: 2
  },
  rankBadge: { 
    width: 35, 
    height: 35, 
    borderRadius: 10, 
    backgroundColor: '#65c7dd', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  absoluteBG: {
    width: '100%',
    height: '100%', },
  rankText: { color: '#FFF', fontWeight: '900' },
  info: { flex: 1, marginLeft: 15 },
  nameText: { color: '#945656', fontSize: 16, fontWeight: '700' },
  pointsRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  pointDetail: { fontSize: 11, color: '#27526e', fontWeight: '600' },
  totalBox: { alignItems: 'flex-end' },
  totalText: { color: '#4b9fb7', fontSize: 20, fontWeight: '900' },
  backBtn: { marginTop: 20, alignSelf: 'center', padding: 10 },
  backBtnText: { color: '#BDC3C7', fontWeight: '700' }
});