import React from 'react';
// Added ImageBackground to the import list below
import { StyleSheet, View, TouchableOpacity, SafeAreaView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';

export default function LoginSelectionScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      {/* 1. This fills the very bottom layer */}
      <LinearGradient 
        colors={['#FFFEF9', '#FDF5E6']} 
        style={StyleSheet.absoluteFill} 
      />
      
      {/* 2. ImageBackground should wrap your content */}
      <ImageBackground 
        source={require('../../assets/images/Bg.jpg')} 
        style={styles.absoluteBG}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          
          <View style={styles.headerSection}>
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>GETTING STARTED</ThemedText>
            </View>
            <ThemedText style={styles.title}>Join the Bridge</ThemedText>
            <ThemedText style={styles.subtitle}>
              Help us turn surplus into sustenance in Chennai.
            </ThemedText>
          </View>

          <View style={styles.cardContainer}>
            {/* DONATOR CARD */}
            <TouchableOpacity 
              style={[styles.roleCard, { borderLeftColor: '#E67E22' }]} 
              onPress={() => router.push('../donators')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#FDEDEC' }]}>
                <ThemedText style={styles.icon}>❤️</ThemedText>
              </View>
              <View style={styles.cardTextContent}>
                <ThemedText style={styles.cardTitle}>Donator</ThemedText>
                <ThemedText style={styles.cardDesc}>Share surplus home-cooked meals.</ThemedText>
              </View>
            </TouchableOpacity>

            {/* MERCHANT CARD */}
            <TouchableOpacity 
              style={[styles.roleCard, { borderLeftColor: '#2E9081' }]} 
              onPress={() => router.push('../merchant')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#E8F8F5' }]}>
                <ThemedText style={styles.icon}>🏪</ThemedText>
              </View>
              <View style={styles.cardTextContent}>
                <ThemedText style={styles.cardTitle}>Merchant</ThemedText>
                <ThemedText style={styles.cardDesc}>List bulk food from your business.</ThemedText>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.footerSection}>
            <TouchableOpacity onPress={() => router.push('../dashboard')} style={styles.backBtn}>
              <ThemedText style={styles.backBtnText}>← Back to Home</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.versionTag}>MealBridge v1.0</ThemedText>
          </View>

        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  // Added this style for the background
  absoluteBG: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: { 
    flex: 1, 
    justifyContent: 'center',
    paddingHorizontal: 25,
    // Add a slight dark overlay if the image makes text hard to read
    backgroundColor: 'rgba(255, 255, 255, 0.4)' 
  },
  headerSection: { 
    marginBottom: 35, 
    alignItems: 'center' 
  },
  badge: {
    backgroundColor: '#FDEBD0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10
  },
  badgeText: {
    color: '#E67E22',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  title: { 
    fontSize: 34, 
    color: '#1A242F', 
    fontFamily: 'serif', 
    fontWeight: '800',
    textAlign: 'center'
  },
  subtitle: { 
    fontSize: 14, 
    color: '#5D6D7E', 
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: '85%'
  },
  cardContainer: {
    gap: 15,
    width: '90%',
    maxWidth: 400,       
    alignSelf: 'center', 
  },
  roleCard: {
    backgroundColor: '#FFF',
    paddingVertical: 18, 
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: { fontSize: 24 },
  cardTextContent: { flex: 1 },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#1A242F' 
  },
  cardDesc: { 
    color: '#7F8C8D', 
    fontSize: 12, 
    marginTop: 2 
  },
  footerSection: {
    marginTop: 40,
    alignItems: 'center'
  },
  backBtn: { 
    marginBottom: 20
  },
  backBtnText: {
    color: '#E67E22', 
    fontWeight: '700',
    fontSize: 14
  },
  versionTag: {
    fontSize: 10,
    color: '#ABB2B9',
    letterSpacing: 1
  }
});