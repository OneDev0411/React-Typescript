const MEDIUM_LABEL_MAP: {
  [key in IMarketingTemplateMedium]: string
} = {
  Email: 'Email',
  Social: 'Social',
  Letter: 'Print Flyer',
  FacebookCover: 'Facebook Covers',
  InstagramStory: 'Instagram Stories',
  LinkedInCover: 'LinkedIn Covers',
  Website: 'Website'
}

export function getTemplateMediumLabel(medium: IMarketingTemplateMedium): string {
  return MEDIUM_LABEL_MAP[medium] ?? medium
}
