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
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: -16,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1e1e1e',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f2f3f7',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: '#f2f3f7',
    borderRadius: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginBottom: 16,
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
    marginTop: 4,
    marginBottom: 8,
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
