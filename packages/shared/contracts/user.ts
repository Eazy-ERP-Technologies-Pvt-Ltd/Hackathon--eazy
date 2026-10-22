/**
 * User, Auth, and Session Contracts
 */

export type UserRole = 'admin' | 'member' | 'guest';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  token: string;
  refreshToken: string;
  expiresAt: number;
  user: UserProfile;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  language: string;
  notificationsEnabled: boolean;
  aiModelPreference?: string;
}
