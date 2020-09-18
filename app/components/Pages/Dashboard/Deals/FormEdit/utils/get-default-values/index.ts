import { getActiveTeamId } from 'utils/user-teams'
import { getBrandFormTemplateValues } from 'models/Deal/form'

export async function getDefaultValues(
  user: IUser,
  formId: UUID
): Promise<Record<string, string>> {
  const activeTeamId = getActiveTeamId(user)!

  const list = await getBrandFormTemplateValues(activeTeamId, formId)

  return list.reduce((acc, item) => {
    if (item.brand === activeTeamId) {
      return {
        ...acc,
        [item.field]: item.value
      }
    }

    return acc
  }, {})
}
