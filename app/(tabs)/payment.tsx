import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Dimensions, Clipboard, Image } from 'react-native';
import { ArrowLeft, CreditCard, Copy } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useUI } from '@/contexts/UIProvider';

const { width, height } = Dimensions.get('window');

export default function PaymentScreen() {
  const ui = useUI();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [name, setName] = useState('');
  const [card, setCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [stage, setStage] = useState<'form' | 'processing' | 'success' | 'declined'>('form');

  // Static bank details
  const bankDetails = {
    accountName: 'Jane Smith',
    bankName: 'First Bank',
    accountNumber: '1234567890',
  };

  const buttonScale = useSharedValue(1);
  const copyButtonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));
  const animatedCopyButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: copyButtonScale.value }],
  }));

  const handleButtonPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };
  const handleButtonPressOut = () => {
    buttonScale.value = withSpring(1);
  };
  const handleCopyButtonPressIn = () => {
    copyButtonScale.value = withSpring(0.95);
  };
  const handleCopyButtonPressOut = () => {
    copyButtonScale.value = withSpring(1);
  };

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    // Optionally, you could add a toast notification here for feedback
  };

  useEffect(() => {
    if (stage === 'processing') {
      ui.showLoader('Processing payment...');
      const t = setTimeout(() => ui.hideLoader(), 800);
      return () => clearTimeout(t);
    }
  }, [stage]);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content}>
          <Animated.View entering={FadeInDown} style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.title}>Payment</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100)} style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, paymentMethod === 'card' ? styles.activeTab : {}]}
              onPress={() => setPaymentMethod('card')}
            >
              <Text style={[styles.tabText, paymentMethod === 'card' ? styles.activeTabText : {}]}>Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, paymentMethod === 'bank' ? styles.activeTab : {}]}
              onPress={() => setPaymentMethod('bank')}
            >
              <Text style={[styles.tabText, paymentMethod === 'bank' ? styles.activeTabText : {}]}>Bank Transfer</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)} style={styles.form}>
            {stage === 'form' && (paymentMethod === 'card') && (
              <>
                <Text style={[styles.label, styles.firstLabel]}>Cardholder Name</Text>
                <Animated.View entering={FadeInDown.delay(300)} style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="ex: Jane Smith"
                    placeholderTextColor="#9CA3AF"
                  />
                </Animated.View>

                <Text style={styles.label}>Card Number</Text>
                <Animated.View entering={FadeInDown.delay(400)} style={styles.inputContainer}>
                  <CreditCard size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.inputWithIcon]}
                    value={card}
                    onChangeText={setCard}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    maxLength={16}
                  />
                </Animated.View>

                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Expiry</Text>
                    <Animated.View entering={FadeInDown.delay(500)} style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={expiry}
                        onChangeText={setExpiry}
                        placeholder="MM/YY"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="number-pad"
                        maxLength={5}
                      />
                    </Animated.View>
                  </View>
                  <View style={{ width: 16 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>CVV</Text>
                    <Animated.View entering={FadeInDown.delay(600)} style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={cvv}
                        onChangeText={setCvv}
                        placeholder="123"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="number-pad"
                        maxLength={3}
                      />
                    </Animated.View>
                  </View>
                </View>

                <Animated.View entering={FadeInDown.delay(700)}>
                  <TouchableOpacity
                    style={styles.payBtn}
                    activeOpacity={0.95}
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                    onPress={() => setStage('processing')}
                  >
                    <Animated.View style={[styles.payBtnInner, animatedButtonStyle]}>
                      <Text style={styles.payBtnText}>Pay Now</Text>
                    </Animated.View>
                  </TouchableOpacity>
                </Animated.View>
              </>
            )}
            {stage === 'form' && (paymentMethod === 'bank') && (
              <>
                <Text style={[styles.label, styles.firstLabel]}>Account Name</Text>
                <Animated.View entering={FadeInDown.delay(300)} style={styles.detailContainer}>
                  <Text style={styles.detailText}>{bankDetails.accountName}</Text>
                  <TouchableOpacity
                    style={styles.copyBtn}
                    onPress={() => handleCopy(bankDetails.accountName)}
                    onPressIn={handleCopyButtonPressIn}
                    onPressOut={handleCopyButtonPressOut}
                  >
                    <Animated.View style={[styles.copyBtnInner, animatedCopyButtonStyle]}>
                      <Copy size={16} color="#FFFFFF" />
                    </Animated.View>
                  </TouchableOpacity>
                </Animated.View>

                <Text style={styles.label}>Bank Name</Text>
                <Animated.View entering={FadeInDown.delay(400)} style={styles.detailContainer}>
                  <Text style={styles.detailText}>{bankDetails.bankName}</Text>
                  <TouchableOpacity
                    style={styles.copyBtn}
                    onPress={() => handleCopy(bankDetails.bankName)}
                    onPressIn={handleCopyButtonPressIn}
                    onPressOut={handleCopyButtonPressOut}
                  >
                    <Animated.View style={[styles.copyBtnInner, animatedCopyButtonStyle]}>
                      <Copy size={16} color="#FFFFFF" />
                    </Animated.View>
                  </TouchableOpacity>
                </Animated.View>

                <Text style={styles.label}>Account Number</Text>
                <Animated.View entering={FadeInDown.delay(500)} style={styles.detailContainer}>
                  <Text style={styles.detailText}>{bankDetails.accountNumber}</Text>
                  <TouchableOpacity
                    style={styles.copyBtn}
                    onPress={() => handleCopy(bankDetails.accountNumber)}
                    onPressIn={handleCopyButtonPressIn}
                    onPressOut={handleCopyButtonPressOut}
                  >
                    <Animated.View style={[styles.copyBtnInner, animatedCopyButtonStyle]}>
                      <Copy size={16} color="#FFFFFF" />
                    </Animated.View>
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(600)}>
                  <TouchableOpacity
                    style={styles.payBtn}
                    activeOpacity={0.95}
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                    onPress={() => setStage('processing')}
                  >
                    <Animated.View style={[styles.payBtnInner, animatedButtonStyle]}>
                      <Text style={styles.payBtnText}>I Have Sent It</Text>
                    </Animated.View>
                  </TouchableOpacity>
                </Animated.View>
              </>
            )}

            {stage === 'processing' && (
              <View style={styles.processCard}>
                <Text style={styles.processTitle}>Confirming your payment…</Text>
                <Text style={styles.processSub}>
                  This may take a few seconds. We are verifying your payment details with our secure payment gateway. 
                  Please do not close this window or navigate away while we process your transaction. 
                  This process typically takes between 15-30 seconds depending on your bank's response time.
                </Text>
                <Text style={styles.processNote}>
                  Note: For bank transfers, it may take up to 24 hours for the payment to reflect in our system. 
                  You will receive a confirmation email once the payment is verified.
                </Text>
                
                <Animated.View entering={FadeInDown.delay(400)} style={styles.simButtonsContainer}>
                  <Text style={styles.simTitle}>Test Payment Result:</Text>
                  <View style={styles.processRow}>
                    <TouchableOpacity 
                      style={[styles.simBtn, styles.simSuccess]} 
                      onPress={() => setStage('success')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.simTextWhite}>✓ Simulate Success</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.simBtn, styles.simDeclined]} 
                      onPress={() => setStage('declined')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.simTextDark}>✗ Simulate Decline</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
                
                <TouchableOpacity 
                  style={styles.linkBtn} 
                  onPress={() => setStage('form')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.linkText}>← Back to payment form</Text>
                </TouchableOpacity>
              </View>
            )}

            {stage === 'success' && (
              <View style={styles.resultCard}>
                <Image source={require('../../assets/done.png')} style={styles.resultImg} resizeMode="contain" />
                <Text style={styles.resultTitle}>Payment Successful</Text>
                <Text style={styles.resultSub}>Thank you. Your booking is confirmed. We have sent you a confirmation email with all the details of your booking. Please check your inbox and spam folder if you don't see it in your main inbox.</Text>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Method</Text>
                  <Text style={styles.resultValue}>{paymentMethod === 'card' ? 'Card' : 'Bank Transfer'}</Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Name</Text>
                  <Text style={styles.resultValue}>{name || '—'}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.primaryCta} 
                  onPress={() => router.replace('/(tabs)/home')}
                >
                  <Text style={styles.primaryCtaText}>Go to Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryCta} onPress={() => setStage('form')}>
                  <Text style={styles.secondaryCtaText}>Make another payment</Text>
                </TouchableOpacity>
              </View>
            )}

            {stage === 'declined' && (
              <View style={styles.resultCard}>
                <Image source={require('../../assets/error.png')} style={styles.resultImg} resizeMode="contain" />
                <Text style={styles.resultTitle}>Payment Declined</Text>
                <Text style={styles.resultSub}>Your payment couldn't be verified. This could be due to insufficient funds, incorrect card information, or a temporary issue with your bank. Please try another method or try again with correct information. If the problem persists, contact your bank for assistance.</Text>
                <TouchableOpacity style={styles.primaryCta} onPress={() => setStage('form')}>
                  <Text style={styles.primaryCtaText}>Try Again</Text>
                </TouchableOpacity>
                <View style={styles.processRow}>
                  <TouchableOpacity style={[styles.simBtn, styles.simSuccess]} onPress={() => setPaymentMethod('card')}>
                    <Text style={styles.simTextWhite}>Use Card</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.simBtn, styles.simDeclined]} onPress={() => setPaymentMethod('bank')}>
                    <Text style={styles.simTextDark}>Bank Transfer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, paddingTop: 60, paddingBottom: 40, minHeight: height },
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#111111',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  form: { 
    marginTop: 0, 
    flex: 1, 
    justifyContent: 'flex-start' 
  },
  firstLabel: {
    marginTop: 0,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  detailText: {
    flex: 1,
    color: '#111827',
    fontSize: 16,
    lineHeight: 24,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    color: '#111827',
    fontSize: 16,
    lineHeight: 24,
  },
  inputWithIcon: { paddingLeft: 40 },
  inputIcon: { position: 'absolute', left: 12, top: '50%', transform: [{ translateY: -10 }] },
  row: { flexDirection: 'row', marginBottom: 16 },
  copyBtn: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  copyBtnInner: {
    backgroundColor: '#6B7280',
    padding: 8,
  },
  payBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  payBtnInner: {
    backgroundColor: '#111111',
    paddingVertical: 16,
    alignItems: 'center',
  },
  payBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 18, letterSpacing: 0.5 },
  spinnerWrap: { alignItems: 'center', justifyContent: 'center', marginVertical: 24 },
  spinner: {
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    borderWidth: 5,
    borderColor: '#E5E7EB', 
    borderTopColor: '#111111'
  },
  processCard: {
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 32, 
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 16, 
    elevation: 8,
    minHeight: height * 0.7,
    justifyContent: 'center',
  },
  processTitle: { 
    fontSize: 26, 
    fontWeight: '800', 
    color: '#111111', 
    marginBottom: 24, 
    textAlign: 'center' 
  },
  processSub: { 
    color: '#6B7280', 
    marginBottom: 20, 
    textAlign: 'center', 
    fontSize: 16, 
    lineHeight: 24 
  },
  processNote: {
    color: '#9CA3AF',
    marginBottom: 32,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic'
  },
  simButtonsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 24,
    marginVertical: 24,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  simTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
    marginBottom: 16,
  },
  processRow: { 
    flexDirection: 'row', 
    gap: 12,
    justifyContent: 'space-between',
  },
  simBtn: { 
    flex: 1, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  simSuccess: { 
    backgroundColor: '#28A745',
    shadowColor: '#28A745',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  simDeclined: { 
    backgroundColor: '#FFFFFF', 
    borderWidth: 2, 
    borderColor: '#DC3545',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  simTextWhite: { 
    color: '#FFFFFF', 
    fontWeight: '700', 
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  simTextDark: { 
    color: '#DC3545', 
    fontWeight: '700', 
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  linkBtn: { 
    alignSelf: 'center', 
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  linkText: { 
    color: '#6C757D', 
    fontWeight: '600', 
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  resultCard: {
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 32, 
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 12, 
    elevation: 4,
    minHeight: height * 0.7,
    justifyContent: 'center',
  },
  resultTitle: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#111111', 
    marginBottom: 16, 
    textAlign: 'center' 
  },
  resultImg: { 
    width: 120, 
    height: 120, 
    alignSelf: 'center', 
    marginBottom: 24 
  },
  resultSub: { 
    color: '#6B7280', 
    marginBottom: 32, 
    textAlign: 'center', 
    fontSize: 18, 
    lineHeight: 28 
  },
  resultRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16, 
    paddingHorizontal: 8 
  },
  resultLabel: { 
    color: '#6B7280', 
    fontSize: 16 
  },
  resultValue: { 
    color: '#111111', 
    fontWeight: '700', 
    fontSize: 16 
  },
  primaryCta: { 
    backgroundColor: '#111111', 
    borderRadius: 16, 
    alignItems: 'center', 
    paddingVertical: 18, 
    marginTop: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryCtaText: { 
    color: '#FFFFFF', 
    fontWeight: '800', 
    fontSize: 18 
  },
  secondaryCta: { 
    alignItems: 'center', 
    paddingVertical: 16 
  },
  secondaryCtaText: { 
    color: '#111111', 
    fontWeight: '700', 
    fontSize: 16 
  },
});