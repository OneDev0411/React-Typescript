import memoize from 'lodash/memoize'
import uniqBy from 'lodash/uniqBy'
import Fuse from 'fuse.js'

import { getBrandUsers, isActiveTeamTraining } from 'utils/user-teams'

import type { NormalizedBrand } from '../../types'

const isTrainingOffice = memoize(
  office => {
    let current = office

    do {
      if (current.training) {
        return true
      }

      current = current.parent
    } while (current !== null)

    return false
  },
  office => office.id
)

const getSubtitle = memoize(
  office => {
    const names: string[] = []
    let currentOffice = office

    while (currentOffice.parent !== null) {
      names.push(currentOffice.name)
      currentOffice = currentOffice.parent
    }

    return names.length > 1 ? names.reverse().slice(0, -1).join(' > ') : ''
  },
  office => office.id
)

export function normalizeTeams(
  user: IUser,
  teams: IBrand[],
  flattened: boolean,
  searchTerm: string
): NormalizedBrand[] {
  const isTraining = isActiveTeamTraining(user)

  const list = teams
    .filter((office: IBrand) => isTrainingOffice(office) === isTraining)
    .map((office: IBrand) => {
      const agents = getBrandUsers(office).map(user => ({
        ...user,
        office: office.name
      }))

      return {
        id: office.id,
        name: office.name,
        subtitle: getSubtitle(office),
        users: searchTerm
          ? new Fuse(agents, {
              keys: ['office', 'display_name', 'email'],
              threshold: 0.1
            }).search(searchTerm)
          : agents
      }
    })

  const filteredList = list.every(office => !office.users.length) ? [] : list

  // merge all teams into one and show them flattened
  if (flattened) {
    return [
      {
        users: uniqBy(
          filteredList.flatMap(team => team.users),
          (user: IUser) => user.id
        )
      }
    ]
  }

  return filteredList
}
