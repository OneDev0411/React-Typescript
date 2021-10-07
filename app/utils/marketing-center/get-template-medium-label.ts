const MEDIUM_LABEL_MAP: {
  [key in IMarketingTemplateMedium]: string
} = {
  Email: 'Email',
  Social: 'Social',
  Letter: 'Print',
  FacebookCover: 'Facebook Covers',
  InstagramStory: 'Instagram Stories',
  LinkedInCover: 'LinkedIn Covers',
  TwitterCover: 'Twitter Covers',
  RealtorCover: 'Realtor.com Covers',
  YouTubeCover: 'YouTube Covers',
  Website: 'Website'
}

export function getTemplateMediumLabel(
  medium: IMarketingTemplateMedium
): string {
  return MEDIUM_LABEL_MAP[medium] ?? medium
}
