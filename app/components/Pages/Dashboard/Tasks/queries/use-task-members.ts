import { uniqBy } from 'lodash'

import { useQuery } from '@app/hooks/query'
import { getBrandById } from '@app/models/brand/get-brand-by-id'
import { getBrandUsers } from '@app/utils/user-teams'

import { taskMembers } from './keys'

export function useTaskMembers(id?: UUID) {
  const { data, ...params } = useQuery(
    [...taskMembers(), id],
    () => getBrandById(id),
    {}
  )

  return {
    ...params,
    data: data ? uniqBy(getBrandUsers(data), 'id') : undefined
  }
}
