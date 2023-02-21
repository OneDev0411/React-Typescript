export type AccessRecord = Record<
  | 'CRM'
  | 'ADMIN'
  | 'DEALS'
  | 'BACK_OFFICE'
  | 'MARKETING'
  | 'BETA'
  | 'AGENT_NETWORK'
  | 'WEBSITES'
  | 'SHOWINGS'
  | 'LEAD_ASSIGNMENT',
  IPermission
>
export const ACL: AccessRecord = {
  CRM: 'CRM',
  ADMIN: 'Admin',
  DEALS: 'Deals',
  BACK_OFFICE: 'BackOffice',
  MARKETING: 'Marketing',
  BETA: 'BetaFeatures',
  AGENT_NETWORK: 'AgentNetwork',
  WEBSITES: 'Websites',
  SHOWINGS: 'Showings',
  LEAD_ASSIGNMENT: 'LeadAssignment'
}
