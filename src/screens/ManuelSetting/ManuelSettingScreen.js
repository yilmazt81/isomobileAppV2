import React, { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
const { t, i18n } = useTranslation();

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const InputField = ({ label, value, onChange, placeholder, secure }) => {
    return (
        <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    secureTextEntry={secure}
                    style={styles.textInput}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>
        </View>
    );
};

const SelectField = ({ label, value, onChange, items }) => {
    return (
        <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <View style={styles.pickerContainer}>
                <RNPickerSelect
                    onValueChange={(val) => onChange(val)}
                    items={items}
                    placeholder={{ label: 'Seçiniz...', value: null }}
                    value={value}
                    style={{
                        inputIOS: styles.pickerText,
                        inputAndroid: styles.pickerText,
                        placeholder: { color: '#999' },
                    }}
                    useNativeAndroidPickerStyle={false}
                    Icon={() => <MaterialDesignIcons name="chevron-down" size={20} />}
                />
            </View>
        </View>
    );
};

const ManuelSetting = ({ navigation, route }) => {
    const params = route?.params || {};
    const [deviceType] = React.useState([
        { label: t('SmartDevice1'), value: 'SmartDevice1' },
        { label: t('SmartVase2Multi'), value: 'SmartVase2Multi' },
    ]);
    const [dropdown, setDropdown] = useState(null);
    const [field1, setField1] = useState('');
    const [field2, setField2] = useState('');
    const [field3, setField3] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const scale = React.useRef(new Animated.Value(1)).current;

    const validate = () => {
        if (!dropdown) return 'Açılan kutu seçilmedi.';
        if (!field1.trim()) return 'Birinci alan boş.';
        if (!field2.trim()) return 'İkinci alan boş.';
        if (!field3.trim()) return 'Üçüncü alan boş.';
        return null;
    };

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.97,
            useNativeDriver: true,
            friction: 8,
            tension: 120,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            friction: 8,
            tension: 120,
        }).start();
    };

    const onSubmit = () => {
        const err = validate();
        if (err) {
            Alert.alert('Hata', err);
            return;
        }
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            Alert.alert('Başarılı', 'Kayıt tamamlandı.');
        }, 1000);
    };

    return (
        <LinearGradient colors={['#090979', '#00D4FF', '#020024']} style={styles.outerContainer}>
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.select({ ios: 'padding', android: undefined })}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.formWrapper}>
                            <View style={styles.card}>
                                <Text style={styles.title}>Kayıt Ol</Text>

                                {/* Alt vurgu gradient çubuğu */}
                                <LinearGradient
                                    colors={['#2563eb', '#7c3aed']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.underlineGradient}
                                />

                                <SelectField
                                    label="Kategori"
                                    value={dropdown}
                                    onChange={setDropdown}
                                    items={deviceType}
                                />

                                <InputField
                                    label="Ad"
                                    value={field1}
                                    onChange={setField1}
                                    placeholder="İsminizi girin"
                                />
                                <InputField
                                    label="E-posta"
                                    value={field2}
                                    onChange={setField2}
                                    placeholder="ornek@site.com"
                                />
                                <InputField
                                    label="Şifre"
                                    value={field3}
                                    onChange={setField3}
                                    placeholder="********"
                                    secure
                                />

                                <Animated.View style={{ transform: [{ scale }], marginTop: 8 }}>
                                    <TouchableOpacity
                                        onPress={onSubmit}
                                        activeOpacity={0.8}
                                        disabled={submitting}
                                        onPressIn={handlePressIn}
                                        onPressOut={handlePressOut}
                                        style={[styles.submitButton, submitting && { opacity: 0.6 }]}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <MaterialDesignIcons name="account-check-outline" size={20} color="#fff" />
                                            <Text style={styles.submitText}>
                                                {submitting ? 'Gönderiliyor...' : 'Kayıt Ol'}
                                            </Text>
                                        </View>
                                        <MaterialDesignIcons name="chevron-right" size={20} color="#fff" />
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 16,
    },
    formWrapper: {
        alignSelf: 'center',
        width: '100%',
        maxWidth: 500, // büyük ekranlarda çok genişlemesin
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 22,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 24,
        elevation: 8,
    },
    underlineGradient: {
        height: 6,
        borderRadius: 4,
        marginTop: 4,
        marginBottom: 16,
        width: 120,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 6,
        color: '#1f2937',
    },
    fieldWrapper: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
        color: '#374151',
    },
    inputContainer: {
        backgroundColor: '#f2f2f7',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    textInput: {
        fontSize: 16,
        padding: 0,
        margin: 0,
        color: '#1f2937',
    },
    pickerContainer: {
        backgroundColor: '#f2f2f7',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === 'ios' ? 14 : 6,
        justifyContent: 'center',
    },
    pickerText: {
        fontSize: 16,
        paddingVertical: 4,
        color: '#1f2937',
    },
    submitButton: {
        backgroundColor: '#2563eb',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    submitText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 10,
    },
});

export default ManuelSetting;
