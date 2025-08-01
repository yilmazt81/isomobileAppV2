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


const SignupSchema = Yup.object().shape({
    name: Yup.string().trim().required('Ad soyad gerekli'),
    email: Yup.string()
        .trim()
        .email('Geçerli e-posta girin')
        .required('E-posta gerekli'),
    password: Yup.string()
        .min(6, 'Şifre en az 6 karakter olmalı')
        .required('Şifre gerekli'),
    confirm: Yup.string()
        .oneOf([Yup.ref('password')], 'Şifreler eşleşmiyor')
        .required('Şifre onayı gerekli'),
});


const SignupScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [secure, setSecure] = useState(true);
    const [secureConfirm, setSecureConfirm] = useState(true);

    const togglePasswordVisibility = () => setSecure(!secure);
    const toggleConfirmVisibility = () => setSecureConfirm(!secureConfirm);

    const handleSignup = async (values, { setSubmitting }) => {
        try {
            // Burada Firebase / API çağrısı yap
            // örnek: await signUpWithEmail(values.email, values.password);
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
                        source={require('../assets/Login_icon.json')}
                        autoPlay
                        loop
                        style={styles.lottie}
                    />

                    <Text style={styles.title}>Kayıt Ol</Text>
                    <Formik
                        initialValues={{ name: '', email: '', password: '', confirm: '' }}
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
                                    placeholder="Ad Soyad"
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
                                    placeholder="E-posta"
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
                                        placeholder="Şifre"
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
                                        placeholder="Şifreyi Onayla"
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
                                    <Text style={styles.buttonText}>Hesap Oluştur</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.footerText}>
                                        Zaten bir hesabın var mı? <Text style={styles.link}>Giriş Yap</Text>
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
