import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function IndexPage() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../assets/images/nnn.jpg')} 
        style={styles.absoluteBG}
        resizeMode="cover"
      >
        {/* Dark Overlay for Text Legibility */}
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']}
          style={StyleSheet.absoluteFillObject}
        />

        <Animated.View 
          style={[
            styles.content, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          {/* 1. Top Icon Box */}
          <View style={styles.iconBox}>
            <Text style={styles.iconEmoji}>🍴</Text>
          </View>

          {/* 2. Typography Section */}
          <Text style={styles.title}>MealBridge</Text>
          <View style={styles.separator} />
          <Text style={styles.subtitle}>Connecting Surplus to Service</Text>

          {/* 3. Action Icons Visualizer */}
          <View style={styles.actionRow}>
            <View style={styles.actionCircle}>
              <Text style={{fontSize: 20}}>🤲</Text>
            </View>
            <View style={styles.dottedLine} />
            <View style={styles.dot} />
            <View style={styles.dottedLine} />
            <View style={styles.actionCircle}>
              <Text style={{fontSize: 20}}>🔗</Text>
            </View>
          </View>

          {/* 4. Glassmorphism Get Started Button */}
          <TouchableOpacity 
            style={styles.getStartedBtn} 
            onPress={() => router.push('/(tabs)/dashboard')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>Get Started  →</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>NO ONE SHOULD GO HUNGRY</Text>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  
  },
  absoluteBG: {
    width: width,
    height: height,
    flex: 1,
  },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 30 
  },
  iconBox: {
    width: 85,
    height: 85,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  iconEmoji: { fontSize: 36 },
  title: {
    fontSize: 50,
    color: '#FFF',
    fontFamily: 'serif',
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  separator: {
    width: 120,
    height: 3,
    backgroundColor: '#E67E22', // MealBridge Orange for a pop of color
    marginVertical: 20,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#F2F4F4',
    fontWeight: '500',
    marginBottom: 50,
    letterSpacing: 1.2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60,
  },
  actionCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dottedLine: { 
    width: 35, 
    height: 1, 
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
    marginHorizontal: 8 
  },
  dot: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: '#E67E22' 
  },
  getStartedBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 20,
    paddingHorizontal: 45,
    borderRadius: 35,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  btnText: { 
    color: '#FFF', 
    fontSize: 20, 
    fontWeight: '800',
    letterSpacing: 1,
  },
  footerText: {
    position: 'absolute',
    bottom: 50,
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '900',
    textTransform: 'uppercase',
  }
});
