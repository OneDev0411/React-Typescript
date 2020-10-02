import nunjucks from 'nunjucks'
import flattenBrand from 'utils/flatten-brand'

export const BRAND_STYLES_TEMPLATE_MJML = `{% if get('body-font-family') %}
  <mj-font name="{{get('body-font-family')}}" href="https://fonts.googleapis.com/css?family={{get('body-font-family') | urlencode}}"></mj-font>
{% endif %}

{% if get('container-font-family') %}
  <mj-font name="{{get('container-font-family')}}" href="https://fonts.googleapis.com/css?family={{get('container-font-family') | urlencode}}"></mj-font>
{% endif %}

{% if get('h1-font-family') %}
  <mj-font name="{{get('h1-font-family')}}" href="https://fonts.googleapis.com/css?family={{get('h1-font-family') | urlencode}}"></mj-font>
{% endif %}

{% if get('h2-font-family') %}
  <mj-font name="{{get('h2-font-family')}}" href="https://fonts.googleapis.com/css?family={{get('h2-font-family') | urlencode}}"></mj-font>
{% endif %}

{% if get('h3-font-family') %}
  <mj-font name="{{get('body-font-family')}}" href="https://fonts.googleapis.com/css?family={{get('h3-font-family') | urlencode}}"></mj-font>
{% endif %}

{% if get('button-font-family') %}
  <mj-font name="{{get('button-font-family')}}" href="https://fonts.googleapis.com/css?family={{get('button-font-family') | urlencode}}"></mj-font>
{% endif %}

<mj-attributes>
  <mj-body
    background-color="{{get('body-bg-color')}}"
  ></mj-body>
  <mj-class
    name="body"
    background-color="{{get('body-bg-color')}}"
    color="{{get('body-text-color')}}"
    font-family="{{get('body-font-family')}}"
    font-weight="{{get('body-font-weight')}}"
    font-size="{{get('body-font-size')}}"
  ></mj-class>
  <mj-class
    name="container"
    background-color="{{get('container-bg-color')}}"
    padding-left="20px"
    padding-right="20px"
  ></mj-class>
  <mj-class
    name="container-text"
    color="{{get('container-text-color')}}"
    font-family="{{get('container-font-family')}}"
    font-weight="{{get('container-font-weight')}}"
    font-size="{{get('container-font-size')}}"
  ></mj-class>
  <mj-class
    name="inverted-container"
    background-color="{{get('inverted-container-bg-color')}}"
    color="{{get('inverted-container-text-color')}}"
    padding-left="20px"
    padding-right="20px"
  ></mj-class>
  <mj-class
    name="h1"
    color="{{get('h1-text-color')}}"
    font-family="{{get('h1-font-family')}}"
    font-weight="{{get('h1-font-weight')}}"
    font-size="{{get('h1-font-size')}}"
  ></mj-class>
  <mj-class
    name="inverted-h1"
    color="{{get('inverted-h1-text-color')}}"
  ></mj-class>
  <mj-class
    name="h2"
    color="{{get('h2-text-color')}}"
    font-family="{{get('h2-font-family')}}"
    font-weight="{{get('h2-font-weight')}}"
    font-size="{{get('h2-font-size')}}"
  ></mj-class>
  <mj-class
    name="inverted-h2"
    color="{{get('inverted-h2-text-color')}}"
  ></mj-class>
  <mj-class
    name="h3"
    color="{{get('h3-text-color')}}"
    font-family="{{get('h3-font-family')}}"
    font-weight="{{get('h3-font-weight')}}"
    font-size="{{get('h3-font-size')}}"
  ></mj-class>
  <mj-class
    name="inverted-h3"
    color="{{get('inverted-h3-text-color')}}"
  ></mj-class>
  <mj-class
    name="light"
    color="{{get('light-text-color')}}"
    font-family="{{get('light-font-family')}}"
    font-weight="{{get('light-font-weight')}}"
    font-size="{{get('light-font-size')}}"
  ></mj-class>
  <mj-class
    name="inverted-light"
    color="{{get('inverted-light-text-color')}}"
  ></mj-class>
  <mj-button
    background-color="{{get('button-bg-color')}}"
    color="{{get('button-text-color')}}"
    font-family="{{get('button-font-family')}}"
    border="{{get('button-border')}}"
    font-weight="{{get('button-font-weight')}}"
    font-size="{{get('button-font-size')}}"
  ></mj-button>
  <mj-class
    name="inverted-button"
    background-color="{{get('inverted-button-bg-color')}}"
    color="{{get('inverted-button-text-color')}}"
  ></mj-class>
</mj-attribues>
`

export const BRAND_STYLES_TEMPLATE_NON_MJML = `
{% if get('body-font-family') %}
  <link href="https://fonts.googleapis.com/css2?family={{get('body-font-family')}}" rel="stylesheet"></link>
{% endif %}

{% if get('body-font-family') %}
  <link href="https://fonts.googleapis.com/css2?family={{get('container-font-family')}}" rel="stylesheet"></link>
{% endif %}

{% if get('body-font-family') %}
  <link href="https://fonts.googleapis.com/css2?family={{get('h1-font-family')}}" rel="stylesheet"></link>
{% endif %}

{% if get('body-font-family') %}
  <link href="https://fonts.googleapis.com/css2?family={{get('h2-font-family')}}" rel="stylesheet"></link>
{% endif %}

{% if get('body-font-family') %}
  <link href="https://fonts.googleapis.com/css2?family={{get('h3-font-family')}}" rel="stylesheet"></link>
{% endif %}

<style>
body {
  background:  {{ get('body-bg-color') }};
  color:       {{ get('body-text-color') }};
  font-family: {{ get('body-font-family') }};
  font-size:   {{ get('body-font-size') }};
  font-weight: {{ get('body-font-weight') }};
}

.container {
  background:  {{ get('container-bg-color') }};
  color:       {{ get('container-text-color') }};
  font-family: {{ get('container-font-family') }};
  font-size:   {{ get('container-font-size') }};
  font-weight: {{ get('container-font-weight') }};
}

.container .light {
  color:       {{ get('light-text-color') }};
  font-family: {{ get('light-font-family') }};
  font-size:   {{ get('light-font-size') }};
  font-weight: {{ get('light-font-weight') }};
}

.container h1 {
  color:       {{ get('h1-text-color') }};
  font-family: {{ get('h1-font-family') }};
  font-size:   {{ get('h1-font-size') }};
  font-weight: {{ get('h1-font-weight') }};
}

.container h2 {
  color:       {{ get('h2-text-color') }};
  font-family: {{ get('h2-font-family') }};
  font-size:   {{ get('h2-font-size') }};
  font-weight: {{ get('h2-font-weight') }};
}

.container h3 {
  color:       {{ get('h3-text-color') }};
  font-family: {{ get('h3-font-family') }};
  font-size:   {{ get('h3-font-size') }};
  font-weight: {{ get('h3-font-weight') }};
}

.container.inverted {
  background:  {{ get('inverted-container-bg-color') }};
  color:       {{ get('inverted-container-text-color') }};
}

.container.inverted .light {
  color:       {{ get('inverted-light-text-color') }};
}

.container.inverted h1 {
  color:       {{ get('inverted-h1-text-color') }};
}

.container.inverted h2 {
  color:       {{ get('inverted-h2-text-color') }};
}

.container.inverted h3 {
  color:       {{ get('inverted-h3-text-color') }};
}
</style>`

type GetSettings = (key: BrandSettingsPaletteKey) => string

export function getMjmlBrandStyles(brand: IBrand, get: GetSettings): string {
  const brandData = flattenBrand(brand)
  return nunjucks.renderString(BRAND_STYLES_TEMPLATE_MJML, { brand: brandData, get })
}

export function getNonMjmlBrandStyles(brand: IBrand, get: GetSettings): string {
  const brandData = flattenBrand(brand)
  return nunjucks.renderString(BRAND_STYLES_TEMPLATE_NON_MJML, { brand: brandData, get })
}
