import { getActivePropertyGroups } from './get-active-property-groups'

describe('getActivePropertyGroups', () => {
  it('should return an array of active property groups when sale and lease both are active', () => {
    const selectedPropertyTypes = ['1', '2', '3']
    const propertyTypes = [
      {
        id: '1',
        is_lease: false
      },
      {
        id: '2',
        is_lease: true
      },
      {
        id: '3',
        is_lease: false
      }
    ] as IDealPropertyType[]

    const result = getActivePropertyGroups(selectedPropertyTypes, propertyTypes)

    expect(result).toEqual(['sale', 'lease'])
  })

  it('should return an array of active property groups when only lease is active', () => {
    const selectedPropertyTypes = ['1', '2']
    const propertyTypes = [
      {
        id: '1',
        is_lease: true
      },
      {
        id: '2',
        is_lease: true
      },
      {
        id: '5',
        is_lease: false
      }
    ] as IDealPropertyType[]

    const result = getActivePropertyGroups(selectedPropertyTypes, propertyTypes)

    expect(result).toEqual(['lease'])
  })

  it('should return an array of active property groups when only sale is active', () => {
    const selectedPropertyTypes = ['1', '2']
    const propertyTypes = [
      {
        id: '1',
        is_lease: false
      },
      {
        id: '5',
        is_lease: false
      }
    ] as IDealPropertyType[]

    const result = getActivePropertyGroups(selectedPropertyTypes, propertyTypes)

    expect(result).toEqual(['sale'])
  })

  it('should return an empty array when selectedPropertyTypes is empty', () => {
    const selectedPropertyTypes = []
    const propertyTypes = [
      {
        id: '1',
        is_lease: true
      },
      {
        id: '5',
        is_lease: false
      }
    ] as IDealPropertyType[]

    const result = getActivePropertyGroups(selectedPropertyTypes, propertyTypes)

    expect(result).toEqual([])
  })

  it('should return an empty array when propertyTypes is empty', () => {
    const selectedPropertyTypes = ['1', '9']
    const propertyTypes = [] as IDealPropertyType[]

    const result = getActivePropertyGroups(selectedPropertyTypes, propertyTypes)

    expect(result).toEqual([])
  })

  it('should return an empty array when selectedPropertyTypes has wrong value ', () => {
    const selectedPropertyTypes = ['45', '28']
    const propertyTypes = [
      {
        id: '1',
        is_lease: false
      },
      {
        id: '5',
        is_lease: false
      }
    ] as IDealPropertyType[]

    const result = getActivePropertyGroups(selectedPropertyTypes, propertyTypes)

    expect(result).toEqual([])
  })
})
