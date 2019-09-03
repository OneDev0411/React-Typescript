import { useEffect, useState } from 'react'

import {
  addBrandCheckListTask,
  getBrandChecklists,
  removeBrandCheckListTask
} from 'models/BrandConsole/Checklists'

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

  const _updateChecklist = (
    checklistId: string,
    update: IBrandChecklist | ((checklist: IBrandChecklist) => IBrandChecklist)
  ) => {
    setChecklists(checklists =>
      checklists.map(checklist => {
        if (checklist.id === checklistId) {
          return typeof update === 'function' ? update(checklist) : update
        }

        return checklist
      })
    )
  }

  const addTask = async (
    checklist: IBrandChecklist,
    taskData: IDealTaskInput
  ) => {
    if (rootBrandId) {
      _updateChecklist(
        checklist.id,
        await addBrandCheckListTask(rootBrandId, checklist.id, {
          title: '',
          order: Math.max(...checklist.tasks.map(task => task.order)) + 1,
          ...taskData
        })
      )
    }
  }
  const updateChecklist = (checklist: IBrandChecklist) => {}
  const addGenericTask = (checklist: IBrandChecklist) => {
    return addTask(checklist, {
      task_type: 'Generic'
    })
  }
  const addGeneralCommentTask = (checklist: IBrandChecklist) => {
    return addTask(checklist, {
      task_type: 'GeneralComments'
    })
  }
  const updateTask = (task: IDealTask) => {}

  const deleteTask = async (checklistId, taskId: UUID) => {
    if (rootBrandId) {
      await removeBrandCheckListTask(rootBrandId, checklistId, taskId)
      _updateChecklist(checklistId, checklist => ({
        ...checklist,
        tasks: (checklist.tasks || []).filter(task => task.id !== taskId)
      }))
    }
  }

  return {
    checklists,
    loading,
    error,
    addTask,
    updateChecklist,
    updateTask,
    deleteTask,
    addGenericTask,
    addGeneralCommentTask
  }
}
