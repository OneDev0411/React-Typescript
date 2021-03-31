function getFlatAddressComponentsObject(
  components: google.maps.GeocoderAddressComponent[]
): StringMap<string> {
  return components.reduce<StringMap<string>>(
    (flatAddrObj, component) => ({
      ...flatAddrObj,
      ...component.types.reduce(
        (acc, type) => ({
          ...acc,
          [type]: component.long_name
        }),
        {}
      )
    }),
    {}
  )
}

export function getStdAddrFromAddressComponents(
  addressComponents: google.maps.GeocoderResult['address_components']
): IStdAddr {
  const result: IStdAddr = {
    city: '',
    name: '',
    unit: '',
    state: '',
    predir: '',
    suftype: '',
    postcode: '',
    house_num: '',
    country: '',
    building: '',
    qual: '',
    pretype: '',
    sufdir: '',
    extra: '',
    box: '',
    ruralroute: '',
    line1: '',
    line2: '',
    full: ''
  }

  const flatAddressComponentsObject = getFlatAddressComponentsObject(
    addressComponents
  )

  const keyMap: Partial<Record<keyof IStdAddr, string>> = {
    city: 'locality',
    name: 'route',
    state: 'administrative_area_level_1',
    postcode: 'postal_code',
    house_num: 'street_number',
    country: 'country'
  }

  const stdAddr = Object.keys(keyMap).reduce(
    (stdAddr, stdAddrKey) => ({
      ...stdAddr,
      [stdAddrKey]: flatAddressComponentsObject[keyMap[stdAddrKey]]
    }),
    result
  )

  const nameRegex = /^(North|South|East|West)\s(.*)$/
  const match = stdAddr.name.match(nameRegex)

  if (match) {
    stdAddr.predir = match[1]
    stdAddr.name = match[2]
  }

  return stdAddr
}

export function getFullAddressFromSrdAddr(stdAddr: IStdAddr) {
  return [
    stdAddr.house_num,
    stdAddr.name,
    stdAddr.suftype,
    stdAddr.city,
    stdAddr.state,
    stdAddr.postcode
  ].join(' ')
}
