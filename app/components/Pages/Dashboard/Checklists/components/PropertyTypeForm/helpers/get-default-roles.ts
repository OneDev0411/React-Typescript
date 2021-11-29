export function getDefaultRoles(lease: boolean) {
  if (lease) {
    return {
      BuyerAgent: true,
      SellerAgent: true,
      Tenant: true,
      Landlord: true,
      CoBuyerAgent: false,
      CoSellerAgent: false,
      TenantPowerOfAttorney: false,
      LandlordPowerOfAttorney: false,
      Lawyer: false,
      TeamLead: false
    }
  }

  return {
    Buyer: true,
    BuyerAgent: true,
    Seller: true,
    SellerAgent: true,
    CoBuyerAgent: false,
    BuyerPowerOfAttorney: false,
    BuyerLawyer: false,
    BuyerReferral: false,
    CoSellerAgent: false,
    SellerPowerOfAttorney: false,
    SellerLawyer: false,
    SellerReferral: false,
    Title: false,
    Lender: false,
    Appraiser: false,
    Lawyer: false,
    TeamLead: false
  }
}
