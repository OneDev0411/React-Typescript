export function getNewAddressIndex(addresses, arrayfields) {
  const addressesLength = addresses.length
  const arrayFieldsLength = arrayfields.value.length

  if (addressesLength === 0) {
    return arrayFieldsLength + 1
  }

  const currentIndex = addresses
    .filter(({ index }) => index != null)
    .map(({ index }) => index)
    .reduce((a, b) => (a >= b ? a : b))

  return currentIndex + (arrayFieldsLength - addressesLength) + 1
}
