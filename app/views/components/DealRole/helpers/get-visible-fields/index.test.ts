import getVisibleFields from '.'

describe('Test Deal Role get-visible-fields helper', () => {
  it('Should return legal_names when role is Title', () => {
    const visibleFields = getVisibleFields({
      role: 'Title'
    })

    expect(visibleFields).toContainEqual('legal_first_name')
    expect(visibleFields).toContainEqual('legal_last_name')
  })
})
