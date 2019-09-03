import { useEffect, useState } from 'react'

import { getBrandChecklists } from 'models/BrandConsole/Checklists'

/**
 * react hook encapsulating logic related to checklists page
 */
export function useChecklistsPage(rootBrandId: string | null) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const [checklists, setChecklists] = useState<IBrandChecklist[]>([])

  const fetchChecklists = async brandId => {
    setLoading(true)

    try {
      setChecklists(await getBrandChecklists(brandId))
    } catch (e) {
      setError(e)
    }

    setLoading(false)
  }

  useEffect(() => {
    if (rootBrandId) {
      fetchChecklists(rootBrandId)
    }
  }, [rootBrandId])

  const updateChecklist = (checklist: IBrandChecklist) => {}
  const addGenericItem = () => {}
  const addGeneralCommentItem = () => {}
  const updateTask = (task: IDealTask) => {}

  const deleteTask = (id: UUID) => {}

  return {
    checklists,
    loading,
    error,
    updateChecklist,
    updateTask,
    deleteTask,
    addGenericItem,
    addGeneralCommentItem
  }
}
