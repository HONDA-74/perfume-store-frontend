import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import * as usersApi from '@/services/api/users/users.service';
import type { CreateSavedAddressData, UpdateProfileData, UpdateSavedAddressData } from '@/types';

export function useUpdateProfile() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfileData) => usersApi.updateProfile(payload),
    onSuccess: (user) => client.setQueryData(queryKeys.auth.user(), user),
  });
}

export function useAddresses() {
  return useQuery({ queryKey: queryKeys.users.addresses(), queryFn: usersApi.getAddresses, staleTime: 5 * 60 * 1000 });
}

export function useCreateAddress() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (payload: CreateSavedAddressData) => usersApi.createAddress(payload), onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.users.addresses() }) });
}

export function useUpdateAddress() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: UpdateSavedAddressData }) => usersApi.updateAddress(id, payload), onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.users.addresses() }) });
}

export function useDeleteAddress() {
  const client = useQueryClient();
  return useMutation({ mutationFn: usersApi.deleteAddress, onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.users.addresses() }) });
}
