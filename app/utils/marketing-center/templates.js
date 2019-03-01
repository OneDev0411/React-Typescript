import nunjucks from 'nunjucks'
import flattenBrand from 'utils/flatten-brand'

const BRAND_STYLES_TEMPLATE = `<style>
.alpha-bg {
  background: {{ brand.palette.marketing.alpha.bg }};
}

.alpha-text-a {
  color: {{ brand.palette.marketing.alpha.ta }};
}

.beta-bg {
  background: {{ brand.palette.marketing.beta.bg }};
}

.beta-text-a {
  color: {{ brand.palette.marketing.beta.ta }};
}

.beta-text-b {
  color: {{ brand.palette.marketing.beta.tb }};
}

.theta-bg {
  background: {{ brand.palette.marketing.theta.bg }};
}

.theta-text-a {
  color: {{ brand.palette.marketing.theta.ta }};
}

.theta-text-b {
  color: {{ brand.palette.marketing.theta.tb }};
}

.test-rechat {
  color: {{ brand.palette.primary }};
}

</style>`

export function getBrandStyles(brand) {
  const brandData = flattenBrand(brand)
  return nunjucks.renderString(BRAND_STYLES_TEMPLATE, { brand: brandData })
}
