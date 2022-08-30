import { useEffect, useState } from 'react'

import _groupBy from 'lodash/groupBy'
import { useDeepCompareEffect } from 'react-use'

import { getBrandMarketingCategories } from '@app/models/brand/get-brand-marketing-categories'
import { notNull } from '@app/utils/ts-utils'
import { compare, onlyUnique } from 'utils/helpers'

import { useActiveBrandId } from './brand'

const MARKETING_TEMPLATE_MEDIUM_PRIORITY: Record<
  IMarketingTemplateMedium,
  number
> = {
  Social: 1,
  InstagramStory: 2,
  FacebookCover: 3,
  LinkedInCover: 3,
  RealtorCover: 3,
  TwitterCover: 3,
  YouTubeCover: 3,
  Letter: 4,
  Email: 5,
  Website: 6
}

function getFormattedUniqueMediums(
  templatesOrAssets: (IBrandMarketingTemplate | IBrandAsset)[]
): IMarketingTemplateMedium[] {
  const mediums = templatesOrAssets
    .map(templateOrAsset => {
      return templateOrAsset.type === 'brand_template'
        ? templateOrAsset.template.medium
        : templateOrAsset.medium
    })
    .filter(notNull)

  return mediums
    .filter(onlyUnique)
    .sort((a, b) =>
      compare(
        MARKETING_TEMPLATE_MEDIUM_PRIORITY[b],
        MARKETING_TEMPLATE_MEDIUM_PRIORITY[a]
      )
    )
    .reverse()
}

export type IMarketingCategories = {
  [key: string]: IMarketingTemplateMedium[]
}

export function useMarketingCenterMediums(
  templates: IBrandMarketingTemplate[],
  brandAssets: IBrandAsset[] = []
): IMarketingCategories {
  const [mediums, setMediums] = useState<IMarketingCategories>({})
  const activeBrandId = useActiveBrandId()

  useEffect(() => {
    async function getNewCategories() {
      const newCategories = await getBrandMarketingCategories(activeBrandId)

      console.log({ newCategories })
    }
    getNewCategories()
  }, [activeBrandId])

  useDeepCompareEffect(() => {
    if (
      (!templates || templates.length === 0) &&
      (!brandAssets || brandAssets.length === 0)
    ) {
      setMediums({})

      return
    }

    const groupedTemplatesAndAssetsByType = _groupBy(
      [...templates, ...brandAssets],
      i => {
        return i.type === 'brand_template'
          ? i.template.template_type
          : i.template_type
      }
    )

    const newMediums: IMarketingCategories = {}

    Object.keys(groupedTemplatesAndAssetsByType).forEach(key => {
      newMediums[key] = getFormattedUniqueMediums(
        groupedTemplatesAndAssetsByType[key]
      )
    })

    setMediums(newMediums)
  }, [templates, brandAssets])

  console.log({ oldCategories: mediums })

  return mediums
}
