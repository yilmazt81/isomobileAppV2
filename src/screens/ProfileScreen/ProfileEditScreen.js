import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';
const ProfileEditScreen = ({ navigation, user }) => {
  // route.params.user ile önceden yüklenmiş user objesini al

const { t, i18n } = useTranslation();
  const [avatar, setAvatar] = useState(user?.avatar);
  const [name, setName] = useState(user?.name);
  const [username, setUsername] = useState(user?.username);
  const [email, setemail] = useState(user?.email);

  // Galeri açıp foto seçme
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

  // Kaydet butonu
  const handleSave = () => {
    if (!name.trim() || !username.trim()) {
      Alert.alert('Hata', 'Ad ve kullanıcı adı boş olamaz.');
      return;
    }
    // TODO: API çağrısı veya state güncelleme
    // örn. UserService.updateProfile({ avatar, name, username, bio })
    Alert.alert('Başarılı', 'Profiliniz güncellendi.', [
      { text: 'Tamam', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.card}>
      {/* Avatar */}
      <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
        {avatar ? (
          <Image source={{ uri: (avatar == null ? require('../assets/useravatar.png') : avatar) }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <MaterialDesignIcons name="person-outline" size={50} color="#aaa" />
          </View>
        )}
        <View style={styles.cameraIcon}>
          <MaterialDesignIcons name="camera" size={18} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* İsim */}
      <Text style={styles.label}>Ad Soyad</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ad Soyad"
      />


      <Text style={styles.title}>{t("welcome")}</Text>

      <TextInput
        style={styles.input}
        placeholder={t("email")}
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setemail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {/* Kullanıcı Adı */}
      <Text style={styles.label}>Kullanıcı Adı</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="username"
        autoCapitalize="none"
      />



      {/* Kaydet */}
      <TouchableOpacity
        style={styles.saveButton}
        activeOpacity={0.8}
        onPress={handleSave}
      >
        <Text style={styles.saveText}>Kaydet</Text>
      </TouchableOpacity>
    </View>

  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f2f2f2' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    alignItems: "center",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 10,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
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
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 6,
    fontSize: 16,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Android
    elevation: 2,
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 60,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileEditScreen;
