import { useEffect, useState } from 'react'

import usePromise from 'react-use-promise'

import {
  addBrandCheckListTask,
  getBrandChecklists,
  removeBrandChecklistTask,
  updateBrandChecklist,
  updateBrandChecklistTask
} from 'models/BrandConsole/Checklists'
import { getBrandForms } from 'models/BrandConsole/Forms'

/**
 * react hook encapsulating logic related to checklists page
 */
export function useChecklistsPage(rootBrandId: string | null) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const [checklists, setChecklists] = useState<IBrandChecklist[]>([])

  const [forms, formsError, formsState] = usePromise(
    () => (rootBrandId ? getBrandForms(rootBrandId) : Promise.reject()),
    [rootBrandId]
  )

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
  const updateChecklist = async (checklist: IBrandChecklist) => {
    _updateChecklist(checklist.id, await updateBrandChecklist(checklist))
  }
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
  const updateTask = async (task: IDealTask) => {
    if (rootBrandId) {
      const checklist = await updateBrandChecklistTask(rootBrandId, task)

      _updateChecklist(task.checklist, checklist)
    }
  }

  const deleteTask = async (checklistId, taskId: UUID) => {
    if (rootBrandId) {
      await removeBrandChecklistTask(rootBrandId, checklistId, taskId)
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
    addGeneralCommentTask,
    forms,
    formsError,
    formsState
  }
}
