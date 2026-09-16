import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('/api/health');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState('Aquí verás la respuesta del servidor.');
  const [status, setStatus] = useState('Esperando petición...');
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://192.168.1.10:3000';

  const quickActions = [
    { label: 'Ver usuarios', method: 'GET', endpoint: '/api/users', body: '' },
    { label: 'Crear profesor', method: 'POST', endpoint: '/api/users', body: '{"name":"Profesor","email":"profesor@test.com","password":"1234","role":"PROFESSOR"}' },
    { label: 'Crear alumno', method: 'POST', endpoint: '/api/users', body: '{"name":"Ana","email":"ana@test.com","password":"1234","role":"STUDENT"}' },
    { label: 'Ver materias', method: 'GET', endpoint: '/api/subjects', body: '' },
    { label: 'Crear materia', method: 'POST', endpoint: '/api/subjects', body: '{"name":"Matemáticas","description":"Clase de matemáticas","professor_id":2}' },
    { label: 'Ver inscripciones', method: 'GET', endpoint: '/api/enrollments', body: '' },
    { label: 'Crear inscripción', method: 'POST', endpoint: '/api/enrollments', body: '{"student_id":2,"subject_id":1,"grade":10}' }
  ];

  const sendLogin = async () => {
    if (!email || !password) {
      Alert.alert('Completa email y contraseña');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Login error', data.message || 'Error de login');
        setToken('');
        return;
      }

      setToken(data.token || '');
      Alert.alert('Login exitoso');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async () => {
    if (!endpoint.trim()) {
      setStatus('Error');
      setResponse('Introduce la ruta del endpoint.');
      return;
    }

    const normalizedEndpoint = endpoint.trim().startsWith('/')
      ? endpoint.trim()
      : `/${endpoint.trim()}`;

    setLoading(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const options = { method, headers };
      if (body && method !== 'GET') {
        options.body = body;
      }

      const res = await fetch(`${API_URL}${normalizedEndpoint}`, options);
      const text = await res.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }

      setStatus(`${res.status} ${res.statusText}`);
      setResponse(typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2));
    } catch (err) {
      setStatus('Error');
      setResponse(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Academic API Console</Text>
          <Text style={styles.subtitle}>Expo Go · Express Backend</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Login</Text>
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
          <View style={styles.rowButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={sendLogin}><Text style={styles.buttonText}>Iniciar sesión</Text></TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={() => { setToken(''); setEmail(''); setPassword(''); }}><Text style={styles.buttonText}>Cerrar sesión</Text></TouchableOpacity>
          </View>
          <Text style={styles.tokenText}>{token ? 'Token guardado' : 'Token no disponible'}</Text>
          <TextInput style={styles.tokenArea} value={token} editable={false} multiline />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Acciones rápidas</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.actionButton} onPress={() => { setMethod(item.method); setEndpoint(item.endpoint); setBody(item.body); }}>
                <Text style={styles.actionTitle}>{item.label}</Text>
                <Text style={styles.actionMeta}>{item.method} {item.endpoint}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Petición HTTP</Text>
          <View style={styles.formRow}>
            <View style={styles.methodBox}><Text style={styles.label}>Método</Text><TextInput style={styles.input} value={method} onChangeText={setMethod} /></View>
            <View style={styles.endpointBox}><Text style={styles.label}>Endpoint</Text><TextInput style={styles.input} value={endpoint} onChangeText={setEndpoint} /></View>
          </View>
          <Text style={styles.label}>Body JSON</Text>
          <TextInput style={styles.bodyInput} value={body} onChangeText={setBody} multiline placeholder='{"name":"Ejemplo"}' />
          <View style={styles.rowButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={sendRequest}><Text style={styles.buttonText}>Enviar petición</Text></TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => { setMethod('GET'); setEndpoint('/api/health'); setBody(''); setResponse('Aquí verás la respuesta del servidor.'); setStatus('Esperando petición...'); }}><Text style={styles.buttonText}>Limpiar</Text></TouchableOpacity>
          </View>
          <View style={styles.responseArea}><Text style={styles.statusText}>{status}</Text><Text style={styles.responseText}>{response}</Text></View>
          {loading && <ActivityIndicator size="large" color="#7dd3fc" style={{ marginTop: 12 }} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#07111f' },
  container: { padding: 16, gap: 16 },
  header: { paddingVertical: 10, borderBottomColor: 'rgba(255,255,255,0.12)', borderBottomWidth: 1 },
  title: { color: '#edf7ff', fontSize: 30, fontWeight: '800' },
  subtitle: { color: '#aebbd0', fontSize: 14, marginTop: 4 },
  card: { backgroundColor: '#111a2e', borderColor: 'rgba(230,245,255,0.12)', borderWidth: 1, borderRadius: 18, padding: 16 },
  cardTitle: { color: '#edf7ff', fontSize: 20, fontWeight: '700', marginBottom: 12 },
  label: { color: '#aebbd0', fontSize: 12, marginBottom: 7 },
  input: { backgroundColor: '#17213d', color: '#edf7ff', borderColor: 'rgba(230,245,255,0.12)', borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 12 },
  tokenArea: { backgroundColor: '#020617', color: '#dbeafe', borderColor: 'rgba(230,245,255,0.12)', borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 12, minHeight: 90, textAlignVertical: 'top' },
  rowButtons: { flexDirection: 'row', gap: 10, marginTop: 8 },
  primaryButton: { flex: 1, backgroundColor: '#7dd3fc', paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  secondaryButton: { flex: 1, backgroundColor: '#202b4f', paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  logoutButton: { flex: 1, backgroundColor: '#fb7185', paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  buttonText: { color: '#07111f', fontWeight: '800' },
  tokenText: { color: '#aebbd0', fontSize: 12, marginTop: 8 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionButton: { width: '48%', backgroundColor: '#17213d', borderColor: 'rgba(230,245,255,0.12)', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 10 },
  actionTitle: { color: '#edf7ff', fontSize: 13, fontWeight: '700' },
  actionMeta: { color: '#8ca0bd', fontSize: 11, marginTop: 4 },
  formRow: { flexDirection: 'row', gap: 12 },
  methodBox: { flex: 0.35 },
  endpointBox: { flex: 1 },
  bodyInput: { minHeight: 110, backgroundColor: '#17213d', color: '#edf7ff', borderColor: 'rgba(230,245,255,0.12)', borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14, textAlignVertical: 'top', marginBottom: 12 },
  responseArea: { marginTop: 16, backgroundColor: '#020617', borderRadius: 12, padding: 12, minHeight: 180 },
  statusText: { color: '#4ade80', fontWeight: '700', fontSize: 12 },
  responseText: { color: '#dbeafe', fontFamily: 'monospace', fontSize: 12, marginTop: 8 },
});
