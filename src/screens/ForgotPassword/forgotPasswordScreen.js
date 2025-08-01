import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styles from './forgotPasswordStyles';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

// Eğer Firebase kullanıyorsan:
import { sendPasswordResetEmail } from "@react-native-firebase/auth";
import auth from '@react-native-firebase/auth';
const { t } = useTranslation();
const ForgotSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email(t("entervalidmail"))
    .required(t("emailrequred")),
});

const ForgotPasswordScreen = ({ navigation }) => {


  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    Keyboard.dismiss();
    try {
      await sendPasswordResetEmail(auth, values.email);
      Alert.alert(
        t("SendComplated"),
        t("ResetPasswordSendCheckMail")
      );
      resetForm();
    } catch (err) {
      // Hataları kullanıcıya daha okunabilir yap
      let message = 'Bir hata oluştu.';
      if (err.code === 'auth/user-not-found') {
        message = 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Geçersiz e-posta formatı.';
      }
      Alert.alert('Hata', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={['#090979', '#00D4FF', '#020024']} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <LottieView
            source={require('../assets/forgot-password.json')} // uygun Lottie animasyonu
            autoPlay
            loop
            style={styles.lottie}
          />

          <Text style={styles.title}>{t("forgotPassword")}</Text>
          <Text style={styles.subtitle}>
            {t("WriteYourMailForResetPassword")}
          </Text>

          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <>
                <TextInput
                  style={styles.input}
                  placeholder={t("email")}
                  placeholderTextColor="#aaa"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  <Text style={styles.buttonText}>
                    {isSubmitting ? t("Waiting") : t("ResetPasswordEmailSent")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation?.goBack()}
                  style={styles.linkRow}
                >
                  <Text style={styles.linkText}>{t("BackToLoginScreen")}</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ForgotPasswordScreen;
