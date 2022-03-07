import { QueryClient } from 'react-query'

import { updateCacheActions, UpdateCachePromise } from '@app/utils/react-query'

import { allList, myList } from '../query-keys/enrollment'

export async function updateCacheAllList(
  queryClient: QueryClient,
  superCampaignId: UUID,
  enrollments: Omit<ISuperCampaignEnrollmentInput, 'tags'>[],
  update: Partial<ISuperCampaignEnrollment<'user' | 'brand'>>
): UpdateCachePromise {
  return updateCacheActions<ISuperCampaignEnrollment<'user' | 'brand'>[]>(
    queryClient,
    allList(superCampaignId),
    prevEnrollments =>
      prevEnrollments.forEach(prevEnrollment => {
        const found = !!enrollments.find(
          item =>
            item.user === prevEnrollment.user.id &&
            item.brand === prevEnrollment.brand.id
        )

        if (!found) {
          return
        }

        Object.assign(prevEnrollment, update)
      })
  )
}

export async function updateCacheMyList(
  queryClient: QueryClient,
  superCampaignId: UUID,
  update: Partial<ISuperCampaignEnrollment>
): UpdateCachePromise {
  return updateCacheActions<ISuperCampaignEnrollment[]>(
    queryClient,
    myList(),
    prevEnrollments =>
      prevEnrollments.forEach(prevEnrollment => {
        if (prevEnrollment.super_campaign !== superCampaignId) {
          return
        }

        Object.assign(prevEnrollment, update)
      })
  )
}

export async function deleteFromCacheAllList(
  queryClient: QueryClient,
  superCampaignId: UUID
): UpdateCachePromise {
  return updateCacheActions<ISuperCampaignEnrollment[]>(
    queryClient,
    allList(superCampaignId),
    enrollments => {
      const index = enrollments.findIndex(
        element => element.super_campaign === superCampaignId
      )

      if (index === -1) {
        return
      }

      enrollments.splice(index, 1)
    }
  )
}

export async function deleteFromCacheMyList(
  queryClient: QueryClient,
  superCampaignId: UUID
): UpdateCachePromise {
  return updateCacheActions<ISuperCampaignEnrollment[]>(
    queryClient,
    myList(),
    enrollments => {
      const index = enrollments.findIndex(
        element => element.super_campaign === superCampaignId
      )

      if (index === -1) {
        return
      }

      enrollments.splice(index, 1)
    }
  )
}

export async function appendToCacheMyList(
  queryClient: QueryClient,
  enrollment: ISuperCampaignEnrollment
): UpdateCachePromise {
  return updateCacheActions<ISuperCampaignEnrollment[]>(
    queryClient,
    myList(),
    enrollments => {
      enrollments.push(enrollment)
    }
  )
}
