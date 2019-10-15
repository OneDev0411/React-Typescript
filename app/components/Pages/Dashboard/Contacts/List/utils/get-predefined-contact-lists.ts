import { getDefaultList } from 'reducers/filter-segments'
import { IAppState } from 'reducers'

export const getPredefinedContactLists = (
  name,
  state: IAppState,
  includeDefaultList = true
): StringMap<ISavedSegment> => {
  const predefinedLists: StringMap<ISavedSegment<IContactAttributeFilter>> = {}

  if (includeDefaultList) {
    predefinedLists.default = getDefaultList(name)
  }

  return predefinedLists
}
