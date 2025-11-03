import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { API_URI } from '../../constants/config';
import { AppTheme } from '../../constants/theme';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_URI}/notifications`);
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Failed to fetch notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`${API_URI}/notifications/${id}/read`, {
        method: 'PATCH',
      });
      fetchNotifications(); // Refresh list
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${API_URI}/notifications/read-all`, {
        method: 'PATCH',
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
      onPress={() => !item.isRead && markAsRead(item._id)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.timeText}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      
      <Text style={styles.messageText}>{item.message}</Text>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>👥 People: {item.peopleCount}</Text>
        <Text style={styles.statText}>
          🔌 Fan: {item.fanStatus ? 'ON' : 'OFF'}
        </Text>
      </View>

      {item.snapshot && (
        <Image
          source={{ uri: item.snapshot }}
          style={styles.snapshot}
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
            <Text style={styles.markAllText}>Mark All Read</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppTheme.colors.primary} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.placeholder}>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={AppTheme.colors.primary}
            />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: AppTheme.colors.backgroundLight,
    borderBottomWidth: 2,
    borderBottomColor: AppTheme.colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.primary,
  },
  markAllButton: {
    backgroundColor: AppTheme.colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: AppTheme.borderRadius.sm,
  },
  markAllText: {
    color: AppTheme.colors.textWhite,
    fontSize: 12,
    fontWeight: AppTheme.fontWeight.bold,
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: AppTheme.colors.backgroundCard,
    borderRadius: AppTheme.borderRadius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: AppTheme.colors.border,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: AppTheme.colors.primary,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.primary,
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppTheme.colors.primary,
  },
  timeText: {
    fontSize: 12,
    color: AppTheme.colors.textSecondary,
  },
  messageText: {
    fontSize: 16,
    color: AppTheme.colors.textPrimary,
    marginBottom: 12,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statText: {
    fontSize: 14,
    color: AppTheme.colors.textSecondary,
  },
  snapshot: {
    width: '100%',
    height: 200,
    borderRadius: AppTheme.borderRadius.md,
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: AppTheme.colors.textSecondary,
    fontWeight: AppTheme.fontWeight.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 16,
    color: AppTheme.colors.textLight,
    textAlign: 'center',
  },
});

