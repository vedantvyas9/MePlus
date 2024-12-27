import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Replace with your own web client ID from Google Cloud Console
const WEB_CLIENT_ID = 'YOUR_WEB_CLIENT_ID_HERE';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    offlineAccess: true,
  });
};

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    return userInfo;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

export const signOutFromGoogle = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.error('Google Sign-Out Error:', error);
    throw error;
  }
};
