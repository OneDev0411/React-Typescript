import { useState, useMemo } from 'react'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { useSelector } from 'react-redux'

import { getDeal, getContextsByDeal, getForms } from 'actions/deals'
import { selectContextsByDeal } from 'reducers/deals/contexts'
import { IAppState } from 'reducers'

import { useReduxDispatch } from './use-redux-dispatch'

/**
 * returns full dump of deal inclduing its forms and contexts
 * @param id - the deal id
 * @param deal - the minimal version of the deal
 */
export function useLoadFullDeal(id: string, deal: IDeal) {
  const deals = useSelector((state: IAppState) => state.deals)
  const dispatch = useReduxDispatch()

  const { contexts, forms } = useMemo(() => {
    return {
      contexts: selectContextsByDeal(deals.contexts, id),
      forms: deals.forms
    }
  }, [deals.contexts, deals.forms, id])

  const [dealWithChecklists, setDeal] = useState<IDeal>(deal)
  const [isFetchingCompleted, setIsFetchingCompleted] = useState<boolean>(false)

  const [isFetchingDeal, setIsFetchingDeal] = useState<boolean>(
    !deal || !deal.checklists
  )
  const [isFetchingContexts, setIsFetchingContexts] = useState<boolean>(
    !contexts
  )
  const [isFetchingForms, setIsFetchingForms] = useState<boolean>(!forms[id])

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
      const result: IDeal = await dispatch(getDeal(id))

      setIsFetchingDeal(false)

      return result
    }

    /**
     * fetches contexts of a deal
     */
    async function fetchContexts(deal: IDeal): Promise<void> {
      if (contexts) {
        return
      }

      setIsFetchingContexts(true)

      try {
        await dispatch(getContextsByDeal(deal.id))
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
        await dispatch(getForms(deal.id))
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
