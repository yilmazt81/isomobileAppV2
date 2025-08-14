import React, { useState } from 'react';

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
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { Formik } from 'formik';
import * as Yup from 'yup';
import styles from './signupStyles';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { t } from 'i18next';

const SignupSchema = Yup.object().shape({
    name: Yup.string().trim().required(t("nameandSurnamerequred")),
    email: Yup.string()
        .trim()
        .email(t("entervalidmail"))
        .required(t("emailrequred")),
    password: Yup.string()
        .min(4, t("passwordMustBeAtLeast4Characters"))
        .required(t("passwordRequired")),
    confirm: Yup.string()
        .oneOf([Yup.ref('password')], t("passwordsMustMatch"))
        .required(t("confirmPasswordRequired")),
});


const SignupScreen = ({ navigation }) => { 
    const [secure, setSecure] = useState(true);
    const [secureConfirm, setSecureConfirm] = useState(true);

    const togglePasswordVisibility = () => setSecure(!secure);
    const toggleConfirmVisibility = () => setSecureConfirm(!secureConfirm);

    const handleSignup = async (values, { setSubmitting }) => {
        try {
            // Burada Firebase / API çağrısı yap
            // örnek: await signUpWithEmail(values.email, values.password);


            const userCredential = await auth().createUserWithEmailAndPassword(values.email, values.password);
            const uid = userCredential.user.uid;

            // Firestore'a kullanıcı bilgilerini kaydet
            await firestore().collection('users').doc(uid).set({
                fullName: values.name,
                phone: values.phone,
                email: values.email,
                userid: uid,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });

            Alert.alert('Başarılı', `Hoş geldin, ${values.name}`);
        } catch (e) {
            Alert.alert('Hata', e.message || 'Kayıt olurken bir sorun oluştu');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <LinearGradient colors={['#3a6ff8', '#6fb1fc']} style={styles.gradient}>
            <SafeAreaView style={styles.container}>
                <View style={styles.card}>
                    <LottieView
                        source={require('../assets/login_register.json')}
                        autoPlay
                        loop
                        style={styles.lottie}
                    />

                    <Text style={styles.title}>{t("register")}</Text>
                    <Formik
                        initialValues={{ name: '', email: '', password: '', confirm: '' ,phone: ''}}
                        validationSchema={SignupSchema}
                        onSubmit={handleSignup}
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
                                    placeholder={t("nameandSurname")}
                                    placeholderTextColor="#aaa"
                                    value={values.name}
                                    onBlur={handleBlur('name')}
                                    onChangeText={handleChange('name')}

                                    autoCapitalize="words"
                                />
                                {touched.name && errors.name && (
                                    <Text style={styles.errorText}>{errors.name}</Text>
                                )}

                                
                                <TextInput
                                    style={styles.input}
                                    placeholder={t("Phone")}
                                    placeholderTextColor="#aaa"

                                    value={values.phone}
                                    onChangeText={handleChange('phone')}
                                 
                                    autoCapitalize="none"
                                    onBlur={handleBlur('phone')}
                                />
                                {touched.email && errors.email && (
                                    <Text style={styles.errorText}>{errors.phone}</Text>
                                )}

                                <TextInput
                                    style={styles.input}
                                    placeholder={t("email")}
                                    placeholderTextColor="#aaa"

                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    onBlur={handleBlur('email')}
                                />
                                {touched.email && errors.email && (
                                    <Text style={styles.errorText}>{errors.email}</Text>
                                )}

                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder={t("password")}
                                        placeholderTextColor="#aaa"
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        secureTextEntry={secure}
                                    />
                                    <TouchableOpacity onPress={togglePasswordVisibility}>
                                        <FontAwesome6 name={secure ? 'eye-slash' : 'eye'} size={22} color="#555" />

                                    </TouchableOpacity>
                                </View>
                                {touched.password && errors.password && (
                                    <Text style={styles.errorText}>{errors.password}</Text>
                                )}
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder=  {t("confirmPassword")}
                                        placeholderTextColor="#aaa"
                                        value={values.confirm}
                                        onChangeText={handleChange('confirm')}
                                        onBlur={handleBlur('confirm')}
                                        secureTextEntry={secureConfirm}
                                    />
                                    <TouchableOpacity onPress={toggleConfirmVisibility}>
                                        <FontAwesome6 name={secureConfirm ? 'eye-slash' : 'eye'} size={22} color="#555" />
                                    </TouchableOpacity>
                                </View>
                                {touched.confirm && errors.confirm && (
                                    <Text style={styles.errorText}>{errors.confirm}</Text>
                                )}
                                <TouchableOpacity style={styles.button}

                                    onPress={handleSubmit}
                                    disabled={isSubmitting}

                                >
                                    <Text style={styles.buttonText}>{t("CreateAccout")}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.footerText}>
                                       {t("AlreadyHaveAccount")}<Text style={styles.link}>{t("login")}</Text>
                                    </Text>
                                </TouchableOpacity>  </>
                        )}
                    </Formik>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default SignupScreen;
