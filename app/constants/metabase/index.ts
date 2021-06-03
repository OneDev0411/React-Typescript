export interface IDashboard {
  label: string
  id: UUID
}
const production: IDashboard = {
  label: 'Production & Volume',
  id: 'e044be48-42c7-456f-8077-024c93feb99d'
}

const agents: IDashboard = {
  label: 'Agents',
  id: 'c60e73c6-d80f-4d50-af95-ec2949abfcf3'
}

const offices: IDashboard = {
  label: 'Offices',
  id: '57837f90-df58-445e-a845-d5d64f2e89dc'
}

const regions: IDashboard = {
  label: 'Regions',
  id: 'b8547575-54ac-4199-986c-3003e68b4b3d'
}

const dashboards = {
  Brokerage: { production, regions, offices, agents },
  Region: { production, offices, agents },
  Office: { production, agents },
  Team: { production, agents },
  Personal: { production }
}

export default dashboards
