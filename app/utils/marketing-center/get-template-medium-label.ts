const MEDIUM_LABEL_MAP: {
  [key in IMarketingTemplateMedium]: string
} = {
  Social: 'Social',
  FacebookCover: 'Facebook Covers',
  InstagramStory: 'Stories',
  LinkedInCover: 'LinkedIn Covers',
  TwitterCover: 'Twitter Covers',
  RealtorCover: 'Realtor.com Covers',
  YouTubeCover: 'YouTube Covers',
  Email: 'Email',
  Letter: 'Print',
  Website: 'Website'
}

export function getTemplateMediumLabel(
  medium: IMarketingTemplateMedium
): string {
  return MEDIUM_LABEL_MAP[medium] ?? medium
}
