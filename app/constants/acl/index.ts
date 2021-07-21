export type AccessRecord = Record<
  | 'CRM'
  | 'ADMIN'
  | 'DEALS'
  | 'BACK_OFFICE'
  | 'MARKETING'
  | 'STORE'
  | 'BETA'
  | 'AGENT_NETWORK'
  | 'WEBSITES'
  | 'SHOWINGS',
  IPermission
>
export const ACL: AccessRecord = {
  CRM: 'CRM',
  ADMIN: 'Admin',
  DEALS: 'Deals',
  BACK_OFFICE: 'BackOffice',
  MARKETING: 'Marketing',
  STORE: 'STORE',
  BETA: 'BetaFeatures',
  AGENT_NETWORK: 'AgentNetwork',
  WEBSITES: 'Websites',
  SHOWINGS: 'Showings'
}
