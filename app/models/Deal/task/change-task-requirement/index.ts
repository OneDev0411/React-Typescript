import Fetch from '../../../../services/fetch'

/**
 * change task status
 */
export async function changeTaskRequirement(
  task_id: UUID,
  required: boolean
): Promise<void> {
  try {
    await new Fetch().patch(`/tasks/${task_id}/required`).send({ required })
  } catch (e) {}
}
