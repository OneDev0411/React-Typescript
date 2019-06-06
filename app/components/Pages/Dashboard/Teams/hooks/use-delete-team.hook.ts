import { useCallback, useContext } from 'react'

import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { deleteBrand } from 'models/BrandConsole/Brands'
import { updateTree } from 'utils/tree-utils/update-tree'

export function useDeleteTeam(
  rootTeam: IBrand | null,
  setRootTeam: (team: IBrand) => void
) {
  const deleteConfirmation = useContext(ConfirmationModalContext)

  return useCallback(
    (team: IBrand) => {
      // @ts-ignore until confirmation modal types are fixed
      deleteConfirmation.setConfirmationModal({
        message: 'Heads up!',
        description: 'The team will be removed forever! Are you sure?',
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
