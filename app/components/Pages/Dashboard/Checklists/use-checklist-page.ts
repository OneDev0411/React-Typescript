import { useEffect, useState } from 'react'

import usePromise from 'react-use-promise'

import {
  addBrandCheckListTask,
  getBrandChecklists,
  removeBrandChecklistTask,
  updateBrandChecklist,
  updateBrandChecklistTask,
  sortTasks
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

  const fetchChecklists = async (brandId: UUID) => {
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

  const applyChecklistUpdate = (
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
    taskData: IBrandChecklistTaskInput
  ) => {
    if (rootBrandId) {
      applyChecklistUpdate(
        checklist.id,
        await addBrandCheckListTask(rootBrandId, checklist.id, {
          title: '',
          ...taskData,
          order: Array.isArray(checklist.tasks)
            ? Math.max(...checklist.tasks.map(task => task.order)) + 1
            : 1
        })
      )
    }
  }
  const updateChecklist = async (checklist: IBrandChecklist) => {
    applyChecklistUpdate(checklist.id, await updateBrandChecklist(checklist))
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
  const addFormTask = (checklist: IBrandChecklist, form: IDealForm) => {
    return addTask(checklist, {
      task_type: 'Form',
      title: form.name,
      form: form.id
    })
  }
  const updateTask = async (task: IBrandChecklistTask) => {
    if (rootBrandId) {
      const checklist = await updateBrandChecklistTask(rootBrandId, task)

      applyChecklistUpdate(task.checklist, checklist)
    }
  }

  const deleteTask = async (checklistId, taskId: UUID) => {
    if (rootBrandId) {
      await removeBrandChecklistTask(rootBrandId, checklistId, taskId)
      applyChecklistUpdate(checklistId, checklist => ({
        ...checklist,
        tasks: (checklist.tasks || []).filter(task => task.id !== taskId)
      }))
    }
  }

  const reorderTasks = (checklistId: UUID, tasks: IBrandChecklistTask[]) => {
    if (rootBrandId) {
      const orders = tasks.map((task, order) => ({
        id: task.id,
        order: order + 1
      }))

      sortTasks(rootBrandId, checklistId, orders)

      // update related checklist with sorted tasks
      setChecklists(checklists =>
        checklists.map(checklist => {
          if (checklist.id === checklistId) {
            return {
              ...checklist,
              tasks
            }
          }

          return checklist
        })
      )
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
    reorderTasks,
    addGenericTask,
    addGeneralCommentTask,
    addFormTask,
    forms,
    formsError,
    formsState
  }
}
