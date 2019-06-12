import { useEffect, useState, useMemo } from 'react'

import { getDeal, getContexts, getForms, setDeals } from 'actions/deals'

import store from '../stores'


export function useLoadDeal(id: string, deal: IDeal) {
  const [isFetchingDeal, setIsFetchingDeal] = useState(false)
  const [isFetchingContexts, setIsFetchingContexts] = useState(false)
  const [isFetchingForms, setIsFetchingForms] = useState(false)
  const [isFetchingCompleted, setIsFetchingCompleted] = useState(false)

  const { contexts, forms } = useMemo(() => {
    const deals = store.getState().deals
    return {
      contexts: deals.contexts,
      forms: deals.forms
    }
  }, [])

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
    const brandId: UUID = deal.brand.id

    if (forms[brandId]) {
      return
    }

    setIsFetchingForms(true)

    try {
      await store.dispatch<any>(getForms(brandId))
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
    // setDeals(fetchedDeal)
  }

  useEffect(() => {
    if (!id) {
      throw new Error(`Can not load deal. id is ${id}`)
    }

    load()
  }, [])

  return {
    isFetchingDeal,
    isFetchingContexts,
    isFetchingForms,
    isFetchingCompleted
  }
}
