import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { AppTheme } from '../../constants/theme';
import axios from 'axios';
import { API_URI } from '../../constants/config';

export default function UserHomeScreen() {
  const { user, logout, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    if (!authLoading && token) {
      fetchNotificationStats();
    } else if (!authLoading) {
      setLoading(false);
    }

    return () => clearInterval(timer);
  }, [authLoading, token]);

  const fetchNotificationStats = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const [totalRes, unreadRes] = await Promise.all([
        axios.get(`${API_URI}/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true
        }),
        axios.get(`${API_URI}/notifications/unread`, {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true
        })
      ]);

      setTotalNotifications(totalRes.data.notifications?.length || 0);
      setUnreadNotifications(unreadRes.data.notifications?.length || 0);
    } catch (error) {
      console.error('Error fetching notification stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotificationStats();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      {/* Header with Greeting */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}!</Text>
          <Text style={styles.username}>{user?.username || 'User'}</Text>
        </View>
      </View>
      
      {/* User Profile Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>👤</Text>
          <Text style={styles.cardTitle}>Your Profile</Text>
        </View>
        <View style={styles.profileSection}>
          <View style={styles.largeAvatar}>
            <Text style={styles.largeAvatarText}>{getInitials(user?.username)}</Text>
          </View>
          <View style={styles.profileInfo}>
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
                <Text style={styles.roleBadgeText}>{user?.role?.toUpperCase() || 'STAFF'}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📬</Text>
          <Text style={styles.statValue}>{totalNotifications}</Text>
          <Text style={styles.statLabel}>Total Alerts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔔</Text>
          <Text style={styles.statValue}>{unreadNotifications}</Text>
          <Text style={styles.statLabel}>Unread</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(user)/notifications')}
        >
          <Text style={styles.actionIcon}>🔔</Text>
          <Text style={styles.actionText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onRefresh}
        >
          <Text style={styles.actionIcon}>🔄</Text>
          <Text style={styles.actionText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>About This System</Text>
          <Text style={styles.infoText}>
            This classroom monitoring system uses AI to track occupancy and automatically manage fan control for energy efficiency.
          </Text>
        </View>
      </View>

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
    padding: AppTheme.spacing.lg,
    paddingTop: AppTheme.spacing.xl,
  },
  greeting: {
    fontSize: 16,
    color: AppTheme.colors.textSecondary,
    marginBottom: 4,
  },
  username: {
    fontSize: 28,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.primary,
  },
  timeCard: {
    backgroundColor: AppTheme.colors.backgroundCard,
    marginHorizontal: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.lg,
    padding: AppTheme.spacing.lg,
    borderRadius: AppTheme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AppTheme.colors.primary,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  clockIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  time: {
    fontSize: 36,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.primary,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: AppTheme.colors.textSecondary,
  },
  card: {
    backgroundColor: AppTheme.colors.backgroundLight,
    marginHorizontal: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.lg,
    padding: AppTheme.spacing.lg,
    borderRadius: AppTheme.borderRadius.lg,
    borderWidth: 1,
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
  profileSection: {
    alignItems: 'center',
  },
  largeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
    borderWidth: 3,
    borderColor: AppTheme.colors.secondary,
  },
  largeAvatarText: {
    color: AppTheme.colors.textWhite,
    fontSize: 36,
    fontWeight: AppTheme.fontWeight.bold,
  },
  profileInfo: {
    width: '100%',
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
    backgroundColor: AppTheme.colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: AppTheme.borderRadius.full,
  },
  roleBadgeText: {
    color: AppTheme.colors.textWhite,
    fontSize: 12,
    fontWeight: AppTheme.fontWeight.bold,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: AppTheme.colors.backgroundCard,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.borderRadius.md,
    alignItems: 'center',
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: AppTheme.colors.border,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
  },
  sectionHeader: {
    paddingHorizontal: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.textPrimary,
  },
  actionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.lg,
  },
  actionButton: {
    flex: 1,
    backgroundColor: AppTheme.colors.backgroundLight,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.borderRadius.md,
    alignItems: 'center',
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.textPrimary,
  },
  infoCard: {
    backgroundColor: AppTheme.colors.backgroundCard,
    marginHorizontal: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.lg,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.borderRadius.md,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: AppTheme.spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.textPrimary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: AppTheme.colors.textSecondary,
    lineHeight: 18,
  },
  logoutButton: {
    backgroundColor: AppTheme.colors.danger,
    marginHorizontal: AppTheme.spacing.lg,
    marginTop: AppTheme.spacing.md,
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
