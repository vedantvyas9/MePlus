import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login logic here
    navigation.navigate('Main');
  };

  const handleGoogleLogin = async () => {
    try {
      const userInfo = await signInWithGoogle();
      if (userInfo) {
        navigation.navigate('Main');
      }
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleAppleLogin = () => {
    // Handle Apple login logic here
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcomeMessage}>Welcome Back</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Login to your account</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.cardSubtitle}>Don't have an account? Sign up</Text>
          </TouchableOpacity>

          <View style={styles.socialLogin}>
            <TouchableOpacity 
              style={styles.socialButton} 
              onPress={() => console.log('Google login pressed')}
            >
              <Text style={styles.socialButtonText}>Sign in with Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.socialButton} 
              onPress={() => console.log('Apple login pressed')}
            >
              <Text style={styles.socialButtonText}>Sign in with Apple</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    // Handle signup logic here
    navigation.navigate('Main');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcomeMessage}>Create an Account</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign up to get started</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
            <Text style={styles.loginButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.cardSubtitle}>Already have an account? Log in</Text>
          </TouchableOpacity>

          <View style={styles.socialLogin}>
            <TouchableOpacity 
              style={styles.socialButton} 
              onPress={() => console.log('Google signup pressed')}
            >
              <Text style={styles.socialButtonText}>Sign up with Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.socialButton} 
              onPress={() => console.log('Apple signup pressed')}
            >
              <Text style={styles.socialButtonText}>Sign up with Apple</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  welcomeMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  card: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#1E3A8A',
  },
  loginButton: {
    backgroundColor: '#0D9488',
    paddingVertical: 12,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  socialLogin: {
    width: '100%',
    marginTop: 16,
  },
  socialButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  socialButtonText: {
    color: '#1E3A8A',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export { LoginScreen, SignupScreen };
