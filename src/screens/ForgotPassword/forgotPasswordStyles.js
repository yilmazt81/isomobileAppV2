import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  gradient: { flex: 1 },
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
    marginBottom: -10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e1e1e',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 18,
  },
  input: {
    backgroundColor: '#f2f3f7',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  errorText: {
    color: '#d0454c',
    fontSize: 13,
    marginBottom: 6,
    marginTop: -4,
    paddingLeft: 4,
  },
  button: {
    backgroundColor: '#3a6ff8',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  linkRow: {
    marginTop: 4,
    alignItems: 'center',
  },
  linkText: {
    color: '#3a6ff8',
    fontWeight: '500',
    fontSize: 13,
  },
});
