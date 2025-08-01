import React, { useState,useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';

import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../../navigation/AppNavigator'; // Adjust the import path as necessary
import LottieView from 'lottie-react-native';
import styles from './loginStyles'; // Adjust the import path as necessary

import i18n from '../../i18n'; // i18n yapılandırması import edilmeli
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../companent/ErrorMessage';
import auth from '@react-native-firebase/auth';

const availableLanguages = [
  { label: 'Türkçe', value: 'tr', flag: '🇹🇷' },
  { label: 'English', value: 'en', flag: '🇺🇸' },
  // istediğin kadar ekle: { label: 'Français', value: 'fr', flag: '🇫🇷' }
];

const LANGUAGE_KEY = 'appLanguage';
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const { setUserToken } = useContext(AuthContext);
  const [loginError, setLoginError] = useState(null);
  const togglePasswordVisibility = () => setSecure(!secure);

  const handleLogin = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        const uid = userCredential.user.uid;
        setUserToken(uid); // AppNavigator'da kullanıcıyı login etmiş sayıyoruz
      })
      .catch(error => {
        setLoginError(t(error.code));// örnek: Şifre hatalıysa gösterilir
      });
  };
  const changeLanguage = async (lng) => {
    setLang(lng);
    await setStoredLanguage(lng);
    // Eğer RTL bir dil eklersen buraya I18nManager ayarı eklenir
  };


  useEffect(() => {
    // stored dili yükle (fallback zaten i18n içinde yapılmış)
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (stored) {
          setLang(stored);
        }
      } catch { }
    };
    load();
  }, []);

  return (
    <LinearGradient colors={['#090979', '#00D4FF', '#020024']} style={styles.container}>

      <SafeAreaView style={styles.container}>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={lang}
            onValueChange={(value) => changeLanguage(value)}
            mode="dropdown"
            style={styles.picker}
            dropdownIconColor="#fff"
          >
            {availableLanguages.map((l) => (
              <Picker.Item
                key={l.value}
                label={`${l.flag} ${l.label}`}
                value={l.value}
              />
            ))}
          </Picker>
        </View>


        <View style={styles.card}>
          <LottieView
            source={require('../assets/Login_icon.json')}
            autoPlay
            loop
            style={styles.lottie}
          />

          <Text style={styles.title}>{t("welcome")}</Text>

          <TextInput
            style={styles.input}
            placeholder={t("email")}
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder={t("password")}
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secure}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <FontAwesome6 name={secure ? 'eye-slash' : 'eye'} size={22} color="#555" />

            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>{t("login")}</Text>
          </TouchableOpacity>
          <ErrorMessage message={loginError} />
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerText}>
              {t("DontYouHaveAccount")} <Text style={styles.link}>{t("register")}</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.footerText}>
              {t("DidyouForgotPassword")} <Text style={styles.link}>{t("forgotPassword")}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>

  );
};

export default LoginScreen;
