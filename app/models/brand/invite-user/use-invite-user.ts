import { UseMutationResult } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'

import { inviteUser, InviteUserDataInput } from './invite-user'

export type UseInviteUser = UseMutationResult<
  void,
  ResponseError,
  InviteUserDataInput
>

export function useInviteUser(
  options?: UseMutationOptions<void, ResponseError, InviteUserDataInput>
): UseInviteUser {
  return useMutation(async data => inviteUser(data), {
    ...options
  })
}
