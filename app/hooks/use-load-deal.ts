import { useState, useMemo } from 'react'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { getDeal, getContexts, getForms } from 'actions/deals'

import store from '../stores'

/**
 * returns full dump of deal inclduing its forms and contexts
 * @param id - the deal id
 * @param deal - the minimal version of the deal
 */
export function useLoadFullDeal(id: string, deal: IDeal) {
  const [dealWithChecklists, setDeal] = useState<IDeal>(deal)
  const [isFetchingDeal, setIsFetchingDeal] = useState<boolean>(false)
  const [isFetchingContexts, setIsFetchingContexts] = useState<boolean>(false)
  const [isFetchingForms, setIsFetchingForms] = useState<boolean>(false)
  const [isFetchingCompleted, setIsFetchingCompleted] = useState<boolean>(false)

  const { contexts, forms } = useMemo(() => {
    const deals = store.getState().deals

    return {
      contexts: deals.contexts,
      forms: deals.forms
    }
  }, [])

  useEffectOnce(() => {
    if (!id) {
      throw new Error(`Can not load deal. id is ${id}`)
    }

    /**
     * fetches and returns a deal if it's not fetched yet
     */
    async function fetchDeal(): Promise<IDeal> {
      if (deal && deal.checklists) {
        return deal
      }

      setIsFetchingDeal(true)

      // fetch deal by id
      const result: IDeal = await store.dispatch<any>(getDeal(id))

      setIsFetchingDeal(false)

      return result
    }

    /**
     * fetches contexts of a deal
     */
    async function fetchContexts(deal: IDeal): Promise<void> {
      const brandId: UUID = deal.brand.id

      if (contexts[brandId]) {
        return
      }

      setIsFetchingContexts(true)

      try {
        await store.dispatch<any>(getContexts(brandId))
      } catch (e) {
        console.log(e)
      }

      setIsFetchingContexts(false)
    }

    /**
     * fetches forms of a deal
     */
    async function fetchForms(deal: IDeal): Promise<void> {
      if (forms[deal.id]) {
        return
      }

      setIsFetchingForms(true)

      try {
        await store.dispatch<any>(getForms(deal.id))
      } catch (e) {
        console.log(e)
      }

      setIsFetchingForms(false)
    }

    /**
     * initializes a deal by fetching its checklists, contexts and forms
     */
    async function load(): Promise<void> {
      // fetch deal with its checklists
      const fetchedDeal: IDeal = await fetchDeal()

      // fetch deal contexts
      await fetchContexts(fetchedDeal)

      // fetch deal forms
      await fetchForms(fetchedDeal)

      setIsFetchingCompleted(true)

      setDeal(fetchedDeal)
    }

    load()
  })

  return {
    isFetchingDeal,
    isFetchingContexts,
    isFetchingForms,
    isFetchingCompleted,
    deal: dealWithChecklists
  }
}
