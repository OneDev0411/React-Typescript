import { Dispatch, useCallback, useState } from 'react'

import { ICreateBrand, ITeam } from 'models/BrandConsole/types'
import { addBrand, editBrand } from 'models/BrandConsole/Brands'

import { getUpdatedRootTeam } from '../helpers/get-updated-root-team'

export function useAddEditTeamModal(
  setRootTeam: Dispatch<(prevState: ITeam) => ITeam>
) {
  const [editingTeam, setEditingTeam] = useState<ITeam | null>(null)
  const [newItemParent, setNewItemParent] = useState<ITeam | null>(null)

  const closeAddEditModal = () => {
    setEditingTeam(null)
    setNewItemParent(null)
  }

  return {
    openAdd: useCallback((parent: ITeam) => {
      setEditingTeam(null)
      setNewItemParent(parent)
    }, []),
    openEdit: (team: ITeam) => setEditingTeam(team),
    close: closeAddEditModal,
    isOpen: !!editingTeam || !!newItemParent,
    submit: async (values: Partial<ITeam> & ICreateBrand) => {
      if (editingTeam && values.id) {
        const newTeam = (await editBrand(values)).data

        setRootTeam(rootTeam => getUpdatedRootTeam(rootTeam, editingTeam, newTeam))

        closeAddEditModal()
      } else if (newItemParent) {
        const newTeam = (await addBrand(values, newItemParent.id)).data

        setRootTeam(rootTeam =>
          getUpdatedRootTeam(
            rootTeam,
            newItemParent,
            {
              ...newItemParent,
              children: [...newItemParent.children, newTeam]
            },
            false
          )
        )
        closeAddEditModal()
      }
    },
    validate: values => {
      const errors: { [key in keyof ITeam]?: string } = {}
      const { name } = values

      if (!name) {
        errors.name = 'Name cannot be empty'
      }

      return errors
    },
    team: editingTeam
  }
}
