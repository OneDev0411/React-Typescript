import { useEffect, useState, useMemo } from 'react'

import { getDeal, getContexts, getForms } from 'actions/deals'

import store from '../stores'


export function useLoadDeal(id: string, deal: IDeal) {
  const [fetchedDeal, setDeal] = useState(deal)
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


  const brandId: UUID = fetchedDeal.brand && fetchedDeal.brand.id

  /**
   * fetches and returns a deal if it's not fetched yet
   */
  async function fetchDeal(): Promise<void> {
    if (deal && deal.checklists) {
      return
    }

    setIsFetchingDeal(true)

    // fetch deal by id
    const result: IDeal = await store.dispatch<any>(getDeal(id))

    setIsFetchingDeal(false)
    setDeal(result)
  }

  /**
   * fetches contexts of a deal
   */
  async function fetchContexts(): Promise<void> {
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
  async function fetchForms() {
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
    await fetchDeal()

    // fetch deal contexts
    await fetchContexts()

    // fetch deal forms
    await fetchForms()

    setIsFetchingCompleted(true)
  }

  useEffect(() => {
    load()
  }, [])

  return {
    isFetchingDeal,
    isFetchingContexts,
    isFetchingForms,
    isFetchingCompleted,
    deal: fetchedDeal
  }
}
