import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import { API_URI } from "../../constants/config";
import { useAuth } from "../../context/AuthContext";


export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passKey, setPassKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth();

  const handleSignup = async() => {
    if (!username || !email || !password || !passKey) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const formData = {
        username,
        email,
        password,
        key: passKey
      };
      
      const res = await axios.post(`${API_URI}/user/signup`, formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Signup successful:', res.data);
      
      // Save user data and navigate
      if (res.data.user) {
        await login(res.data.user);
        Alert.alert('Success', 'Account created successfully!');
        
        // Navigate based on role
        if (res.data.user.role === 'admin') {
          router.replace('/(admin)/home');
        } else {
          router.replace('/(user)/home');
        }
      }
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Create your account</Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
        editable={!isLoading}
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
      <TextInput
        style={styles.input}
        placeholder="Pass Key"
        placeholderTextColor="#888"
        secureTextEntry
        value={passKey}
        onChangeText={setPassKey}
        editable={!isLoading}
      />

      {/* Signup Button */}
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleSignup}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Text>
      </TouchableOpacity>

      {/* Already have an account? */}
      <View style={styles.linkContainer}>
        <Text style={styles.linkTextLight}>Already have an account?</Text>
        <Link href="/(auth)/login" style={styles.link}>
          <Text style={styles.linkText}>Login</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#f9fafc",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#2563eb",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 28,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  linkTextLight: {
    color: "#6b7280",
    fontSize: 15,
  },
  link: {
    marginLeft: 5,
  },
  linkText: {
    color: "#2563eb",
    fontWeight: "600",
    fontSize: 15,
  },
});
