import { UseMutationResult } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'

import { inviteUser } from './invite-user'

interface DataInput {
  brand: UUID
  user: UUID
}

export type UseCreateSocialPost = UseMutationResult<
  unknown,
  ResponseError,
  DataInput
>

export function useInviteUser(
  options?: UseMutationOptions<ISocialPost, ResponseError, DataInput>
): UseCreateSocialPost {
  return useMutation(async ({ brand, user }) => inviteUser(brand, user), {
    ...options
  })
}
