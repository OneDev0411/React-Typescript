import { isBefore } from 'date-fns'

import { convertTimestampToDate } from '@app/utils/date-utils'

import { SocialPostFilter } from './types'

export function isSocialPostExecuted(
  socialPost: Pick<ISocialPost, 'executed_at' | 'due_at'>
): boolean {
  return !!socialPost.executed_at || isSocialPostTimeout(socialPost)
}

export function isSocialPostTimeout(
  socialPost: Pick<ISocialPost, 'executed_at' | 'due_at'>
): boolean {
  return isBefore(convertTimestampToDate(socialPost.due_at), new Date())
}

export function sortSocialPosts(
  socialPosts: ISocialPost<'template_instance' | 'owner'>[],
  ascending: boolean
): ISocialPost<'template_instance' | 'owner'>[] {
  return [...socialPosts].sort((a, b) => {
    if (ascending) {
      return a.due_at - b.due_at
    }

    return b.due_at - a.due_at
  })
}

export function isSocialPostFilterValid(
  filter: string
): filter is SocialPostFilter {
  return ['posted', 'scheduled', 'failed'].includes(filter)
}

export function isSocialPostFailed(
  socialPost: ISocialPost<'template_instance' | 'owner'>
): boolean {
  return !!socialPost.failed_at
}
