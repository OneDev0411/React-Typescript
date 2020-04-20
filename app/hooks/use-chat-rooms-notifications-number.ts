import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

export function useChatRoomsNotificationsNumber(): number {
  const rooms: IChatRoom[] = useSelector((state: IAppState) =>
    Object.values(state.chatroom.rooms || {})
  )

  return rooms
    .filter(room => ['Direct', 'Group'].includes(room.room_type))
    .map(room => room.new_notifications || 0)
    .reduce((a, b) => a + b, 0)
}
