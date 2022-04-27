import MockDate from 'mockdate'

import { createAppcuesAccessList, createAppcuesUserData } from './helpers'
import { AppcuesUserInfo, AppcuesUserAccessList } from './types'

describe('createAppcuesAccessList', () => {
  let defaultUserAcl: AppcuesUserAccessList

  beforeEach(() => {
    defaultUserAcl = {
      hasAdminAccess: false,
      hasAgentNetworkAccess: false,
      hasBackOfficeAccess: false,
      hasBetaFeaturesAccess: false,
      hasCRMAccess: false,
      hasDealsAccess: false,
      hasMarketingAccess: false,
      hasShowingsAccess: false,
      hasSTOREAccess: false,
      hasWebsitesAccess: false,
      hasShareToInstagramAccess: false
    }
  })

  it('should work when user has some access', () => {
    const userACL: IPermission[] = [
      'CRM',
      'Admin',
      'Deals',
      'BackOffice',
      'Marketing',
      'STORE'
    ]

    const expected: AppcuesUserAccessList = {
      hasAdminAccess: true,
      hasAgentNetworkAccess: false,
      hasBackOfficeAccess: true,
      hasBetaFeaturesAccess: false,
      hasCRMAccess: true,
      hasDealsAccess: true,
      hasMarketingAccess: true,
      hasShowingsAccess: false,
      hasSTOREAccess: true,
      hasWebsitesAccess: false,
      hasShareToInstagramAccess: false
    }
    const actual = createAppcuesAccessList(userACL, defaultUserAcl)

    expect(actual).toEqual(expected)
  })

  it('should work when user has all', () => {
    const userACL: IPermission[] = [
      'Admin',
      'AgentNetwork',
      'BackOffice',
      'BetaFeatures',
      'CRM',
      'Deals',
      'Marketing',
      'STORE',
      'Showings',
      'Websites'
    ]

    const expected: AppcuesUserAccessList = {
      hasAdminAccess: true,
      hasAgentNetworkAccess: true,
      hasBackOfficeAccess: true,
      hasBetaFeaturesAccess: true,
      hasCRMAccess: true,
      hasDealsAccess: true,
      hasMarketingAccess: true,
      hasShowingsAccess: true,
      hasSTOREAccess: true,
      hasWebsitesAccess: true,
      hasShareToInstagramAccess: false
    }
    const actual = createAppcuesAccessList(userACL, defaultUserAcl)

    expect(actual).toEqual(expected)
  })

  it('should work when user has no access', () => {
    const userACL: IPermission[] = []

    const expected: AppcuesUserAccessList = {
      hasAdminAccess: false,
      hasAgentNetworkAccess: false,
      hasBackOfficeAccess: false,
      hasBetaFeaturesAccess: false,
      hasCRMAccess: false,
      hasDealsAccess: false,
      hasMarketingAccess: false,
      hasShowingsAccess: false,
      hasSTOREAccess: false,
      hasWebsitesAccess: false,
      hasShareToInstagramAccess: false
    }
    const actual = createAppcuesAccessList(userACL, defaultUserAcl)

    expect(actual).toEqual(expected)
  })
})

describe('createAppcuesUserData', () => {
  beforeEach(() => {
    // Set a random date for `new Date()`
    MockDate.set(new Date('2021-05-16T11:59:59.000Z'))
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should work when user created 5 days ago', () => {
    const gmailOrOutlookSynced = false

    const userInfo: AppcuesUserInfo = {
      firstName: 'some first name',
      fullName: 'some first name lastnameian',
      email: 'email@test.com',
      userType: 'Admin',
      createdAt: new Date('2021-05-11T11:59:59.000Z').getTime() / 1000
    }

    const appcuesAccessList: AppcuesUserAccessList = {
      hasAdminAccess: false,
      hasAgentNetworkAccess: false,
      hasBackOfficeAccess: false,
      hasBetaFeaturesAccess: false,
      hasCRMAccess: false,
      hasDealsAccess: false,
      hasMarketingAccess: false,
      hasShowingsAccess: false,
      hasSTOREAccess: false,
      hasWebsitesAccess: false,
      hasShareToInstagramAccess: false
    }

    const appcuesBrandsList = {
      Team: '1'
    }

    const expected = {
      firstName: 'some first name',
      fullName: 'some first name lastnameian',
      email: 'email@test.com',
      userType: 'Admin',
      accountAgeInDays: 5,
      gmailOrOutlookSynced,
      ...appcuesAccessList,
      ...appcuesBrandsList
    }

    const actual = createAppcuesUserData(
      gmailOrOutlookSynced,
      userInfo,
      appcuesAccessList,
      appcuesBrandsList
    )

    expect(actual).toEqual(expected)
  })

  it('should work when user created 1 day ago', () => {
    const gmailOrOutlookSynced = true

    const userInfo: AppcuesUserInfo = {
      firstName: 'some first name',
      fullName: 'some first name lastnameian',
      email: 'email@test.com',
      userType: 'Admin',
      createdAt: new Date('2021-05-15T11:59:59.000Z').getTime() / 1000
    }

    const appcuesAccessList: AppcuesUserAccessList = {
      hasAdminAccess: false,
      hasAgentNetworkAccess: false,
      hasBackOfficeAccess: false,
      hasBetaFeaturesAccess: false,
      hasCRMAccess: false,
      hasDealsAccess: false,
      hasMarketingAccess: false,
      hasShowingsAccess: false,
      hasSTOREAccess: false,
      hasWebsitesAccess: false,
      hasShareToInstagramAccess: false
    }

    const appcuesBrandsList = {
      Team: '1'
    }

    const expected = {
      firstName: 'some first name',
      fullName: 'some first name lastnameian',
      email: 'email@test.com',
      userType: 'Admin',
      accountAgeInDays: 1,
      gmailOrOutlookSynced,
      ...appcuesAccessList,
      ...appcuesBrandsList
    }

    const actual = createAppcuesUserData(
      gmailOrOutlookSynced,
      userInfo,
      appcuesAccessList,
      appcuesBrandsList
    )

    expect(actual).toEqual(expected)
  })

  it('should work when user created today', () => {
    const gmailOrOutlookSynced = true

    const userInfo: AppcuesUserInfo = {
      firstName: 'some first name',
      fullName: 'some first name lastnameian',
      email: 'email@test.com',
      userType: 'Admin',
      createdAt: new Date('2021-05-16T10:59:59.000Z').getTime() / 1000
    }

    const appcuesAccessList: AppcuesUserAccessList = {
      hasAdminAccess: false,
      hasAgentNetworkAccess: false,
      hasBackOfficeAccess: true,
      hasBetaFeaturesAccess: false,
      hasCRMAccess: false,
      hasDealsAccess: false,
      hasMarketingAccess: true,
      hasShowingsAccess: false,
      hasSTOREAccess: false,
      hasWebsitesAccess: false,
      hasShareToInstagramAccess: false
    }

    const appcuesBrandsList = {
      Team: '1'
    }

    const expected = {
      firstName: 'some first name',
      fullName: 'some first name lastnameian',
      email: 'email@test.com',
      userType: 'Admin',
      accountAgeInDays: 0,
      gmailOrOutlookSynced,
      ...appcuesAccessList,
      ...appcuesBrandsList
    }

    const actual = createAppcuesUserData(
      gmailOrOutlookSynced,
      userInfo,
      appcuesAccessList,
      appcuesBrandsList
    )

    expect(actual).toEqual(expected)
  })

  it('should work when user has some access', () => {
    const gmailOrOutlookSynced = true

    const userInfo: AppcuesUserInfo = {
      firstName: 'some first name',
      fullName: 'some first name lastnameian',
      email: 'email@test.com',
      userType: 'Admin',
      createdAt: new Date('2021-05-11T11:59:59.000Z').getTime() / 1000
    }

    const appcuesAccessList: AppcuesUserAccessList = {
      hasAdminAccess: false,
      hasAgentNetworkAccess: true,
      hasBackOfficeAccess: false,
      hasBetaFeaturesAccess: false,
      hasCRMAccess: false,
      hasDealsAccess: false,
      hasMarketingAccess: true,
      hasShowingsAccess: true,
      hasSTOREAccess: true,
      hasWebsitesAccess: false,
      hasShareToInstagramAccess: false
    }

    const appcuesBrandsList = {
      Team: '1'
    }

    const expected = {
      firstName: 'some first name',
      fullName: 'some first name lastnameian',
      email: 'email@test.com',
      userType: 'Admin',
      accountAgeInDays: 5,
      gmailOrOutlookSynced,
      ...appcuesAccessList,
      ...appcuesBrandsList
    }

    const actual = createAppcuesUserData(
      gmailOrOutlookSynced,
      userInfo,
      appcuesAccessList,
      appcuesBrandsList
    )

    expect(actual).toEqual(expected)
  })

  it('should work when user has all access', () => {
    const gmailOrOutlookSynced = true

    const userInfo: AppcuesUserInfo = {
      firstName: 'some first name',
      fullName: 'some first name lastnameian',
      email: 'email@test.com',
      userType: 'Admin',
      createdAt: new Date('2021-05-11T11:59:59.000Z').getTime() / 1000
    }

    const appcuesAccessList: AppcuesUserAccessList = {
      hasAdminAccess: true,
      hasAgentNetworkAccess: true,
      hasBackOfficeAccess: true,
      hasBetaFeaturesAccess: true,
      hasCRMAccess: true,
      hasDealsAccess: true,
      hasMarketingAccess: true,
      hasShowingsAccess: true,
      hasSTOREAccess: true,
      hasWebsitesAccess: true,
      hasShareToInstagramAccess: false
    }

    const appcuesBrandsList = {
      Team: '1'
    }

    const expected = {
      firstName: 'some first name',
      fullName: 'some first name lastnameian',
      email: 'email@test.com',
      userType: 'Admin',
      accountAgeInDays: 5,
      gmailOrOutlookSynced,
      ...appcuesAccessList,
      ...appcuesBrandsList
    }

    const actual = createAppcuesUserData(
      gmailOrOutlookSynced,
      userInfo,
      appcuesAccessList,
      appcuesBrandsList
    )

    expect(actual).toEqual(expected)
  })

  it('should work when user has no access', () => {
    const gmailOrOutlookSynced = true

    const userInfo: AppcuesUserInfo = {
      firstName: 'some first name',
      fullName: 'some first name lastnameian',
      email: 'email@test.com',
      userType: 'Admin',
      createdAt: new Date('2021-05-11T11:59:59.000Z').getTime() / 1000
    }

    const appcuesAccessList: AppcuesUserAccessList = {
      hasAdminAccess: false,
      hasAgentNetworkAccess: false,
      hasBackOfficeAccess: false,
      hasBetaFeaturesAccess: false,
      hasCRMAccess: false,
      hasDealsAccess: false,
      hasMarketingAccess: false,
      hasShowingsAccess: false,
      hasSTOREAccess: false,
      hasWebsitesAccess: false,
      hasShareToInstagramAccess: false
    }

    const appcuesBrandsList = {
      Team: '1'
    }

    const expected = {
      firstName: 'some first name',
      fullName: 'some first name lastnameian',
      email: 'email@test.com',
      userType: 'Admin',
      accountAgeInDays: 5,
      gmailOrOutlookSynced,
      ...appcuesAccessList,
      ...appcuesBrandsList
    }

    const actual = createAppcuesUserData(
      gmailOrOutlookSynced,
      userInfo,
      appcuesAccessList,
      appcuesBrandsList
    )

    expect(actual).toEqual(expected)
  })
})
