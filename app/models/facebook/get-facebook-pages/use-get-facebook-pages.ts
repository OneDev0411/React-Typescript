import { UseQueryResult } from 'react-query'

import { useQuery } from '@app/hooks/query'

import { list } from '../query-keys'

import { getFacebookPages } from './get-facebook-pages'

export function useGetFacebookPages(): UseQueryResult<IFacebookPage[]> {
  return useQuery(list(), getFacebookPages)
}
