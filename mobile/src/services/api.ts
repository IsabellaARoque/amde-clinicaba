import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = axios.create({
  baseURL: 'http://(seu ip):8080/api',
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@ClinicABA:token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
