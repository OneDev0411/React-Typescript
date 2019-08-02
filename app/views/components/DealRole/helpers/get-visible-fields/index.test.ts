import getVisibleFields from '.'

describe('Test Deal Role get-visible-fields helper', () => {
  it('Should return legal_names when role is Title', () => {
    const visibleFields = getVisibleFields({
      role: 'Title'
    })

    expect(visibleFields).toContainEqual('legal_first_name')
    expect(visibleFields).toContainEqual('legal_last_name')
  })

  it('Should show addresses when role is Landlord', () => {
    const visibleFields = getVisibleFields({
      role: 'Landlord'
    })

    expect(visibleFields).toContainEqual('current_address')
    expect(visibleFields).toContainEqual('future_address')
  })
})
