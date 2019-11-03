import Message from '../../../Chatroom/Util/message'

export function createTaskComment(
  task: IDealTask,
  userId: UUID,
  comment: string
): void {
  const message = {
    comment,
    author: userId,
    room: task!.room.id
  }

  // send comment message
  Message.postTaskComment(task, message)
}
