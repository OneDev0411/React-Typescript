import IconCall from '../../components/SvgIcons/CallOutline/IconCallOutline'
import IconFollowUp from '../../components/SvgIcons/FollowUp/IconFollowUp'
import Text from '../../components/SvgIcons/Text/IconText'
import Chat from '../../components/SvgIcons/Chat/IconChat'
import IconMessage from '../../components/SvgIcons/EmailOutline/IconEmailOutline'
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
      name: 'In-Person Meeting',
      icon: IconFollowUp,
      color: '#F7A700'
    },
    {
      name: 'Text',
      icon: Text,
      color: '#000'
    },
    {
      name: 'Chat',
      icon: Chat,
      color: '#ff00bf'
    },
    {
      name: 'Mail',
      icon: IconMessage,
      color: '#8F6CF0'
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
