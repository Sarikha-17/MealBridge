import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function FullDashboard() {
  const router = useRouter();

  const testimonials = [
    { name: 'Anjali R.', role: 'Restaurant Owner', text: 'MealBridge made it so easy to share our surplus biryani. It feels great to know nothing goes to waste.', color: '#EBF9F7' },
    { name: 'Karthik S.', role: 'Volunteer', text: 'The look of gratitude on people’s faces when we deliver fresh meals is something I’ll never forget.', color: '#FEF9E7' },
    { name: 'Meena K.', role: 'NGO Partner', text: 'The quality of food we receive through the portal is excellent. It helps us feed 50+ children daily.', color: '#F8FAFB' },
    { name: 'Suresh M.', role: 'Community Lead', text: 'Our neighborhood center has seen a huge decrease in food insecurity thanks to the weekly donations.', color: '#F4ECF7' },
    { name: 'Priya D.', role: 'Event Caterer', text: 'We used to worry about wedding leftovers. Now, we just post on the app and volunteers arrive in minutes.', color: '#E5F1FB' },
    { name: 'Rahul V.', role: 'Student Volunteer', text: 'Being a bridge between surplus and hunger has changed my perspective on waste entirely.', color: '#FDEDEC' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground 
        source={require('../../assets/images/Bg.jpg')} 
        style={styles.absoluteBG}
        resizeMode="cover"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* --- NAV BAR --- */}
          <View style={styles.navBar}>
            <View style={styles.logoRow}>
              <View style={styles.logoIcon}><Text style={{color: '#FFF'}}>🍴</Text></View>
              <Text style={styles.logoText}>Meal<Text style={{color: '#E67E22'}}>Bridge</Text></Text>
            </View>
            <TouchableOpacity style={styles.joinBtn} onPress={() => router.push('/login')}>
              <Text style={styles.joinBtnText}>Join Us</Text>
            </TouchableOpacity>
          </View>

          {/* --- HERO SECTION --- */}
          <View style={styles.heroSection}>
            <View style={styles.badge}><Text style={styles.badgeText}>🧡 Connecting Surplus to Service</Text></View>
            <Text style={styles.heroTitle}>No One Should {"\n"}<Text style={{color: '#E67E22'}}>Go Hungry</Text></Text>
            <Text style={styles.heroDesc}>Meal Bridge connects those with surplus food to those who need it most.</Text>
            <View style={styles.ctaRow}>
              <TouchableOpacity style={styles.smallPrimaryBtn} onPress={() => router.push('/login')}>
                <Text style={styles.btnTextWhite}>Donate Food →</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallSecondaryBtn} onPress={() => router.push('/receivers')}>
                <Text style={styles.btnTextDark}>Find a Meal</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* --- MODERN VOLUNTEER NAV SECTION --- */}
          <View style={styles.volunteerCtaWrapper}>
            <LinearGradient 
              colors={['rgba(26, 36, 47, 0.87)', 'rgba(46, 144, 129, 0.91)']} 
              style={styles.volunteerCard}
            >
              <View style={styles.quoteDecorative}>
                <Text style={styles.quoteSymbol}>“</Text>
              </View>
              
              <Text style={styles.modernQuote}>
                Your time is the <Text style={{color: '#F39C12'}}>bridge</Text> between {"\n"}
                waste and <Text style={{color: '#F39C12'}}>wellness.</Text>
              </Text>
              
              <Text style={styles.volunteerSubQuote}>
                Join 2,000+ logistics heroes turning surplus into smiles across Chennai.
              </Text>

              <TouchableOpacity 
                style={styles.glassBtn} 
                onPress={() => router.push('../VolunteerDashboard')}
              >
                <LinearGradient 
                  colors={['#F39C12', '#e67d22']} 
                  start={{x: 0, y: 0}} 
                  end={{x: 1, y: 0}} 
                  style={styles.glassBtnGradient}
                >
                  <Text style={styles.glassBtnText}>Become a Hero →</Text>

                </LinearGradient>
              </TouchableOpacity>
              
              <View style={styles.statsRowMini}>
                <Text style={styles.miniStatText}>⚡ AI-Optimized Routes</Text>
                <Text style={styles.miniStatText}>🏆 Earn Badges</Text>
              </View>
            </LinearGradient>
          </View>

          {/* --- IMPACT LEADERBOARD SECTION --- */}
          <View style={styles.leaderboardSection}>
            <View style={styles.impactCardBase}>
              <View style={styles.asymmetricBg} />
              <View style={styles.impactCardContent}>
                <View style={styles.iconCircle}>
                  <Text style={{fontSize: 32}}>🏅</Text>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Text style={styles.taglineLarge}>LEADERBOARD</Text>
                  <Text style={styles.titleLarge}>Claim Your Place</Text>
                  <Text style={styles.descLarge}>Track your Karma points and climb the ranks.</Text>
                  <TouchableOpacity 
                    style={styles.impactBtn} 
                    onPress={() => router.push('/leaderboard')}
                  >
                    <Text style={styles.impactBtnText}>View Rankings</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* --- HOW IT WORKS --- */}
          <View style={styles.centeredSectionHeader}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <Text style={styles.sectionSubtitle}>Three simple steps to bridge the gap between surplus and need.</Text>
          </View>
          
          <View style={styles.stepsWrapper}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.horizontalSteps}
            >
              {[
                {id: '01', t: 'Share Surplus', d: 'List your surplus food safely on our platform.', i: '🤲', c: '#FAD7A0'},
                {id: '02', t: 'We Bridge', d: 'Our volunteers transport it to distribution points.', i: '🍴', c: '#A3E4D7'},
                {id: '03', t: 'Feed Lives', d: 'Nutritious meals are shared with dignity.', i: '❤️', c: '#F1948A'}
              ].map((step, idx) => (
                <View key={idx} style={styles.stepBox}>
                  <Text style={styles.hugeNum}>{step.id}</Text>
                  <View style={[styles.miniStepIcon, {backgroundColor: step.c}]}>
                    <Text style={{fontSize: 28}}>{step.i}</Text>
                  </View>
                  <Text style={styles.stepTitleSmall}>{step.t}</Text>
                  <Text style={styles.stepDescSmall}>{step.d}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* --- TESTIMONIALS SECTION --- */}
          <View style={styles.testimonialSection}>
            <View style={[styles.centeredSectionHeader, { marginTop: 10, marginBottom: 20 }]}>
              <Text style={{ fontSize: 40, marginBottom: 5 }}>✨</Text> 
              <Text style={styles.sectionTitle}>Voices of Impact</Text>
              <Text style={styles.sectionSubtitle}>Real stories from the people bridging the gap in Chennai.</Text>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.testimonialScroll}
              snapToInterval={300} 
              snapToAlignment="start"
              decelerationRate="fast"
            >
              {testimonials.map((item, idx) => (
                <View key={idx} style={[styles.testimonyCard, { backgroundColor: item.color }]}>
                  <View>
                    <Text style={styles.quoteIcon}>“</Text>
                    <Text style={styles.testimonyText}>{item.text}</Text>
                  </View>
                  <View style={styles.userInfo}>
                    <View style={styles.userAvatar}>
                      <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                    </View>
                    <View>
                      <Text style={styles.userName}>{item.name}</Text>
                      <Text style={styles.userRole}>{item.role}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

<LinearGradient 
  colors={['#ff791fcc', '#2e9081']} 
  style={styles.largeGreenBanner}
>
  <Text style={styles.bannerTitleLarge}>Be the Bridge</Text>
  <Text style={styles.bannerSubtitle}>Your surplus can be someone's sustenance.</Text>
  
  <View style={styles.ctaRow}>
    {/* DONATE BUTTON */}
    <TouchableOpacity 
      style={styles.bannerWhiteBtn}
      onPress={() => router.push('../donators')} 
    >
      <Text style={styles.bannerOrangeText}>Donate Now</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.bannerOutlineBtn}
      onPress={() => router.push('../VolunteerDashboard')} 
    >
      <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Volunteer</Text>
    </TouchableOpacity>
  </View>
</LinearGradient>

          <View style={styles.footer}>
            <Text style={styles.footerLogo}>Meal<Text style={{color: '#E67E22'}}>Bridge</Text></Text>
            <Text style={styles.footerNote}>Connecting Surplus to Service.</Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  absoluteBG: { flex: 1, width: '100%', height: '100%' },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { backgroundColor: '#E67E22', padding: 6, borderRadius: 8, marginRight: 8 },
  logoText: { fontSize: 20, fontWeight: '800', fontFamily: 'serif' },
  joinBtn: { backgroundColor: '#F39C12', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25 },
  joinBtnText: { color: '#FFF', fontWeight: 'bold' },

  heroSection: { padding: 25, alignItems: 'center', marginTop: 10 },
  badge: { backgroundColor: 'rgba(253, 237, 236, 0.8)', padding: 8, borderRadius: 15, marginBottom: 15 },
  badgeText: { color: '#E67E22', fontSize: 12, fontWeight: 'bold' },
  heroTitle: { fontSize: 44, fontWeight: '800', fontFamily: 'serif', textAlign: 'center', lineHeight: 52, color: '#1A242F' },
  heroDesc: { fontSize: 16, color: '#5D6D7E', marginTop: 15, textAlign: 'center', lineHeight: 24, maxWidth: '85%' },

  ctaRow: { flexDirection: 'row', marginTop: 30, gap: 15, justifyContent: 'center' },
  smallPrimaryBtn: { backgroundColor: '#F39C12', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25 },
  smallSecondaryBtn: { backgroundColor: 'rgba(255, 255, 255, 0.8)', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25, borderWidth: 1, borderColor: '#D5DBDB' },
  btnTextWhite: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  btnTextDark: { color: '#1A242F', fontWeight: '700', fontSize: 14 },

  /* --- NEW VOLUNTEER CTA STYLES --- */
  volunteerCtaWrapper: { paddingHorizontal: 20, marginVertical: 30 },
  volunteerCard: { borderRadius: 40, padding: 35, overflow: 'hidden', elevation: 15, shadowColor: '#2E9081', shadowOpacity: 0.3, shadowRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  quoteDecorative: { position: 'absolute', top: -10, left: 20 },
  quoteSymbol: { fontSize: 100, color: '#FFF', opacity: 0.1, fontFamily: 'serif' },
  modernQuote: { fontSize: 26, fontWeight: '900', color: '#FFF', lineHeight: 34, fontFamily: 'serif' },
  volunteerSubQuote: { color: '#D1F2EB', fontSize: 14, marginTop: 15, lineHeight: 22, opacity: 0.9 },
  glassBtn: { marginTop: 30, width: '100%', borderRadius: 20, overflow: 'hidden', elevation: 5 },
  glassBtnGradient: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  glassBtnText: { color: '#FFF', fontWeight: '900', fontSize: 15, letterSpacing: 1, textTransform: 'uppercase' },
  statsRowMini: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  miniStatText: { color: '#FFF', fontSize: 11, fontWeight: '800', opacity: 0.7 },

  centeredSectionHeader: { alignItems: 'center', marginTop: 50, marginBottom: 20, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 32, fontWeight: '800', fontFamily: 'serif', color: '#1a4776', textAlign: 'center' },
  sectionSubtitle: { fontSize: 14, color: '#467454', textAlign: 'center', marginTop: 5, maxWidth: '80%' },

  stepsWrapper: { width: '100%', alignItems: 'center' },
  horizontalSteps: { paddingHorizontal: 20, paddingVertical: 20, flexGrow: 1 },
  stepBox: { backgroundColor: 'rgba(255, 255, 255, 0.95)', width: 260, height: 300, padding: 30, borderRadius: 35, marginHorizontal: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1.5, borderColor: '#F2F4F4', elevation: 4 },
  hugeNum: { fontSize: 100, fontWeight: '900', color: '#F9FBFA', position: 'absolute', top: -10, right: -10, zIndex: -1 },
  miniStepIcon: { width: 75, height: 75, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  stepTitleSmall: { fontSize: 24, fontWeight: '800', color: '#4986c7', fontFamily: 'serif' },
  stepDescSmall: { color: '#7F8C8D', fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 22 },

  leaderboardSection: { paddingHorizontal: 20, paddingVertical: 20, alignItems: 'center' },
  impactCardBase: { width: '100%', backgroundColor: '#FFF', borderRadius: 30, overflow: 'hidden', elevation: 10, position: 'relative' },
  asymmetricBg: { position: 'absolute', top: 0, left: 0, right: 0, height: '75%', backgroundColor: 'rgba(230, 126, 34, 0.1)', transform: [{ rotate: '-3deg' }, { translateY: -20 }], width: '110%', alignSelf: 'center' },
  impactCardContent: { padding: 30, alignItems: 'center', zIndex: 1 },
  iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#E67E22' },
  taglineLarge: { color: '#E67E22', fontSize: 10, fontWeight: '900', letterSpacing: 3, marginBottom: 5 },
  titleLarge: { fontSize: 26, fontWeight: '800', color: '#1A242F', fontFamily: 'serif', textAlign: 'center' },
  descLarge: { fontSize: 14, color: '#5D6D7E', textAlign: 'center', marginTop: 8, marginBottom: 20 },
  impactBtn: { backgroundColor: '#E67E22', paddingHorizontal: 25, paddingVertical: 14, borderRadius: 15 },
  impactBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14, textTransform: 'uppercase' },

  testimonialSection: { paddingVertical: 20, backgroundColor: 'rgb(237, 203, 147)' },
  testimonialScroll: { paddingLeft: 20, paddingRight: 20, paddingBottom: 20 },
  testimonyCard: { width: 280, height: 320, padding: 30, borderRadius: 35, marginRight: 20, justifyContent: 'space-between', elevation: 2 },
  quoteIcon: { fontSize: 60, color: '#E67E22', fontFamily: 'serif', opacity: 0.2, marginBottom: -20 },
  testimonyText: { fontSize: 16, color: '#2C3E50', fontStyle: 'italic', lineHeight: 24, fontFamily: 'serif' },
  userInfo: { flexDirection: 'row', alignItems: 'center', paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
  userAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1A242F', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  userName: { fontSize: 15, fontWeight: '900', color: '#1A242F' },
  userRole: { fontSize: 12, color: '#7F8C8D', marginTop: 2 },

  largeGreenBanner: { margin: 15, padding: 50, borderRadius: 35, alignItems: 'center' },
  bannerTitleLarge: { color: '#FFF', fontSize: 38, fontWeight: 'bold', fontFamily: 'serif' },
  bannerSubtitle: { color: '#FFF', textAlign: 'center', marginTop: 15, opacity: 0.9, fontSize: 15 },
  bannerWhiteBtn: { backgroundColor: '#FFF', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25 },
  bannerOrangeText: { color: '#E67E22', fontWeight: 'bold' },
  bannerOutlineBtn: { borderWidth: 1, borderColor: '#FFF', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25 },

  footer: { padding: 40, alignItems: 'center', backgroundColor: '#1A242F' },
  footerLogo: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  footerNote: { color: '#7F8C8D', fontSize: 12, marginTop: 10 }
});