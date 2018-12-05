const getSocial = title => ({
  title,
  name: 'Social',
  brandColor: '#c6ccdc',
  size: { width: 557, height: 249 },
  description: 'Engage and connect with your audience.'
})

const getEmail = title => ({
  title,
  name: 'Email',
  brandColor: '#ceddd4',
  size: { width: 562, height: 294 },
  description: 'Designs for every occasion.'
})

const getInstagram = title => ({
  title,
  name: 'Instagram',
  brandColor: '#ded1e1',
  position: 'right center',
  size: { width: 576, height: 300 },
  description: 'Engage and connect with your audience.'
})

export const headers = {
  AsSeenIn: getSocial('As Seen In'),
  Birthday: getEmail('Birthday'),
  JustListed: getEmail('Just Listed'),
  JustSold: getSocial('Just Sold'),
  Listings: getInstagram('Multiple Listings'),
  OpenHouse: getEmail('Open House'),
  PriceImprovement: getSocial('Price Improvement')
}
