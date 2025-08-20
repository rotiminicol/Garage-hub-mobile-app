import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text, Pressable } from 'react-native';
import ErrorPopup from '@/components/ErrorPopup';
import OuroborosLoader from '@/components/OuroborosLoader';

type UIContextValue = {
  showError: (message: string, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;
  hideError: () => void;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
};

const UIContext = createContext<UIContextValue | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorVariant, setErrorVariant] = useState<'error' | 'success'>('error');

  const [loaderVisible, setLoaderVisible] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState<string | undefined>(undefined);

  const showError = useCallback((message: string, title?: string) => {
    setErrorVariant('error');
    setErrorTitle(title);
    setErrorMessage(message);
    setErrorVisible(true);
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    setErrorVariant('success');
    setErrorTitle(title);
    setErrorMessage(message);
    setErrorVisible(true);
  }, []);

  const hideError = useCallback(() => {
    setErrorVisible(false);
  }, []);

  const showLoader = useCallback((message?: string) => {
    setLoaderMessage(message);
    setLoaderVisible(true);
  }, []);

  const hideLoader = useCallback(() => {
    setLoaderVisible(false);
    setLoaderMessage(undefined);
  }, []);

  const value = useMemo(
    () => ({ showError, showSuccess, hideError, showLoader, hideLoader }),
    [showError, showSuccess, hideError, showLoader, hideLoader]
  );

  return (
    <UIContext.Provider value={value}>
      {children}

      {/* Global Loader Modal */}
      <Modal
        visible={loaderVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <View style={styles.loaderCard}>
            <OuroborosLoader size={140} />
            {loaderMessage ? (
              <Text style={styles.loaderText}>{loaderMessage}</Text>
            ) : null}
          </View>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => {}} />
        </View>
      </Modal>

      {/* Global Error Popup Modal */}
      <Modal
        visible={errorVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={hideError}
      >
        <View style={styles.overlay}>
          <ErrorPopup
            title={errorTitle}
            message={errorMessage}
            onClose={hideError}
            variant={errorVariant}
          />
        </View>
      </Modal>
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within a UIProvider');
  return ctx;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: 260,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  loaderText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
  },
});


