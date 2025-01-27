import { createContext, useEffect, useState } from "react";
import { app } from "./../Firebase/firebase.config";
import {
    createUserWithEmailAndPassword,
    FacebookAuthProvider,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
  } from "firebase/auth";
  import { GoogleAuthProvider } from "firebase/auth";
import useAxiosPublic from './../hooks/useAxiosPublic';

export const AuthContext = createContext(null);
const auth = getAuth(app);
const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const axiosPublic = useAxiosPublic();

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const signInWithFacebook = () => {
    setLoading(true);
    return signInWithPopup(auth, facebookProvider);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        const userInfo = { email: currentUser.email };
        try {
          const data = await axiosPublic.post('/jwt', userInfo);
          localStorage.setItem('access-token', data.data.token);
        } catch (err) {
          console.error('JWT generation failed:', err);
          localStorage.removeItem('access-token');
        }
      } else {
        localStorage.removeItem('access-token');
      }
      setUser(currentUser);
      setLoading(false);
    });
  
    return unsubscribe;
  }, []);
  

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    logOut,
    updateUserProfile,
    signInWithGoogle,
    signInWithFacebook
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  )
};

export default AuthProvider;
