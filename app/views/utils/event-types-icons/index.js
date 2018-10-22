import IconCall from '../../components/SvgIcons/CallOutline/IconCallOutline'
import IconFollowUp from '../../components/SvgIcons/FollowUp/IconFollowUp'
import Text from '../../components/SvgIcons/Text/IconText'
import Chat from '../../components/SvgIcons/Chat/IconChat'
import IconMessage from '../../components/SvgIcons/EmailOutline/IconEmailOutline'
import Email from '../../components/SvgIcons/AtSign/IconAtSign'
import OpenHouse from '../../components/SvgIcons/OpenHouse/IconOpenHouse'
import Tour from '../../components/SvgIcons/Tour/IconTour'
import Other from '../../components/SvgIcons/MenuRounded/IconMenuRounded'
import Closing from '../../components/SvgIcons/Closing/IconClosing'
import IconInPerson from '../../components/SvgIcons/InPerson/IconInPerson'
import IconTodo from '../../components/SvgIcons/Todo/IconTodo'
import IconListingAppointment from '../../components/SvgIcons/ListingAppointment/IconListingAppointment'
import IconTaskCritical
  from '../../components/SvgIcons/TaskCritical/IconTaskCritical'

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
      icon: IconInPerson,
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
      name: 'Open House',
      icon: OpenHouse,
      color: '#50E3C2'
    },
    {
      name: 'Tour',
      icon: Tour,
      color: '#BD10E0'
    },
    {
      name: 'Other',
      icon: Other,
      color: '#9013FE'
    },
    {
      name: 'Closing',
      icon: Closing,
      color: '#287700'
    },
    {
      name: 'Follow Up',
      icon: IconFollowUp,
      color: '#9013FE'
    },
    {
      name: 'Todo',
      icon: IconTodo,
      color: '#4e709d'
    },
    {
      name: 'Todo',
      icon: IconListingAppointment,
      color: '#8B572A'
    },
    {
      name: 'Task Critical',
      icon: IconTaskCritical,
      color: '#F5A623'
    }
  ]

  iconsArray.forEach(icon => {
    icons[icon.name] = icon
  })

  return icons
}

export const eventTypesIcons = getIcons()
