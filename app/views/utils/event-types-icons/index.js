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
      icon: IconCall
    },
    {
      name: 'In Person Meeting',
      icon: IconFollowUp
    },
    {
      name: 'Text',
      icon: Text
    },
    {
      name: 'Mail',
      icon: IconMessage
    },
    {
      name: 'Social',
      icon: Social
    },
    {
      name: 'Email',
      icon: Email
    },
    {
      name: 'Other',
      icon: Other
    }
  ]

  iconsArray.forEach(icon => {
    icons[icon.name] = icon
  })

  return icons
}

export const eventTypesIcons = getIcons()
