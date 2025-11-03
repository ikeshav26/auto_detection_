import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import { API_URI } from "../../constants/config";
import { useAuth } from "../../context/AuthContext";
import { AppTheme } from "../../constants/theme";

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
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo/Icon Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🏫</Text>
          </View>
          <Text style={styles.appName}>Classroom Monitor</Text>
          <Text style={styles.appTagline}>Smart Fan Management System</Text>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>📧 Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={AppTheme.colors.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>🔒 Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={AppTheme.colors.textLight}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Signup Link */}
          <View style={styles.linkContainer}>
            <Text style={styles.linkTextLight}>Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Create Account</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: AppTheme.colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: AppTheme.colors.primary,
  },
  logoIcon: {
    fontSize: 50,
  },
  appName: {
    fontSize: 28,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.primary,
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: AppTheme.colors.textSecondary,
    fontWeight: AppTheme.fontWeight.medium,
  },
  welcomeContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: AppTheme.colors.textSecondary,
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    backgroundColor: AppTheme.colors.backgroundLight,
    borderColor: AppTheme.colors.border,
    borderWidth: 2,
    borderRadius: AppTheme.borderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: AppTheme.colors.textPrimary,
    shadowColor: AppTheme.colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: AppTheme.colors.primary,
    paddingVertical: 16,
    borderRadius: AppTheme.borderRadius.md,
    alignItems: "center",
    marginTop: 10,
    shadowColor: AppTheme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: AppTheme.colors.primaryLight,
    opacity: 0.7,
  },
  buttonText: {
    color: AppTheme.colors.textWhite,
    fontSize: 18,
    fontWeight: AppTheme.fontWeight.bold,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    alignItems: "center",
  },
  linkTextLight: {
    color: AppTheme.colors.textSecondary,
    fontSize: 15,
  },
  linkText: {
    color: AppTheme.colors.primary,
    fontWeight: AppTheme.fontWeight.bold,
    fontSize: 15,
  },
});
