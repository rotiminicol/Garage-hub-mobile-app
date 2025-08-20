import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { ArrowLeft, MapPin, Star, Shield, Wifi, Car, Lock, Clock, Calendar, Ruler, Users } from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useUI } from '@/contexts/UIProvider';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

// Mirror the same asset order used in index/search screens
const listingAssets = [
  require('../../assets/listing-images/aldo-festevole-l-URrPJLp8w-unsplash.jpg'),
  require('../../assets/listing-images/alex-suprun-AHnhdjyTNGM-unsplash.jpg'),
  require('../../assets/listing-images/alex-suprun-d304gprGG5k-unsplash.jpg'),
  require('../../assets/listing-images/alexandra-gorn-JIUjvqe2ZHg-unsplash.jpg'),
  require('../../assets/listing-images/arlind-photography-XW38h9JRL_I-unsplash.jpg'),
  require('../../assets/listing-images/avery-klein-JaXs8Tk5Iww-unsplash.jpg'),
  require('../../assets/listing-images/barthelemy-de-mazenod-DI7E79H3joQ-unsplash.jpg'),
  require('../../assets/listing-images/brandi-alexandra-MgJPU2da8jY-unsplash.jpg'),
  require('../../assets/listing-images/caleb-rogers-SGLh5-clL4E-unsplash.jpg'),
  require('../../assets/listing-images/claudio-poggio-FeK8zDytXDA-unsplash.jpg'),
  require('../../assets/listing-images/claudio-schwarz-07r4q_MX6ik-unsplash.jpg'),
  require('../../assets/listing-images/dillon-kydd-3Ignkeds3w8-unsplash.jpg'),
  require('../../assets/listing-images/dillon-kydd-XGvwt544g8k-unsplash.jpg'),
  require('../../assets/listing-images/estefania-ruiz-m1kvhaIw3-8-unsplash.jpg'),
  require('../../assets/listing-images/jakob-rosen-JUkrwViCvyE-unsplash.jpg'),
  require('../../assets/listing-images/jose-rago-LNlJ0WZHiEs-unsplash.jpg'),
  require('../../assets/listing-images/josh-mccausland-BBSk8kPRNw4-unsplash.jpg'),
  require('../../assets/listing-images/kam-idris-_HqHX3LBN18-unsplash.jpg'),
  require('../../assets/listing-images/kate-trifo-iXSD1nM_qQo-unsplash.jpg'),
  require('../../assets/listing-images/keenan-dunn-Y0-OfYQMDlM-unsplash.jpg'),
  require('../../assets/listing-images/kellen-riggin-JZ_HBh_l8F8-unsplash.jpg'),
  require('../../assets/listing-images/kenny-eliason-mGZX2MOPR-s-unsplash.jpg'),
  require('../../assets/listing-images/kevin-schmid-42MP7b-AJ-Q-unsplash.jpg'),
  require('../../assets/listing-images/kevin-wolf-3AbwSH1y9dc-unsplash.jpg'),
  require('../../assets/listing-images/mad-visual-hAZGSiPkfGY-unsplash.jpg'),
  require('../../assets/listing-images/marten-bjork-Z2EgLCJob40-unsplash.jpg'),
  require('../../assets/listing-images/meg-ikvL3QiH9AY-unsplash.jpg'),
  require('../../assets/listing-images/naomi-hebert-MP0bgaS_d1c-unsplash.jpg'),
  require('../../assets/listing-images/outsite-co-R-LK3sqLiBw-unsplash.jpg'),
  require('../../assets/listing-images/point3d-commercial-imaging-ltd-jhJ6WIGW_80-unsplash.jpg'),
  require('../../assets/listing-images/point3d-commercial-imaging-ltd-SP4oH94qOCU-unsplash.jpg'),
  require('../../assets/listing-images/point3d-commercial-imaging-ltd-X_JXnSBKOO4-unsplash.jpg'),
  require('../../assets/listing-images/priscilla-du-preez-tjUD8rg38po-unsplash.jpg'),
  require('../../assets/listing-images/ryunosuke-kikuno-pyZM2RYCwKE-unsplash.jpg'),
  require('../../assets/listing-images/sean-foster-lcJ34i8m7cM-unsplash.jpg'),
  require('../../assets/listing-images/steve-johnson-S0j-5wSN3YQ-unsplash.jpg'),
  require('../../assets/listing-images/theo-TlWM_glSTw0-unsplash.jpg'),
  require('../../assets/listing-images/timothy-buck-psrloDbaZc8-unsplash.jpg'),
  require('../../assets/listing-images/viktor-theo-1rw3l343EDM-unsplash.jpg'),
  require('../../assets/listing-images/vivint-solar-HASgVRE48KY-unsplash.jpg'),
  require('../../assets/listing-images/yucel-moran-iYtsRY32szw-unsplash.jpg'),
];

const { width } = Dimensions.get('window');

export default function ListingImageDetails() {
  const ui = useUI();
  const params = useLocalSearchParams<{
    id?: string; title?: string; price?: string; location?: string; rating?: string; images?: string; imagesIdx?: string;
  }>();

  const imagesIdx: number[] = useMemo(() => {
    try { return params.imagesIdx ? JSON.parse(params.imagesIdx as string) : []; } catch { return []; }
  }, [params.imagesIdx]);

  const remoteImages: string[] = useMemo(() => {
    try { return params.images ? JSON.parse(params.images as string) : []; } catch { return []; }
  }, [params.images]);

  const [review, setReview] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleButtonPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const handleButtonPressOut = () => {
    buttonScale.value = withSpring(1);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown} style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>{params.title || 'Listing'}</Text>
        </Animated.View>

        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageCarousel}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / (width - 32));
              setCurrentImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {(imagesIdx.length ? imagesIdx.map(i => listingAssets[i]) : (remoteImages.length ? remoteImages : [
              'https://images.pexels.com/photos/271808/pexels-photo-271808.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/1756826/pexels-photo-1756826.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/2393828/pexels-photo-2393828.jpeg?auto=compress&cs=tinysrgb&w=800',
            ])).slice(0, 4).map((src, i) => (
              <Animated.View key={i} entering={FadeIn} style={styles.imageWrapper}>
                <Image source={typeof src === 'string' ? { uri: src } : src} style={styles.heroImage} />
              </Animated.View>
            ))}
          </ScrollView>
          <View style={styles.carouselIndicators}>
            {(imagesIdx.length ? imagesIdx : (remoteImages.length ? remoteImages : ['1', '2', '3'])).slice(0, 4).map((_, i) => (
              <View
                key={i}
                style={[styles.indicator, currentImageIndex === i ? styles.activeIndicator : {}]}
              />
            ))}
          </View>
        </View>

        <Animated.View entering={FadeInDown.delay(100)} style={styles.metaRow}>
          <Text style={styles.price}>${params.price || '—'}/mo</Text>
          <View style={styles.ratingRow}>
            <Star size={18} color="#FBBF24" fill="#FBBF24" />
            <Text style={styles.ratingText}>{params.rating || '4.8'}</Text>
          </View>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.locationRow}>
          <MapPin size={18} color="#6B7280" />
          <Text style={styles.locationText}>{params.location || 'United States'}</Text>
        </Animated.View>

        {/* Amenities */}
        <Animated.Text entering={FadeInDown.delay(250)} style={styles.sectionTitle}>Amenities</Animated.Text>
        <Animated.View entering={FadeInDown.delay(300)} style={styles.chipsRow}>
          <View style={styles.chip}><Wifi size={14} color="#111111" /><Text style={styles.chipText}>Wi‑Fi</Text></View>
          <View style={styles.chip}><Lock size={14} color="#111111" /><Text style={styles.chipText}>Secure Access</Text></View>
          <View style={styles.chip}><Car size={14} color="#111111" /><Text style={styles.chipText}>Parking</Text></View>
          <View style={styles.chip}><Ruler size={14} color="#111111" /><Text style={styles.chipText}>Spacious</Text></View>
          <View style={styles.chip}><Shield size={14} color="#111111" /><Text style={styles.chipText}>CCTV</Text></View>
          <View style={styles.chip}><Clock size={14} color="#111111" /><Text style={styles.chipText}>24/7</Text></View>
        </Animated.View>

        {/* About */}
        <Animated.Text entering={FadeInDown.delay(320)} style={styles.sectionTitle}>About this listing</Animated.Text>
        <Animated.View entering={FadeInDown.delay(360)} style={styles.card}>
          <Text style={styles.bodyText}>
            Conveniently located storage with easy access and enhanced security. Perfect for vehicles, inventory, and seasonal items. Climate-friendly with natural airflow and power outlet access on request.
          </Text>
          <View style={styles.bullets}>
            <Text style={styles.bullet}>• 300–500 sq ft flexible space</Text>
            <Text style={styles.bullet}>• Keypad entry and monitored CCTV</Text>
            <Text style={styles.bullet}>• Drive‑up access, large roller door</Text>
          </View>
        </Animated.View>

        {/* Host */}
        <Animated.Text entering={FadeInDown.delay(380)} style={styles.sectionTitle}>Host</Animated.Text>
        <Animated.View entering={FadeInDown.delay(420)} style={styles.hostCard}>
          <Image source={{ uri: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200' }} style={styles.hostAvatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.hostName}>Alex Morgan</Text>
            <Text style={styles.hostMeta}>Superhost · 124 reviews</Text>
          </View>
          <TouchableOpacity style={styles.contactBtn} onPress={() => router.push('/(tabs)/messages')}>
            <Text style={styles.contactBtnText}>Message</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Policies */}
        <Animated.Text entering={FadeInDown.delay(440)} style={styles.sectionTitle}>Policies</Animated.Text>
        <Animated.View entering={FadeInDown.delay(460)} style={styles.card}>
          <Text style={styles.policyRow}>Cancellation: Flexible — full refund 24h before start</Text>
          <Text style={styles.policyRow}>Access: 24/7 keypad</Text>
          <Text style={styles.policyRow}>Minimum term: 1 month</Text>
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(300)} style={styles.sectionTitle}>Reviews</Animated.Text>
        <Animated.View entering={FadeInDown.delay(400)} style={styles.reviewBox}>
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your experience"
            placeholderTextColor="#9CA3AF"
            value={review}
            onChangeText={setReview}
            multiline
          />
          <TouchableOpacity
            style={styles.reviewBtn}
            activeOpacity={0.9}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
          >
            <Animated.View style={[styles.reviewBtnInner, animatedButtonStyle]}>
              <Text style={styles.reviewBtnText}>Post</Text>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500)}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.95}
            onPress={() => {
              ui.showLoader('Preparing payment...');
              setTimeout(() => ui.hideLoader(), 500);
              router.push('/(tabs)/payment');
            }}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
          >
            <Animated.View style={[styles.primaryBtnInner, animatedButtonStyle]}>
              <Text style={styles.primaryBtnText}>Book this listing</Text>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, paddingTop: 60, paddingBottom: 160 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#111111',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  backBtn: { padding: 8, marginRight: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', flex: 1, letterSpacing: 0.5 },
  carouselContainer: { position: 'relative', marginBottom: 16 },
  imageCarousel: { height: 240 },
  imageWrapper: { width: width - 32, alignItems: 'center' },
  heroImage: {
    width: width - 32,
    height: 240,
    borderRadius: 16,
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    opacity: 0.5,
    marginHorizontal: 4,
  },
  activeIndicator: { opacity: 1, backgroundColor: '#111111' },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  price: { fontSize: 24, fontWeight: '800', color: '#111111', letterSpacing: 0.5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingText: { color: '#111827', fontWeight: '700', fontSize: 16 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20, paddingHorizontal: 8 },
  locationText: { color: '#6B7280', fontSize: 14, fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111111', marginTop: 12, marginBottom: 12, paddingHorizontal: 8 },
  reviewBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reviewInput: {
    minHeight: 100,
    color: '#111827',
    fontSize: 16,
    lineHeight: 24,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  reviewBtn: {
    alignSelf: 'flex-end',
    borderRadius: 12,
    overflow: 'hidden',
  },
  reviewBtnInner: {
    backgroundColor: '#111111',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  reviewBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  card: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  bodyText: { color: '#111827', lineHeight: 22, fontSize: 14 },
  bullets: { marginTop: 8, gap: 4 },
  bullet: { color: '#6B7280', fontSize: 13 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999 },
  chipText: { color: '#111827', fontWeight: '600', fontSize: 12 },
  hostCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  hostAvatar: { width: 48, height: 48, borderRadius: 24 },
  hostName: { color: '#111111', fontWeight: '700' },
  hostMeta: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  contactBtn: { backgroundColor: '#111111', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  contactBtnText: { color: '#FFFFFF', fontWeight: '700' },
  policyRow: { color: '#111827', fontSize: 14, marginBottom: 6 },
  primaryBtn: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnInner: {
    backgroundColor: '#111111',
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 18, letterSpacing: 0.5 },
});