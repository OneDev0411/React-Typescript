import IconCall from '../../../../../../components/SvgIcons/CallOutline/IconCallOutline'
import IconMessage from '../../../../../../components/SvgIcons/EmailOutline/IconEmailOutline'
import IconFollowUp from '../../../../../../components/SvgIcons/Reply/IconReply'
import IconInspection from '../../../../../../components/SvgIcons/InspectionHome/IconInspectionHome'
import IconClosing from '../../../../../../components/SvgIcons/Keys/IconKeys'
import IconTour from '../../../../../../components/SvgIcons/Tour/IconTour'
import IconOpenHouse from '../../../../../../components/SvgIcons/OpenHouse/IconOpenHouse'
import IconListingAppointment from '../../../../../../components/SvgIcons/Time/IconTime'
import IconTodo from '../../../../../../components/SvgIcons/Todo/IconTodo'

function getIcons() {
  const icons = {}
  const iconsArray = [
    {
      name: 'Todo',
      icon: IconTodo
    },
    {
      name: 'Call',
      icon: IconCall
    },
    {
      name: 'Message',
      icon: IconMessage
    },
    {
      name: 'Tour',
      icon: IconTour
    },
    {
      name: 'Open House',
      icon: IconOpenHouse
    },
    {
      name: 'Listing appointment',
      icon: IconListingAppointment
    },
    {
      name: 'Follow up',
      icon: IconFollowUp
    },
    {
      name: 'Inspection',
      icon: IconInspection
    },
    {
      name: 'Closing',
      icon: IconClosing
    }
  ]

  iconsArray.forEach(icon => {
    icons[icon.name] = icon
  })

  return icons
}

export const icons = getIcons()
