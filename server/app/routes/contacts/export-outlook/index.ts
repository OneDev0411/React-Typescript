import { AxiosError, AxiosResponse } from 'axios'
import { Request, Response, NextFunction } from 'express'

import { getParsedHeaders } from '../../../utils/parse-headers'
import { request } from '../../../libs/request'

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    ids,
    filters,
    flows,
    crm_tasks: crmTasks,
    excludes,
    users,
    type,
    searchText,
    filter_type: filterType = 'and'
  } = req.body

  const data = ids
    ? normalizeIds(ids)
    : createFilters(filters, flows, crmTasks, excludes, searchText)

  const usersList = Array.isArray(users)
    ? `&users[]=${users.join('&users[]=')}`
    : `&users[]=${users}`

  const query = `filter_type=${filterType}&format=csv${usersList}`

  request({
    responseType: 'stream',
    url: `/analytics/${type}/facts?${query}`,
    headers: {
      ...getParsedHeaders(req),
      'X-RECHAT-BRAND': req.params.brand
    },
    data
  })
    .then((response: AxiosResponse) => response.data.pipe(res))
    .catch((e: AxiosError) => {
      res.status(e.response?.status || 400)
      e.response && e.response.data.pipe(res)
    })
}

/**
 *
 */
function normalizeIds(input: string | string[]) {
  return Array.isArray(input) ? input : [input]
}

/**
 *
 */
function createFilters(
  filters: string[],
  flows: string[],
  crmTasks: string[],
  excludes: string[] = [],
  searchText: string = ''
) {
  return {
    filter: Array.isArray(filters) && filters.length ? filters : undefined,
    excludes: Array.isArray(excludes) && excludes.length ? excludes : undefined,
    crmTasks: Array.isArray(crmTasks) && crmTasks.length ? crmTasks : undefined,
    flows: Array.isArray(flows) && flows.length ? flows : undefined,
    query: searchText.length > 0 ? searchText : undefined
  }
}
