import { useEffect, useState, useCallback } from 'react';
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';

 

const checkInternetReachability = async (timeoutMs = 3000) => {
  // Güvenilir, hızlı bir endpoint. DNS’e çok güvenme; fetch ile doğrula.
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch('https://www.google.com/generate_204', {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(id);
    // 204 dönerse internet var; bazı ağlar 204'ü engelleyebilir ama çoğunlukla güvenli.
    return response.status === 204 || response.ok;
  } catch (e) {
    clearTimeout(id);
    return false;
  }
};

export const useWifiInternetStatus = () => {
  const [status, setStatus] = useState({
    isWifi: false,
    isConnected: false,
    hasInternet: false,
  });

  const evaluate = useCallback(async (state) => {
    const isWifi = state.type === NetInfoStateType.wifi;
    const isConnected = state.isConnected === true && state.isInternetReachable !== false;

    let hasInternet = false;
    if (isWifi && isConnected) {
      hasInternet = await checkInternetReachability();
    }

    setStatus({
      isWifi,
      isConnected,
      hasInternet,
    });
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      evaluate(state);
    });

    // İlk değerlendirme
    NetInfo.fetch().then((state) => evaluate(state));

    return () => {
      unsubscribe();
    };
  }, [evaluate]);

  return status; // { isWifi, isConnected, hasInternet }
};
