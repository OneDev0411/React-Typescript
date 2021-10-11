// The date format provided by Vimeo is not supported on Safari so we need to
// replace the space with T character to make it standard
export function makeVimeoDateStandard(date: string): string {
  return date.replace(' ', 'T')
}
