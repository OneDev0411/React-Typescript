import { isBefore } from 'date-fns'

export function isSocialPostExecuted(
  socialPost: Pick<ISocialPost, 'executed_at' | 'due_at'>
): boolean {
  return (
    // The socialPost.due_at is in seconds but isBefore needs a milliseconds value
    !!socialPost.executed_at || isBefore(socialPost.due_at * 1000, new Date())
  )
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
