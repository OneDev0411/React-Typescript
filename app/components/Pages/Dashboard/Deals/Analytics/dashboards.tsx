const production = {
  label: 'Production & Volume',
  id: '4aa9824f-d0c5-4e74-8a83-dbe5079c3073'
}

const agents = {
  label: 'Agents',
  id: '0385fcae-5261-4154-b29a-93fd4cc29ef5'
}

const offices = {
  label: 'Offices',
  id: '6eb0ab32-584b-4bea-ac4e-2aedd0f5daed'
}

const regions = {
  label: 'Regions',
  id: '0990a210-4ee9-40da-8a77-43f2eef70c31'
}

const dashboards = {
  'Brokerage': { production, regions, offices },
  'Region': { production, offices },
  'Office': { production, agents },
  'Team': { production, agents },
  'Personal': { production }
}

export default dashboards
