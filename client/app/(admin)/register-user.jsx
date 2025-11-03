import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { API_URI } from '../../constants/config';
import { useAuth } from '../../context/AuthContext';

export default function RegisterUserScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { token } = useAuth();
console.log(token)
  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (!token) {
      Alert.alert('Error', 'Authentication token not found. Please login again.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = {
        username,
        email,
        password,
      };

      const res = await axios.post(`${API_URI}/admin/create/user`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('User registered successfully:', res.data);
      Alert.alert('Success', `User ${username} registered successfully!`);
      
      // Clear form
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to register user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Register New User</Text>
      <Text style={styles.subtitle}>Only admins can register new users</Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
        editable={!isLoading}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
      />

      {/* Register Button */}
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Registering...' : 'Register User'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0a7ea4',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#7dd3fc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
