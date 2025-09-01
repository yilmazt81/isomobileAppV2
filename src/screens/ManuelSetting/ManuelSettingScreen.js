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

import { Button } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const InputField = ({ label, value, onChange, placeholder, secure,readOnly }) => {
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
                    readOnly={readOnly}
                    
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

    const { t, i18n } = useTranslation();

    const params = route?.params || {};
    const [deviceType] = React.useState([
        { label: t('SmartDevice1'), value: 'SmartDevice1', wifiName: "smartVasewf", wifiPassword: "12345678" },
        { label: t('SmartVase2Multi'), value: 'SmartVase2Multi', wifiName: "smartVase2", wifiPassword: "78945621" },
        { label: t('SmartVase1Pomp'), value: 'SmartPomp1', wifiName: "smartVase3", wifiPassword: "85236974" },
    ]);
    const [dropdown, setDropdown] = useState(null);
    const [wifiName, setWifiName] = useState('');
    const [wifiPassword, setWifiPassword] = useState('');

    const [submitting, setSubmitting] = useState(false);





    const onSubmit = () => {
        navigation.navigate("WifiSettings", {
            deviceType: dropdown,
            devicessid: wifiName,
            devicepassword: wifiPassword
        });

    };

    const dropdownChanged = (e) => {
        setDropdown(e);
        var findDevice = deviceType.find(t => t.value == e);

        setWifiName(findDevice?.wifiName);
        setWifiPassword(findDevice?.wifiPassword);
        setSubmitting(true);
    }
    return (
        <LinearGradient colors={['#090979', '#00D4FF', '#020024']}
            style={styles.outerContainer}>
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
                                <Text style={styles.title}>{t("registerdevice")}</Text>

                                {/* Alt vurgu gradient çubuğu */}
                                <LinearGradient
                                    colors={['#2563eb', '#7c3aed']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.underlineGradient}
                                />

                                <SelectField
                                    label={t("devicetype")}
                                    value={dropdown}
                                    onChange={(e) => dropdownChanged(e)}
                                    items={deviceType}
                                />

                                <InputField
                                    label={t("DeviceWifiName")}
                                    value={wifiName}
                                    onChange={setWifiName}
                                    placeholder={t("WFSettingsSSID")}
                                    readOnly={true}
                                />
                                <InputField
                                    label={t("DeviceWifiPassword")}
                                    value={wifiPassword}
                                    onChange={setWifiPassword}
                                    secure
                                    placeholder=""
                                    readOnly={true}
                                />

                                <View>

                                    <Button disabled={!submitting} icon={({ size, color }) => (
                                        <MaterialDesignIcons name="skip-next"
                                            size={size}
                                            color={color} />
                                    )}
                                        mode="contained" onPress={onSubmit}>
                                        {t("Next")}
                                    </Button>
                                </View>

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
