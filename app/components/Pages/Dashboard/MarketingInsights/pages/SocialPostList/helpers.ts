import { isBefore } from 'date-fns'

export function isSocialPostExecuted(
  socialPost: Pick<ISocialPost, 'executed_at' | 'due_at'>
): boolean {
  return !!socialPost.executed_at || isBefore(socialPost.due_at, new Date())
}
