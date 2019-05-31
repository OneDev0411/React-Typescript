import { useCallback, useContext } from 'react'

import { ITeam } from 'models/BrandConsole/types'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { deleteBrand } from 'models/BrandConsole/Brands'
import { updateTree } from 'utils/tree-utils/update-tree'

export function useDeleteTeam(
  rootTeam: ITeam | null,
  setRootTeam: (team: ITeam) => void
) {
  const deleteConfirmation = useContext(ConfirmationModalContext)

  return useCallback(
    (team: ITeam) => {
      // @ts-ignore until confirmation modal types are fixed
      deleteConfirmation.setConfirmationModal({
        message: 'Heads up!',
        description: 'The team will be removed for ever! Are you sure?',
        onConfirm: async () => {
          await deleteBrand(team.id)
          setRootTeam(
            updateTree(
              rootTeam!,
              node => (node.children || []).includes(team),
              parentTeam => {
                return {
                  ...parentTeam,
                  children: (parentTeam.children || []).filter(
                    child => child !== team
                  )
                }
              }
            )
          )
        }
      })
    },
    [deleteConfirmation, rootTeam, setRootTeam]
  )
}
