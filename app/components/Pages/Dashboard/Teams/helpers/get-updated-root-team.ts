import { updateTree } from 'utils/tree-utils/update-tree'

export const getUpdatedRootTeam = (
  rootTeam: IBrand,
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
