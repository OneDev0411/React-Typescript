import { useState, useMemo } from 'react'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { useSelector } from 'react-redux'

import { getDeal, getForms } from 'actions/deals'
import { IAppState } from 'reducers'

import { selectDealById } from 'reducers/deals/list'

import { useReduxDispatch } from './use-redux-dispatch'

/**
 * returns full dump of deal inclduing its forms
 * @param id - the deal id
 */
export function useLoadFullDeal(id: UUID) {
  const dispatch = useReduxDispatch()

  const deals = useSelector((state: IAppState) => state.deals)
  const deal = useSelector<IAppState, IDeal>(({ deals }) =>
    selectDealById(deals.list, id)
  )

  const { forms } = useMemo(() => {
    return {
      forms: deals.forms
    }
  }, [deals.forms, id])

  const [dealWithChecklists, setDeal] = useState<IDeal | undefined>(deal)
  const [isFetchingCompleted, setIsFetchingCompleted] = useState<boolean>(false)

  const [isFetchingDeal, setIsFetchingDeal] = useState<boolean>(
    !deal || !deal.checklists
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
     * initializes a deal by fetching its checklists and forms
     */
    async function load(): Promise<void> {
      // fetch deal with its checklists
      const fetchedDeal: IDeal = await fetchDeal()

      // fetch deal forms
      await fetchForms(fetchedDeal)

      setIsFetchingCompleted(true)

      setDeal(fetchedDeal)
    }

    load()
  })

  return {
    isFetchingDeal,
    isFetchingForms,
    isFetchingCompleted,
    deal: dealWithChecklists
  }
}
