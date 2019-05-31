import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

import { ICreateBrand, ITeam, ITeamRole } from 'models/BrandConsole/types'
import {
  addBrand,
  deleteBrand,
  editBrand,
  getBrands
} from 'models/BrandConsole/Brands'
import { getActiveTeamId } from 'utils/user-teams'

import { updateTree } from 'utils/tree-utils/update-tree'

import { updateUserRoles } from './helpers/update-user-roles'
import { userMatches } from './helpers/users-matches'
import { getTeamUsers } from './helpers/get-team-users'

function teamMatches(team: ITeam, searchTerm: string) {
  const regExp = new RegExp(searchTerm, 'gi')

  // TODO: improve search UX with fuse
  return (
    team.name.match(regExp) ||
    getTeamUsers(team).some(user => userMatches(user, searchTerm))
  )
}

export function useTeamsPage(user: IUser, searchTerm: string) {
  const [rootTeam, setRootTeam] = useState<ITeam | null>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [updatingUserIds, setUpdatingUserIds] = useState<string[]>([])
  const [editingTeam, setEditingTeam] = useState<ITeam | null>(null)
  const [newItemParent, setNewItemParent] = useState<ITeam | null>(null)

  const deleteConfirmation = useContext(ConfirmationModalContext)

  useEffect(() => {
    setLoading(true)
    getBrands(getActiveTeamId(user))
      .then(team => {
        setRootTeam(team.data)
        setLoading(false)
      })
      .catch(e => {
        setError(e)
        setLoading(false)
      })
  }, [user])

  const updateRoles = async (
    team: ITeam,
    userId: string,
    newRoles: ITeamRole[]
  ) => {
    setUpdatingUserIds(updatingUserIds => [...updatingUserIds, userId])

    const newTeam = await updateUserRoles(team, userId, newRoles)

    updateTeam(team, newTeam)

    setUpdatingUserIds(updatingUserIds =>
      updatingUserIds.filter(aUserId => aUserId !== userId)
    )
  }

  const updateTeam = (team, newTeam, keepChildren = true) => {
    if (newTeam !== team) {
      setRootTeam(
        updateTree(
          rootTeam!,
          aTeam => aTeam === team,
          () => ({
            ...newTeam,
            children: keepChildren ? team.children : newTeam.children
          })
        )
      )
    }
  }
  const matches = useCallback(
    (team: ITeam) => {
      // performance improvement is possible by memoizing result of matches
      // because for deep nodes it's called so many times because of the
      // recursion
      return (
        teamMatches(team, searchTerm) || (team.children || []).some(matches)
      )
    },
    [searchTerm]
  )

  const getChildNodes = useCallback(
    (parent?: ITeam) => {
      const nodes = parent ? parent.children || [] : rootTeam ? [rootTeam] : []

      return searchTerm ? nodes.filter(matches) : nodes
    },
    [matches, rootTeam, searchTerm]
  )

  const initialExpandedNodes = useMemo(
    () =>
      rootTeam
        ? [rootTeam.id, ...(rootTeam.children || []).map(team => team.id)]
        : [],
    [rootTeam]
  )

  const closeAddEditModal = () => {
    setEditingTeam(null)
    setNewItemParent(null)
  }

  return {
    rootTeam,
    error,
    loading,
    updatingUserIds,
    updateRoles,
    getChildNodes,
    deleteTeam: useCallback(
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
      [deleteConfirmation, rootTeam]
    ),
    addEditModal: {
      openAdd: useCallback((parent: ITeam) => {
        useState
        setEditingTeam(null)
        setNewItemParent(parent)
      }, []),
      openEdit: (team: ITeam) => setEditingTeam(team),
      close: closeAddEditModal,
      isOpen: !!editingTeam || !!newItemParent,
      submit: async (values: Partial<ITeam> & ICreateBrand) => {
        if (editingTeam && values.id) {
          updateTeam(editingTeam, (await editBrand(values)).data)
          closeAddEditModal()
        } else if (newItemParent) {
          const newTeam = (await addBrand(values, newItemParent.id)).data

          updateTeam(
            newItemParent,
            {
              ...newItemParent,
              children: [...newItemParent.children, newTeam]
            },
            false
          )
          closeAddEditModal()
        }
      },
      validate: values => {
        const errors: { [key in keyof ITeam]?: string } = {}
        const { name } = values

        if (!name || name.length === 0) {
          errors.name = 'Name cannot be empty'
        }

        return errors
      },
      isSubmitting: false,
      team: editingTeam
    },
    initialExpandedNodes
  }
}
