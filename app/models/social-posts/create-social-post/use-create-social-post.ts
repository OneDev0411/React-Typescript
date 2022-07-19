import { UseMutationResult } from 'react-query'

import { useMutation, UseMutationOptions } from '@app/hooks/query'

import { list } from '../query-keys'

import { createSocialPost } from './create-social-post'

interface DataInput extends ISocialPostInput {
  brand: UUID
}

interface ISocialError {
  original: Nullable<string>
  status: number
  message: string
  response?: {
    body: {
      code: string
      http: number
      message: string
    }
  }
}

export type UseCreateSocialPost = UseMutationResult<
  ISocialPost,
  ISocialError,
  DataInput
>

export type UseCreateSocialPostOptions = Omit<
  UseMutationOptions<ISocialPost, ISocialError, DataInput>,
  'invalidates'
>

export function useCreateSocialPost(
  options?: UseCreateSocialPostOptions
): UseCreateSocialPost {
  return useMutation(
    async ({ brand, ...values }) => createSocialPost(brand, values),
    {
      ...options,
      // Just invalidate the lists of social-posts because we dont know the list sort logic
      // at this stage so having an optimistic update is not easy
      invalidates: (_, values) => [list(values.brand)]
    }
  )
}
