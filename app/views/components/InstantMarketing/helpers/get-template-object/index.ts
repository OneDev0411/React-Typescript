export default function getTemplateObject(
  template: IMarketingTemplate | IBrandMarketingTemplate
): IMarketingTemplate {
  if (template.type === 'brand_template') {
    return template.template
  }

  return template
}
