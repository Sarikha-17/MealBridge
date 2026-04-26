import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, TextInput, ImageBackground, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, updateDoc, increment } from "firebase/firestore";
// @ts-ignore
import { db } from '../../firebaseConfig';
import { ThemedText } from '@/components/themed-text';

export default function DonateFundsScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');

  const handlePayment = async () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || numAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount to donate.");
      return;
    }

    const upiId = 'mealbridge@okaxis';
    const name = 'MealBridge Foundation Trust';
    // Standard UPI deep link format
    const url = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;

    try {
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        // Open the UPI app (GPay/PhonePe/Paytm)
        await Linking.openURL(url);
        
        /* FOR THE DEMO: 
           Since UPI apps don't return a "success" callback to Expo easily, 
           we update the points immediately to show the "Impact" for your video.
        */
        const userRef = doc(db, "users", "Sarikha_Demo_Global");
        const pointsToAdd = Math.floor(numAmount / 10); // Reward: 1 point per ₹10
        
        await updateDoc(userRef, {
          karmaPoints: increment(pointsToAdd),
          totalImpact: increment(pointsToAdd)
        });

        Alert.alert("Impact Updated!", `Thank you for donating ₹${amount}. You earned ${pointsToAdd} Karma points!`);
      } else {
        Alert.alert("Error", "No UPI apps (GPay, PhonePe, etc.) found on this device.");
      }
    } catch (err) {
      Alert.alert("Error", "Could not open payment apps.");
      console.error(err);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#FFFEF9', '#E8F8F5']} style={StyleSheet.absoluteFill} />
      
      <ImageBackground 
        source={require('../../assets/images/8658.jpg')} 
        style={styles.absoluteBG}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.headerSection}>
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>SECURE DONATION</ThemedText>
            </View>
            <ThemedText style={styles.title}>Donate Funds</ThemedText>
            <ThemedText style={styles.subtitle}>Powering logistics for MealBridge Chennai.</ThemedText>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.infoCard}>
              <ThemedText style={styles.label}>Recipient Organization</ThemedText>
              <ThemedText style={styles.recipientName}>MealBridge Foundation Trust</ThemedText>
              <View style={styles.upiBadge}>
                <ThemedText style={styles.upiText}>UPI ID: mealbridge@okaxis</ThemedText>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Enter Amount (₹)</ThemedText>
              <TextInput 
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor="rgba(22, 160, 133, 0.5)"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <View style={styles.quickSelectRow}>
              {['100', '500', '1000'].map((val) => (
                <TouchableOpacity 
                  key={val} 
                  style={[styles.chip, amount === val && { backgroundColor: '#16A085' }]} 
                  onPress={() => setAmount(val)}
                >
                  <ThemedText style={[styles.chipText, amount === val && { color: '#FFF' }]}>
                    +₹{val}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.payBtn} onPress={handlePayment}>
              <ThemedText style={styles.payBtnText}>Pay via UPI →</ThemedText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push('/donators')} style={styles.backBtn}>
            <ThemedText style={styles.backBtnText}>Go Back</ThemedText>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}


const styles = StyleSheet.create({
  absoluteBG: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 25 },
  headerSection: { marginBottom: 35, alignItems: 'center' },
  badge: { 
    backgroundColor: 'rgba(209, 242, 235, 0.9)', 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 20, 
    marginBottom: 10 
  },
  badgeText: { color: '#16A085', fontSize: 10, fontWeight: '900' },
  title: { fontSize: 32, color: '#1A242F', fontWeight: '800', fontFamily: 'serif' },
  subtitle: { fontSize: 14, color: '#1A242F', marginTop: 5, textAlign: 'center', fontWeight: '600' },
  
  cardContainer: { 
    width: '100%', 
    maxWidth: 400, 
    gap: 20, 
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Glassmorphism container
    padding: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  infoCard: { 
    backgroundColor: '#FFF', 
    padding: 20, 
    borderRadius: 20, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1F2EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  label: { fontSize: 12, fontWeight: '700', color: '#7F8C8D', marginBottom: 5, textTransform: 'uppercase' },
  recipientName: { fontSize: 18, fontWeight: '800', color: '#1A242F', marginBottom: 10 },
  upiBadge: { backgroundColor: '#F4F6F7', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  upiText: { fontSize: 12, color: '#5D6D7E', fontWeight: '600' },
  
  inputGroup: { alignItems: 'center', marginTop: 10 },
  amountInput: { 
    fontSize: 48, 
    fontWeight: '900', 
    color: '#16A085', 
    textAlign: 'center',
    width: '100%',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1
  },
  quickSelectRow: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  chip: { 
    paddingHorizontal: 15, 
    paddingVertical: 8, 
    borderRadius: 12, 
    backgroundColor: '#FFF', 
    borderWidth: 1, 
    borderColor: '#D1F2EB' 
  },
  chipText: { fontSize: 13, fontWeight: '700', color: '#16A085' },
  
  payBtn: { backgroundColor: '#16A085', paddingVertical: 18, borderRadius: 20, alignItems: 'center', marginTop: 10 },
  payBtnText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  
  backBtn: { 
    marginTop: 30, 
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center'
  },
  backBtnText: { color: '#1A242F', fontWeight: '700', fontSize: 14 }
});