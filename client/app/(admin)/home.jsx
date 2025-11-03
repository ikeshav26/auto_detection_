import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { AppTheme } from '../../constants/theme';
import axios from 'axios';
import { API_URI } from '../../constants/config';

export default function AdminHomeScreen() {
  const { user, logout, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [staffMembers, setStaffMembers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && token) {
      fetchStaffs();
    } else if (!authLoading && !token) {
      console.log('No token available, cannot fetch staffs');
      setLoading(false);
    }
  }, [authLoading, token]);

  const fetchStaffs = async () => {
    if (!token) {
      console.log('No token available');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching staffs with token:', token ? 'Token exists' : 'No token');
      console.log('API URL:', `${API_URI}/admin/get/staffs`);
      
      const response = await axios.get(`${API_URI}/admin/get/staffs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      
      console.log('Staff response:', response.data);
      setStaffMembers(response.data.staff || []);
    } catch (error) {
      console.error('Error fetching staffs:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again');
        await logout();
        router.replace('/(auth)/login');
      } else {
        Alert.alert('Error', error.response?.data?.message || 'Failed to fetch staff members');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStaffs();
    setRefreshing(false);
  };

  const handleTerminateAccount = async (userId, username) => {
    Alert.alert(
      'Confirm Termination',
      `Are you sure you want to terminate ${username}'s account? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Terminate',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_URI}/admin/terminate/user/${userId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                withCredentials: true
              });
              Alert.alert('Success', 'Account terminated successfully');
              fetchStaffs();
            } catch (error) {
              console.error('Error terminating account:', error);
              Alert.alert('Error', 'Failed to terminate account');
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  // Show loading spinner while auth is loading or fetching data
  if (authLoading || loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={AppTheme.colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={AppTheme.colors.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back, Admin!</Text>
        </View>
      </View>

      {/* Admin Credentials Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>👤</Text>
          <Text style={styles.cardTitle}>Your Credentials</Text>
        </View>
        <View style={styles.credentialRow}>
          <Text style={styles.credentialLabel}>Username:</Text>
          <Text style={styles.credentialValue}>{user?.username || 'N/A'}</Text>
        </View>
        <View style={styles.credentialRow}>
          <Text style={styles.credentialLabel}>Email:</Text>
          <Text style={styles.credentialValue}>{user?.email || 'N/A'}</Text>
        </View>
        <View style={styles.credentialRow}>
          <Text style={styles.credentialLabel}>Role:</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{user?.role?.toUpperCase() || 'ADMIN'}</Text>
          </View>
        </View>
      </View>

      
      {staffMembers.length > 0 ? (
        staffMembers.map((staff, index) => (
          <View key={staff._id || index} style={styles.staffCard}>
            <View style={styles.staffInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(staff.username)}</Text>
              </View>
              <View style={styles.staffDetails}>
                <Text style={styles.staffName}>{staff.username}</Text>
                <Text style={styles.staffEmail}>{staff.email}</Text>
                <Text style={styles.staffRole}>Role: {staff.role}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.terminateButton}
              onPress={() => handleTerminateAccount(staff._id, staff.username)}
            >
              <Text style={styles.terminateButtonText}>Terminate</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>No staff members found</Text>
          <Text style={styles.emptySubtext}>Add your first staff member to get started</Text>
        </View>
      )}

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: AppTheme.colors.textSecondary,
    fontWeight: AppTheme.fontWeight.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: AppTheme.spacing.lg,
    paddingTop: AppTheme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: AppTheme.colors.textSecondary,
  },
  card: {
    backgroundColor: AppTheme.colors.backgroundCard,
    marginHorizontal: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.lg,
    padding: AppTheme.spacing.lg,
    borderRadius: AppTheme.borderRadius.lg,
    borderWidth: 2,
    borderColor: AppTheme.colors.border,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: AppTheme.spacing.sm,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.textPrimary,
  },
  credentialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: AppTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  credentialLabel: {
    fontSize: 14,
    color: AppTheme.colors.textSecondary,
    fontWeight: AppTheme.fontWeight.medium,
  },
  credentialValue: {
    fontSize: 14,
    color: AppTheme.colors.textPrimary,
    fontWeight: AppTheme.fontWeight.semibold,
  },
  roleBadge: {
    backgroundColor: AppTheme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: AppTheme.borderRadius.full,
  },
  roleBadgeText: {
    color: AppTheme.colors.textWhite,
    fontSize: 12,
    fontWeight: AppTheme.fontWeight.bold,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.textPrimary,
  },
  addButton: {
    backgroundColor: AppTheme.colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: AppTheme.borderRadius.md,
    shadowColor: AppTheme.colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: AppTheme.colors.textWhite,
    fontSize: 14,
    fontWeight: AppTheme.fontWeight.bold,
  },
  staffCard: {
    backgroundColor: AppTheme.colors.backgroundLight,
    marginHorizontal: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.md,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  staffInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme.spacing.md,
  },
  avatarText: {
    color: AppTheme.colors.textWhite,
    fontSize: 20,
    fontWeight: AppTheme.fontWeight.bold,
  },
  staffDetails: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.textPrimary,
    marginBottom: 2,
  },
  staffEmail: {
    fontSize: 13,
    color: AppTheme.colors.textSecondary,
    marginBottom: 2,
  },
  staffRole: {
    fontSize: 12,
    color: AppTheme.colors.textLight,
  },
  terminateButton: {
    backgroundColor: AppTheme.colors.danger,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: AppTheme.borderRadius.sm,
  },
  terminateButtonText: {
    color: AppTheme.colors.textWhite,
    fontSize: 13,
    fontWeight: AppTheme.fontWeight.bold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: AppTheme.spacing.lg,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: AppTheme.spacing.md,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: AppTheme.colors.danger,
    marginHorizontal: AppTheme.spacing.lg,
    marginTop: AppTheme.spacing.lg,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: AppTheme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AppTheme.colors.danger,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  logoutText: {
    color: AppTheme.colors.textWhite,
    fontSize: 16,
    fontWeight: AppTheme.fontWeight.bold,
  },
});
