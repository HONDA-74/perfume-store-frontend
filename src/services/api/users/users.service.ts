import { apiClient } from '@/lib';
import type { ApiSuccessResponse, CreateSavedAddressData, SavedAddress, UpdateProfileData, UpdateSavedAddressData, User } from '@/types';

export async function updateProfile(payload: UpdateProfileData): Promise<User> {
  const { data } = await apiClient.patch<ApiSuccessResponse<User>>('/users/me', payload);
  return data.data;
}

export async function getAddresses(): Promise<SavedAddress[]> {
  const { data } = await apiClient.get<ApiSuccessResponse<SavedAddress[]>>('/users/me/addresses');
  return data.data;
}

export async function createAddress(payload: CreateSavedAddressData): Promise<SavedAddress> {
  const { data } = await apiClient.post<ApiSuccessResponse<SavedAddress>>('/users/me/addresses', payload);
  return data.data;
}

export async function updateAddress(id: string, payload: UpdateSavedAddressData): Promise<SavedAddress> {
  const { data } = await apiClient.patch<ApiSuccessResponse<SavedAddress>>(`/users/me/addresses/${id}`, payload);
  return data.data;
}

export async function deleteAddress(id: string): Promise<void> {
  await apiClient.delete(`/users/me/addresses/${id}`);
}
