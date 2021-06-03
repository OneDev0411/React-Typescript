import {
  mdiEmailOutline,
  mdiPhoneOutline,
  mdiCommentTextMultipleOutline,
  mdiMailboxUpOutline,
  mdiDotsHorizontalCircleOutline,
  mdiAccountMultipleOutline,
  mdiChatProcessingOutline
} from '@mdi/js'

interface EventIcon {
  type: TTaskType
  icon: string
  color: string
}

// TODO: merge all events icon into one specific file
export const EVENT_ICONS: EventIcon[] = [
  {
    type: 'Call',
    icon: mdiPhoneOutline,
    color: '#04C6D9'
  },
  {
    type: 'In-Person Meeting',
    icon: mdiAccountMultipleOutline,
    color: '#F7A700'
  },
  {
    type: 'Text',
    icon: mdiCommentTextMultipleOutline,
    color: '#000'
  },
  {
    type: 'Chat',
    icon: mdiChatProcessingOutline,
    color: '#ff00bf'
  },
  {
    type: 'Mail',
    icon: mdiMailboxUpOutline,
    color: '#7ED321'
  },
  {
    type: 'Email',
    icon: mdiEmailOutline,
    color: '#8F6CF0'
  },
  {
    type: 'Other',
    icon: mdiDotsHorizontalCircleOutline,
    color: '#9013FE'
  }
]
