import liveSeller from 'fixtures/deal/live-seller'
import liveBuyer from 'fixtures/deal/live-buyer'
import liveSellerWithActiveOffer from 'fixtures/deal/seller-with-offer'

import { getStatusList } from '.'

describe('Test deal statuses', () => {
  it('Should return correct list for not-lease seller deals on the agent side', () => {
    const list = getStatusList(liveSeller, false)

    expect(list).toEqual(
      [
        'Coming Soon',
        'Pending',
        'Active Option Contract',
        'Active Contingent',
        'Active Kick Out'
      ]
    )
  })

  it('Should return correct list for not-lease seller deals on the back office side', () => {
    const list = getStatusList(liveSeller, true)

    expect(list).toEqual(
      [
        'Coming Soon',
        'Active',
        'Sold',
        'Pending',
        'Temp Off Market',
        'Active Option Contract',
        'Active Contingent',
        'Active Kick Out',
        'Withdrawn',
        'Expired',
        'Cancelled'
      ]
    )
  })

  it('Should return correct list for lease seller deals on the agent side', () => {
    const list = getStatusList({
      ...liveSeller,
      property_type: 'Residential Lease'
    }, false)

    expect(list).toEqual(
      ['Leased']
    )
  })

  it('Should return correct list for seller deals on the back office side', () => {
    const list = getStatusList({
      ...liveSeller,
      property_type: 'Residential Lease'
    }, true)

    expect(list).toEqual(
      ['Active', 'Temp Off Market', 'Leased', 'Expired', 'Cancelled']
    )
  })

  it('Should return correct list for not-lease buyer deals on the agent side', () => {
    const list = getStatusList(liveBuyer, false)

    expect(list).toEqual(
      [
        'Active Option Contract',
        'Active Contingent',
        'Active Kick Out',
        'Pending',
        'Sold'
      ]
    )
  })

  it('Should return correct list for not-lease buyer deals on the back office side', () => {
    const list = getStatusList(liveBuyer, true)

    expect(list).toEqual(
      [
        'Active Option Contract',
        'Active Contingent',
        'Active Kick Out',
        'Pending',
        'Sold',
        'Contract Terminated'
      ]
    )
  })

  it('Should return correct list for lease buyer deals on the agent side', () => {
    const list = getStatusList({
      ...liveBuyer,
      property_type: 'Residential Lease'
    }, false)

    expect(list).toEqual(
      ['Lease Contract']
    )
  })

  it('Should return correct list for lease buyer deals on the back office side', () => {
    const list = getStatusList({
      ...liveBuyer,
      property_type: 'Residential Lease'
    }, true)

    expect(list).toEqual(
      ['Contract Terminated', 'Leased', 'Lease Contract']
    )
  })

  it('Should return correct list for not-lease seller deals when has active offer on the back office', () => {
    const list = getStatusList(liveSellerWithActiveOffer, true)

    expect(list).toEqual(
      [
        'Active Option Contract',
        'Active Contingent',
        'Active Kick Out',
        'Pending',
        'Sold',
        'Contract Terminated'
      ]
    )
  })

  it('Should return correct list for not-lease seller deals when has active offer on the agent side', () => {
    const list = getStatusList(liveSellerWithActiveOffer, false)

    expect(list).toEqual(
      [
        'Active Option Contract',
        'Active Contingent',
        'Active Kick Out',
        'Pending',
        'Sold'
      ]
    )
  })

  it('Should return correct list for lease seller deals when has active offer on the back office', () => {
    const list = getStatusList({
      ...liveSellerWithActiveOffer,
      property_type: 'Residential Lease'
    }, true)

    expect(list).toEqual(
      ['Contract Terminated', 'Leased', 'Lease Contract']
    )
  })

  it('Should return correct list for lease seller deals when has active offer on the agent side', () => {
    const list = getStatusList({
      ...liveSellerWithActiveOffer,
      property_type: 'Residential Lease'
    }, false)

    expect(list).toEqual(
      ['Lease Contract']
    )
  })
})
