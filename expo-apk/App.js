import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  BackHandler,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';

// ============================================================================
// STANDALONE OFFLINE BUNDLE: Loaded directly from local Android APK assets
// ============================================================================
export const LOCAL_URI = __DEV__
  ? 'http://192.168.1.41:3000'
  : 'file:///android_asset/web/index.html';

function MainApp() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  // Dynamic status bar safe inset: ensures the top section (headers, titles) is 100% visible
  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 0
  );

  // Auto-dismiss loading overlay after 2.5s maximum so user is never stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Handle Android Hardware Back Button navigation
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [canGoBack]);

  const handleReload = () => {
    setHasError(false);
    setIsLoading(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" translucent={false} />

      {hasError ? (
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>nivvo</Text>
            </View>
            <Text style={styles.errorTitle}>Error Loading Local Store</Text>
            <Text style={styles.errorSubtitle}>
              Unable to initialize local app assets. Please tap retry.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleReload}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <WebView
            ref={webViewRef}
            source={{ uri: LOCAL_URI }}
            style={styles.webview}
            originWhitelist={['*']}
            allowFileAccess={true}
            allowFileAccessFromFileURLs={true}
            allowUniversalAccessFromFileURLs={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            mixedContentMode="always"
            cacheEnabled={true}
            injectedJavaScriptBeforeContentLoaded="window.__IS_MOBILE_APP__ = true; true;"
            allowsBackForwardNavigationGestures={true}
            onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
            onLoadStart={() => {}}
            onLoadEnd={() => setIsLoading(false)}
            onMessage={(event) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                if (data.type === 'APP_MOUNTED') setIsLoading(false);
              } catch(e) {}
            }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('[WebView Error]:', nativeEvent);
              setHasError(true);
            }}
          />

          {isLoading && (
            <View style={styles.loadingOverlay}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoText}>nivvo</Text>
              </View>
              <ActivityIndicator size="large" color="#24452D" style={{ marginTop: 16 }} />
              <Text style={styles.loadingText}>Loading 10-Minute Store...</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webview: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  logoBadge: {
    backgroundColor: '#24452D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  logoText: {
    color: '#B7F34A',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '700',
    color: '#24452D',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#F7F8F5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: '#E7EAE3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#24452D',
    marginTop: 16,
    marginBottom: 6,
  },
  errorSubtitle: {
    fontSize: 12.5,
    color: '#73796F',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#B7F34A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#24452D',
    fontWeight: '800',
    fontSize: 14,
  },
});
