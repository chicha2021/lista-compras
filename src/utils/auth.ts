import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

export interface User {
  username: string;
  password: string;
}

async function getUsers(): Promise<User[]> {
  const data = await AsyncStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function registerUser(username: string, password: string): Promise<boolean> {
  const users = await getUsers();
  if (users.find(u => u.username === username)) return false;
  users.push({ username, password });
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
}

export async function loginUser(username: string, password: string): Promise<boolean> {
  const users = await getUsers();
  return !!users.find(u => u.username === username && u.password === password);
}

export async function saveCurrentUser(username: string): Promise<void> {
  await AsyncStorage.setItem(CURRENT_USER_KEY, username);
}

export async function getCurrentUser(): Promise<string | null> {
  return AsyncStorage.getItem(CURRENT_USER_KEY);
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
}
