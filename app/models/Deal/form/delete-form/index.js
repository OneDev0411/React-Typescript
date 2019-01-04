import Fetch from '../../../../services/fetch'

/**
 * delete a form
 */
export async function deleteForm(checklist, formId) {
  if (!checklist.brand) {
    throw new Error('This user does not belong to any brand')
  }

  try {
    await new Fetch().delete(
      `/brands/${checklist.brand}/checklists/${checklist.id}/forms/${formId}`
    )
  } catch (e) {
    return null
  }
}
