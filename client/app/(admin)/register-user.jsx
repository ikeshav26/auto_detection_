import { View, Text, StyleSheet } from 'react-native';

export default function RegisterUserScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register New User</Text>
      <Text style={styles.subtitle}>Only admins can register new users</Text>
      
      {/* User registration form will be added here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
});
