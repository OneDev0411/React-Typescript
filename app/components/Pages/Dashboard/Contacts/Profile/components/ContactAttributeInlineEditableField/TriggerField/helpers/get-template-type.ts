/**
 * return the attribute trigger
 * @param {string} attributeName - all attributes definitions
 */

export const getTemplateType = (
  attributeName: string
): MarketingTemplateType[] => {
  // birthday attribute
  if (['birthday', 'child_birthday'].includes(attributeName)) {
    return ['Birthday']
  }

  // wedding attribute
  if (attributeName === 'wedding_anniversary') {
    return ['WeddingAnniversary']
  }

  // home attribute
  if (attributeName === 'home_anniversary') {
    return ['HomeAnniversary']
  }

  return ['Contact']
}
