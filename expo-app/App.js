import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  // ️ IMPORTANTE: Debe ser HTTPS, no HTTP
  const miUrl = 'https://backtren22.vercel.app';

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: miUrl }} 
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
