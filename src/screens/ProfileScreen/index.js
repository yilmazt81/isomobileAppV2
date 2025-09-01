import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useTranslation } from 'react-i18next';

const ProfileScreen = ({ navigation, user }) => {
   const { t } = useTranslation();

  const [avatar, setAvatar] = useState(user?.avatar);
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [password, setPassword] = useState('');

  const pickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', maxWidth: 500, maxHeight: 500, quality: 0.8 },
      (response) => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          console.warn('ImagePicker error:', response.errorMessage);
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setAvatar(response.assets[0].uri);
        }
      }
    );
  };

  const handleSave = () => {
    if (!name.trim() || !username.trim()) {
      Alert.alert('Hata', 'Ad ve kullanıcı adı boş olamaz.');
      return;
    }

    // TODO: Burada API veya state update işlemi yapılacak
    const updatedUser = {
      avatar,
      name,
      username,
      email,
      phone,
      bio,
    };

    Alert.alert('Başarılı', 'Profiliniz güncellendi.', [
      { text: 'Tamam', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={{ flex: 1 }}
      >
        <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <MaterialDesignIcons name="person-outline" size={50} color="#aaa" />
            </View>
          )}
          <View style={styles.cameraIcon}>
            <MaterialDesignIcons name="camera" size={18} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Ad Soyad */}
        <Text style={styles.label}>{t("NameAndSurname")}</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder={t("NameAndSurname")}
        />

        {/* Email */}
        <Text style={styles.label}>{t("email")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("email")}
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
  
        {/* Telefon */}
        <Text style={styles.label}>{t("Phone")}</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone} 
          keyboardType="phone-pad"
        />

    

        {/* Şifre */}
        <Text style={styles.label}>Yeni Şifre</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••"
          secureTextEntry
        />

        {/* Kaydet */}
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>Kaydet</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f2f2f2', padding: 16 },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 20,
    alignSelf: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    backgroundColor: '#ddd',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007bff',
    padding: 6,
    borderRadius: 16,
  },
  label: {
    marginLeft: 4,
    marginTop: 12,
    fontSize: 14,
    color: '#555',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
