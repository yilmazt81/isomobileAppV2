import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  pickerWrapper: {
    alignSelf: 'flex-end',
    marginBottom: 8,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 140,
    ...(Platform.OS === 'android' ? { paddingVertical: 4 } : {}),
  },
  picker: {
    color: '#fff',
    height: 40,
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 10,
  },
  lottie: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: -20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1e1e1e',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#f2f3f7',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 18,
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: '#f2f3f7',
    borderRadius: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#3a6ff8',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    color: '#555',
  },
  link: {
    color: '#3a6ff8',
    fontWeight: 'bold',
  },
});
