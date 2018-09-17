import IconCall from '../../components/SvgIcons/CallOutline/IconCallOutline'
import IconFollowUp from '../../components/SvgIcons/FollowUp/IconFollowUp'
import Text from '../../components/SvgIcons/Text/IconText'
import IconMessage from '../../components/SvgIcons/EmailOutline/IconEmailOutline'
import Social from '../../components/SvgIcons/Social/IconSocial'
import Email from '../../components/SvgIcons/AtSign/IconAtSign'
import Other from '../../components/SvgIcons/MenuRounded/IconMenuRounded'

function getIcons() {
  const icons = {}
  const iconsArray = [
    {
      name: 'Call',
      icon: IconCall,
      color: '#04C6D9'
    },
    {
      name: 'In Person Meeting',
      icon: IconFollowUp,
      color: '#F7A700'
    },
    {
      name: 'Text',
      icon: Text,
      color: '#000'
    },
    {
      name: 'Mail',
      icon: IconMessage,
      color: '#8F6CF0'
    },
    {
      name: 'Social',
      icon: Social,
      color: '#003BDF'
    },
    {
      name: 'Email',
      icon: Email,
      color: '#7ED321'
    },
    {
      name: 'Other',
      icon: Other,
      color: '#9013FE'
    }
  ]

  iconsArray.forEach(icon => {
    icons[icon.name] = icon
  })

  return icons
}

export const eventTypesIcons = getIcons()
