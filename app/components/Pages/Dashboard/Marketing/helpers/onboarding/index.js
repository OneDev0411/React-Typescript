export const OnboardingSteps = [
  {
    target: '.onboarding--intro',
    title: 'Reach Your Clients',
    content:
      'Use the marketing center to send engaging emails, videos and social posts to your clients.',
    placement: 'right-start',
    actions: {
      primary: 'Learn More'
    }
  },
  {
    target: '.onboarding--all-designs',
    title: 'Promote with Social & Email',
    placement: 'right-start',
    actions: {
      primary: 'Next',
      back: 'Prev'
    },
    content:
      'All Designs is your jump off point to discover the right marketing for your needs. Select from hundreds of email & social template designs.',
    image: '/static/images/marketing/onboarding/all-designs.png',
    imageStyle: {
      maxWidth: '100%'
    },
    tooltipStyle: {
      width: '35rem'
    }
  },
  {
    target: '.onboarding--my-designs',
    title: 'A History of Your Designs',

    content:
      'My Designs saves all your custom templates in one place. Comeback to view, edit and resend the marketing designs that are working for you.',
    placement: 'right-start',
    actions: {
      back: 'Prev',
      primary: 'Next'
    }
  },
  {
    target: '.onboarding--menus',
    title: 'A Design for Every Listing',
    content:
      'Choose from 100’s of themed templates that make it easy to market to your  clients via email, social media and printed material.',
    placement: 'right-start',
    actions: {
      back: 'Prev',
      primary: 'Finish'
    }
  }
]
