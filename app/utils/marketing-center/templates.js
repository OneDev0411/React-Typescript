import nunjucks from 'nunjucks'
import flattenBrand from 'utils/flatten-brand'

const BRAND_STYLES_TEMPLATE = `<style>
.alpha-bg {
  background: {{ brand.palette.marketing.alpha.bg }};
}

.alpha-ta {
  color: {{ brand.palette.marketing.alpha.ta }};
}

.beta-bg {
  background: {{ brand.palette.marketing.beta.bg }};
}

.beta-ta {
  color: {{ brand.palette.marketing.beta.ta }};
}

.beta-tb {
  color: {{ brand.palette.marketing.beta.tb }};
}

.theta-bg {
  background: {{ brand.palette.marketing.theta.bg }};
}

.theta-ta {
  color: {{ brand.palette.marketing.theta.ta }};
}

.theta-tb {
  color: {{ brand.palette.marketing.theta.tb }};
}

.test-rechat {
  color: {{ brand.palette.primary }};
}

</style>`

export function getBrandStyles(brand) {
  const brandData = flattenBrand(brand)
  console.log('BRAND DATA', brandData)
  return nunjucks.renderString(BRAND_STYLES_TEMPLATE, { brand: brandData })
}
