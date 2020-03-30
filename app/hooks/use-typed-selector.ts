import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

export default function useTypedSelector<TSelected>(
  selector: (state: IAppState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
): TSelected {
  return useSelector<IAppState, TSelected>(selector, equalityFn)
}
