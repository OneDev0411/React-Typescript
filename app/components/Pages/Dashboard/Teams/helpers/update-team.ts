import { updateTree } from 'utils/tree-utils/update-tree'
import { ITeam } from 'models/BrandConsole/types'

export const updateTeam = (
  rootTeam: ITeam,
  team,
  newTeam,
  keepChildren = true
) => {
  if (newTeam !== team) {
    return updateTree(
      rootTeam!,
      aTeam => aTeam === team,
      () => ({
        ...newTeam,
        children: keepChildren ? team.children : newTeam.children
      })
    )
  }

  return rootTeam
}
