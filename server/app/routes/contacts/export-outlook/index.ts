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

  const query = `filter_type=${filterType}&format=csv${getUsersList(users)}`

  request(req, {
    method: 'POST',
    responseType: 'stream',
    url: `/analytics/${type}/facts?${query}`,
    headers: {
      ...getParsedHeaders(req),
      'x-rechat-brand': req.params.brand
    },
    data
  })
    .then((response: AxiosResponse) => {
      res.set({
        ...response.headers,
        'x-rechat-filename': response.headers['content-disposition']
          .split('"')
          .join('')
          .split('filename=')
          .pop()
      })

      response.data.pipe(res)
    })
    .catch((e: AxiosError) => {
      res.status(e.response?.status || 400)
      e.response && e.response.data.pipe(res)
    })
}

/**
 *
 */
function getUsersList(users: string | string[] | undefined) {
  if (Array.isArray(users)) {
    return `&users[]=${users.join('&users[]=')}`
  }

  if (typeof users === 'string') {
    return `&users[]=${users}`
  }

  return ''
}

/**
 *
 */
function normalizeIds(ids: string | string[]) {
  return {
    ids: Array.isArray(ids) ? ids : [ids]
  }
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
  return Object.entries({
    filter: Array.isArray(filters) && filters.length ? filters : undefined,
    excludes: Array.isArray(excludes) && excludes.length ? excludes : undefined,
    crmTasks: Array.isArray(crmTasks) && crmTasks.length ? crmTasks : undefined,
    flows: Array.isArray(flows) && flows.length ? flows : undefined,
    query: searchText.length > 0 ? searchText : undefined
  }).reduce((acc, [key, value]) => {
    if (value === undefined) {
      return acc
    }

    return {
      ...acc,
      [key]: value
    }
  }, {})
}
