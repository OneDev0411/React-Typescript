import { useEffect, useCallback, useState } from 'react'

import { ALL_MC_MEDIUMS } from '@app/components/Pages/Dashboard/Marketing/hooks/use-templates'
import { getBrandMarketingCategories } from '@app/models/brand/get-brand-marketing-categories'
import { compare } from 'utils/helpers'

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

function sortMediums(
  mediums: IMarketingTemplateMedium[]
): IMarketingTemplateMedium[] {
  return mediums
    .sort((a, b) =>
      compare(
        MARKETING_TEMPLATE_MEDIUM_PRIORITY[b],
        MARKETING_TEMPLATE_MEDIUM_PRIORITY[a]
      )
    )
    .reverse()
}

interface UseMarketingCenterCategories {
  refetch: () => void
  categories: IMarketingTemplateCategories
  isLoading: boolean
}

export function useMarketingCenterCategories(
  brandId: UUID,
  mediums: IMarketingTemplateMedium[] = ALL_MC_MEDIUMS,
  templateTypes?: IMarketingTemplateType[]
): UseMarketingCenterCategories {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<IMarketingTemplateCategories>({})

  const fetchMarketingCategories = useCallback(async () => {
    setIsLoading(true)

    try {
      const loadedCategories = await getBrandMarketingCategories(brandId, {
        mediums,
        templateTypes
      })

      const orderedMediums: IMarketingTemplateCategories = {}

      loadedCategories.forEach(category => {
        orderedMediums[category.template_type] = {
          label: category.label,
          mediums: sortMediums(
            Object.keys(category.medium_stats) as IMarketingTemplateMedium[]
          )
        }
      })

      setCategories(orderedMediums)
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }, [brandId, mediums, templateTypes])

  useEffect(() => {
    fetchMarketingCategories()
  }, [fetchMarketingCategories])

  return {
    categories,
    isLoading,
    refetch: fetchMarketingCategories
  }
}
