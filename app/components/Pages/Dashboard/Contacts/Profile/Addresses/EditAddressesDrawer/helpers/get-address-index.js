export function getAddressIndex(addressesFields) {
  if (addressesFields.length > 0) {
    const index = addressesFields
      .filter(({ index }) => index != null)
      .map(({ index }) => index)
      .reduce((a, b) => (a >= b ? a : b))

    return index + 1
  }

  return 0
}
