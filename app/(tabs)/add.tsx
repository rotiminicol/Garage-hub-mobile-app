import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Dimensions, SafeAreaView } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue, 
  withSpring,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { Camera, Upload, MapPin, DollarSign, Home, Car, ChevronLeft, ChevronRight, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '@/components/Logo';

const { width, height } = Dimensions.get('window');

// Local listing assets for previews
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
  require('../../assets/listing-images/dillon-kydd-3Ignkeds3w8-unsplash.jpg'),
  require('../../assets/listing-images/jakob-rosen-JUkrwViCvyE-unsplash.jpg'),
];

export default function AddListingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    size: '',
    location: '',
    type: 'residential',
  });

  const progressWidth = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const updateProgress = (step: number) => {
    progressWidth.value = withTiming((step + 1) * (100 / steps.length), { duration: 500 });
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const steps = ['Photos', 'Details', 'Location', 'Preview'];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      updateProgress(newStep);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      updateProgress(newStep);
    }
  };

  const handleButtonPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const handleButtonPressOut = () => {
    buttonScale.value = withSpring(1);
  };

  React.useEffect(() => {
    updateProgress(currentStep);
  }, []);

  const PhotoStep = () => (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Add Photos</Text>
      <Text style={styles.stepDescription}>
        Upload high-quality photos of your storage space
      </Text>
      
      <View style={styles.photoGrid}>
        <TouchableOpacity
          style={styles.photoUpload}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Animated.View style={[styles.photoUploadInner, animatedButtonStyle]}>
            <Camera size={28} color="#111111" />
            <Text style={styles.photoUploadText}>Take Photo</Text>
          </Animated.View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.photoUpload}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Animated.View style={[styles.photoUploadInner, animatedButtonStyle]}>
            <Upload size={28} color="#111111" />
            <Text style={styles.photoUploadText}>Upload from Gallery</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.photoPreview}>
        {[0,1,2,3,4,5].map((idx, i) => (
          <Animated.View key={idx} entering={FadeIn.delay(300 + i * 100)}>
            <Image source={listingAssets[idx % listingAssets.length]} style={styles.previewImage} />
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const DetailsStep = () => (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Storage Details</Text>
      
      <View style={styles.typeSelector}>
        <TouchableOpacity 
          style={[styles.typeOption, formData.type === 'residential' && styles.activeType]}
          onPress={() => setFormData({...formData, type: 'residential'})}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Animated.View style={[styles.typeOptionInner, animatedButtonStyle]}>
            <Home size={24} color={formData.type === 'residential' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.typeText, formData.type === 'residential' && styles.activeTypeText]}>
              Residential
            </Text>
          </Animated.View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.typeOption, formData.type === 'commercial' && styles.activeType]}
          onPress={() => setFormData({...formData, type: 'commercial'})}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Animated.View style={[styles.typeOptionInner, animatedButtonStyle]}>
            <Car size={24} color={formData.type === 'commercial' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.typeText, formData.type === 'commercial' && styles.activeTypeText]}>
              Commercial
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Title</Text>
        <Animated.View entering={FadeInDown.delay(300)} style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="e.g., Secure Downtown Garage"
            placeholderTextColor="#9CA3AF"
            value={formData.title}
            onChangeText={(text) => setFormData({...formData, title: text})}
          />
        </Animated.View>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Description</Text>
        <Animated.View entering={FadeInDown.delay(400)} style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your storage space..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(text) => setFormData({...formData, description: text})}
          />
        </Animated.View>
      </View>
      
      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
          <Text style={styles.inputLabel}>Size (sq ft)</Text>
          <Animated.View entering={FadeInDown.delay(500)} style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="250"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={formData.size}
              onChangeText={(text) => setFormData({...formData, size: text})}
            />
          </Animated.View>
        </View>
        
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
          <Text style={styles.inputLabel}>Price/Month ($)</Text>
          <Animated.View entering={FadeInDown.delay(600)} style={styles.inputContainer}>
            <DollarSign size={20} color="#6B7280" style={styles.currencySymbol} />
            <TextInput
              style={[styles.input, styles.priceInput]}
              placeholder="150"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={formData.price}
              onChangeText={(text) => setFormData({...formData, price: text})}
            />
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );

  const LocationStep = () => (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Location</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Address</Text>
        <Animated.View entering={FadeInDown.delay(300)} style={styles.inputContainer}>
          <MapPin size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, styles.locationTextInput]}
            placeholder="Enter your address"
            placeholderTextColor="#9CA3AF"
            value={formData.location}
            onChangeText={(text) => setFormData({...formData, location: text})}
          />
        </Animated.View>
      </View>
      
      <Animated.View entering={FadeInDown.delay(400)} style={styles.mapPlaceholder}>
        <MapPin size={40} color="#6B7280" />
        <Text style={styles.mapText}>Map Preview</Text>
        <Text style={styles.mapSubtext}>Location will be shown here</Text>
      </Animated.View>
    </Animated.View>
  );

  const PreviewStep = () => (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Preview Listing</Text>
      
      <Animated.View entering={FadeInDown.delay(300)} style={styles.previewCard}>
        <Image 
          source={listingAssets[6 % listingAssets.length]}
          style={styles.previewCardImage}
        />
        <View style={styles.previewCardContent}>
          <Text style={styles.previewCardTitle}>{formData.title || 'Your Storage Space'}</Text>
          <View style={styles.locationRow}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.previewCardLocation}>{formData.location || 'Your Location'}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.previewCardPrice}>${formData.price || '0'}/month</Text>
            <Text style={styles.previewCardSize}>{formData.size || '0'} sq ft</Text>
          </View>
          <Text style={styles.previewCardDescription} numberOfLines={3}>
            {formData.description || 'No description provided'}
          </Text>
        </View>
      </Animated.View>
      
      <Animated.View entering={FadeInDown.delay(400)} style={styles.previewCard}>
        <Image 
          source={listingAssets[7 % listingAssets.length]}
          style={styles.previewCardImage}
        />
        <View style={styles.previewCardContent}>
          <Text style={styles.previewCardTitle}>{formData.title || 'Your Storage Space'}</Text>
          <View style={styles.locationRow}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.previewCardLocation}>{formData.location || 'Your Location'}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.previewCardPrice}>${formData.price || '0'}/month</Text>
            <Text style={styles.previewCardSize}>{formData.size || '0'} sq ft</Text>
          </View>
          <Text style={styles.previewCardDescription} numberOfLines={3}>
            {formData.description || 'No description provided'}
          </Text>
        </View>
      </Animated.View>
      
      <TouchableOpacity
        style={styles.publishButton}
        onPressIn={handleButtonPressIn}
        onPressOut={handleButtonPressOut}
      >
        <LinearGradient
          colors={['#374151', '#1F2937']}
          style={styles.publishGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Animated.View style={[styles.publishButtonInner, animatedButtonStyle]}>
            <Check size={20} color="#FFFFFF" />
            <Text style={styles.publishText}>Publish Listing</Text>
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <PhotoStep />;
      case 1: return <DetailsStep />;
      case 2: return <LocationStep />;
      case 3: return <PreviewStep />;
      default: return <PhotoStep />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeInDown} style={styles.header}>
        <View style={styles.placeholder} />
        <Text style={styles.title}>Create Listing</Text>
        <View style={styles.placeholder} />
      </Animated.View>
      
      <Animated.View entering={FadeInDown.delay(100)} style={styles.progressContainer}>
        <View style={styles.stepIndicators}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepIndicatorRow}>
              <View style={[
                styles.stepIndicator,
                index <= currentStep && styles.stepIndicatorActive,
                index < currentStep && styles.stepIndicatorCompleted
              ]}>
                {index < currentStep ? (
                  <Check size={16} color="#FFFFFF" />
                ) : (
                  <Text style={[
                    styles.stepNumber,
                    index <= currentStep && styles.stepNumberActive
                  ]}>
                    {index + 1}
                  </Text>
                )}
              </View>
              {index < steps.length - 1 && (
                <View style={[
                  styles.stepConnector,
                  index < currentStep && styles.stepConnectorActive
                ]} />
              )}
            </View>
          ))}
        </View>
        
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
        </Text>
      </Animated.View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {renderStep()}

        <View style={styles.pageButtons}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.navButton}
              onPress={prevStep}
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
            >
              <Animated.View style={[styles.navButtonInner, animatedButtonStyle]}>
                <ChevronLeft size={20} color="#111111" />
                <Text style={styles.navButtonText}>Back</Text>
              </Animated.View>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={currentStep < steps.length - 1 ? nextStep : () => {}}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
          >
            <LinearGradient
              colors={['#374151', '#1F2937']}
              style={styles.nextButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Animated.View style={[styles.nextButtonInner, animatedButtonStyle]}>
                <Text style={[styles.navButtonText, styles.nextButtonText]}>
                  {currentStep < steps.length - 1 ? 'Next' : 'Publish'}
                </Text>
                {currentStep < steps.length - 1 ? (
                  <ChevronRight size={20} color="#FFFFFF" />
                ) : (
                  <Check size={20} color="#FFFFFF" />
                )}
              </Animated.View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.brandFooter}>
          <Logo size={24} />
          <Text style={styles.brandText}>GarageHub · Privacy · Terms</Text>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

          </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 32,
  },
  progressContainer: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stepIndicatorActive: {
    backgroundColor: '#111111',
  },
  stepIndicatorCompleted: {
    backgroundColor: '#4B5563',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepConnector: {
    flex: 1,
    height: 3,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 6,
  },
  stepConnectorActive: {
    backgroundColor: '#111111',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#111111',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stepContainer: {
    paddingVertical: 16,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 24,
  },
  photoGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  photoUpload: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  photoUploadInner: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  photoUploadText: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
  photoPreview: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  previewImage: {
    width: (width - 56) / 3, // 3 images per row accounting for 16px side padding and 12px gaps (32 + 24 = 56)
    height: (width - 56) / 3,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  typeOption: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  typeOptionInner: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeType: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  typeText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  activeTypeText: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    padding: 16,
    color: '#111111',
    fontSize: 16,
    lineHeight: 24,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  currencySymbol: {
    marginLeft: 16,
  },
  priceInput: {
    flex: 1,
    borderWidth: 0,
    paddingLeft: 8,
  },
  locationTextInput: {
    flex: 1,
    paddingLeft: 8,
  },
  inputIcon: {
    marginLeft: 12,
  },
  mapPlaceholder: {
    height: 220,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  mapText: {
    fontSize: 18,
    color: '#111111',
    fontWeight: '600',
    marginTop: 12,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  previewCardImage: {
    width: '100%',
    height: 220,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  previewCardContent: {
    padding: 20,
  },
  previewCardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  previewCardLocation: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewCardPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
  },
  previewCardSize: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  previewCardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  publishButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 24,
  },
  publishGradient: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  publishButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  publishText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 24,
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  navButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  navButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },
  nextButton: {
    flex: 2,
  },
  nextButtonGradient: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
  },
  pageButtons: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 16,
  },
  brandFooter: {
    paddingTop: 28,
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
  },
});