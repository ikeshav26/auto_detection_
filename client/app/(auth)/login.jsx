import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import { API_URI } from "../../constants/config";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { login ,settoken} = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const formData = {
        email,
        password
      };
      
      const res = await axios.post(`${API_URI}/user/login`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },withCredentials:true
      });
      
      console.log('Login successful:', res.data);
      
      // Save user data and navigate
      if (res.data.user) {
        await login(res.data.user);
        await settoken(res.data.token);
        Alert.alert('Success', 'Logged in successfully!');
        
        // Navigate based on role
        if (res.data.user.role === 'admin') {
          router.replace('/(admin)/home');
        } else {
          router.replace('/(user)/home');
        }
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Welcome back! Please log in.</Text>

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

      {/* Login Button */}
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      {/* Don't have an account? */}
            {/* Don't have an account? */}
      <View style={styles.linkContainer}>
        <Text style={styles.linkTextLight}>Don't have an account?</Text>
        <Link href="/(auth)/signup" style={styles.link}>
          <Text style={styles.linkText}>Sign up</Text>
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
    backgroundColor: "#ffffff",
    paddingLeft: 45,
    paddingRight: 45,
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FF6B00", // Changed to orange
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: 'rgba(255, 107, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 28,
  },
  input: {
    width: "100%",
    backgroundColor: "#FFF8F3", // Light orange tint
    borderColor: "#FFD2B3", // Light orange border
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333333",
    marginBottom: 14,
    shadowColor: "#FF8534",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    backgroundColor: "#FF6B00", // Main orange
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
    shadowColor: "#FF6B00",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#FFB38A", // Light orange for disabled state
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  linkTextLight: {
    color: "#666666",
    fontSize: 15,
  },
  link: {
    marginLeft: 5,
  },
  linkText: {
    color: "#FF6B00", // Orange for link
    fontWeight: "600",
    fontSize: 15,
  },
});
