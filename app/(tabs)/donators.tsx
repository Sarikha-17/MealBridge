import React from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';

export default function DonatorPortal() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      {/* 1. Base Gradient Layer */}
      <LinearGradient colors={['#FFFEF9', '#FDF5E6']} style={StyleSheet.absoluteFill} />
      
      {/* 2. Image Background Layer */}
      <ImageBackground 
        source={require('../../assets/images/Bg.jpg')} 
        style={styles.absoluteBG}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
            
            <View style={styles.headerSection}>
              <View style={styles.badge}><ThemedText style={styles.badgeText}>DONATOR PORTAL</ThemedText></View>
              <ThemedText style={styles.quoteTop}>
                "The purpose of our lives is to be happy, and the way to happiness is to share what we have."
              </ThemedText>
              <ThemedText style={styles.title}>Make a Change</ThemedText>
              <ThemedText style={styles.subtitle}>Choose how you'd like to help today.</ThemedText>
            </View>

            {/* Horizontal ScrollView for Cards */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.cardWrapper}
              snapToAlignment="center"
              decelerationRate="fast"
            >
              {/* DONATE FOOD CARD */}
              <View style={[styles.mainCard, { backgroundColor: 'rgba(253, 235, 208, 0.92)' }]}>
                <View style={[styles.iconBox, { backgroundColor: '#E67E22' }]}>
                  <ThemedText style={styles.iconSymbol}>🍴</ThemedText>
                </View>
                <ThemedText style={styles.cardTitle}>Donate Food</ThemedText>
                <ThemedText style={styles.cardDesc}>Share surplus home-cooked meals with families in need.</ThemedText>
                
                <View style={styles.quoteBox}>
                  <ThemedText style={styles.quoteText}>
                    "When you feed someone, you nourish not just their body, but their belief in humanity."
                  </ThemedText>
                </View>

                <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('./sharefood')}>
                  <ThemedText style={styles.btnText}>Share a Meal →</ThemedText>
                </TouchableOpacity>
              </View>

              {/* DONATE FUNDS CARD */}
              <View style={[styles.mainCard, { backgroundColor: 'rgba(209, 242, 235, 0.92)' }]}>
                 <View style={[styles.iconBox, { backgroundColor: '#16A085' }]}>
                  <ThemedText style={styles.iconSymbol}>💳</ThemedText>
                </View>
                <ThemedText style={styles.cardTitle}>Donate Funds</ThemedText>
                <ThemedText style={styles.cardDesc}>Contribute via UPI to power logistics and delivery.</ThemedText>

                <View style={styles.quoteBox}>
                  <ThemedText style={styles.quoteText}>
                    "A small act of kindness today is the foundation of lasting change tomorrow."
                  </ThemedText>
                </View>

                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#16A085' }]} onPress={() => router.push('./donatecash')}>
                  <ThemedText style={styles.btnText}>Contribute Now →</ThemedText>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ThemedText style={styles.backBtnText}>← Back</ThemedText>
            </TouchableOpacity>

          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteBG: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, paddingVertical: 20 },
  quoteTop: { fontSize: 10, color: '#7F8C8D', fontStyle: 'italic', textAlign: 'center', marginBottom: 20, paddingHorizontal: 40 },
  headerSection: { alignItems: 'center', marginBottom: 30, marginTop: 50, paddingHorizontal: 20 },
  badge: { backgroundColor: '#FAE5D3', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginBottom: 10 },
  badgeText: { color: '#E67E22', fontSize: 11, fontWeight: '900' },
  title: { fontSize: 36, color: '#1A242F', fontWeight: '900', textAlign: 'center', lineHeight: 42 },
  subtitle: { fontSize: 16, color: '#5D6D7E', marginTop: 8, fontWeight: '500', textAlign: 'center' },
  cardWrapper: { paddingHorizontal: 20, gap: 20, paddingBottom: 20 },
  mainCard: { width: 280, padding: 25, borderRadius: 30, alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  iconBox: { width: 60, height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  iconSymbol: { fontSize: 30, color: '#FFF' },
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#1A242F' },
  cardDesc: { fontSize: 13, color: '#5D6D7E', textAlign: 'center', marginTop: 8, lineHeight: 18 },
  quoteBox: { backgroundColor: 'rgba(255,255,255,0.6)', padding: 12, borderRadius: 15, marginVertical: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  quoteText: { fontSize: 11, color: '#34495E', fontStyle: 'italic', textAlign: 'center' },
  actionBtn: { backgroundColor: '#E67E22', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25, width: '100%', alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  backBtn: { marginTop: 30, marginBottom: 50, backgroundColor: 'rgba(255,255,255,0.7)', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  backBtnText: { color: '#E67E22', fontWeight: 'bold' }
});