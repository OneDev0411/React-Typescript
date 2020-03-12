import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const createHelpers = (width, height, css) => {
  // somehow sizes is ending up in markup, even if it is not a valid svg attribute
  // until we have a better solution, just render it empty, instead to '[Object object]'
  const sanitizeSizes = sizes =>
    Object.defineProperty(sizes, "toString", {
      value: () => "",
      enumerable: false
    });

  const getDimensions = (size, sizes) => {
    if (
      size &&
      typeof size.width === "number" &&
      typeof size.height === "number"
    ) {
      return size;
    }

    return size && sizes[size] ? sizes[size] : { width, height };
  };

  const getCss = (size, sizes, fillColor, fillColorRule, noStyles) => {
    if (noStyles) {
      return "";
    }

    const dimensions = getDimensions(size, sizes);
    const fillRule =
      fillColor && fillColorRule
        ? `${fillColorRule}{ fill: ${fillColor}; }`
        : "";

    return css`
      width: ${dimensions.width}px;
      height: ${dimensions.height}px;
      ${fillRule}
    `;
  };

  const propsToCss = ({ size, sizes, fillColor, fillColorRule, noStyles }) =>
    getCss(size, sizes, fillColor, fillColorRule, noStyles);

  return {
    getCss,
    getDimensions,
    propsToCss,
    sanitizeSizes
  };
};

const width = "20";
const height = "20";
const viewBox = "0 0 480 480";

const { getDimensions, getCss, propsToCss, sanitizeSizes } = createHelpers(
  width,
  height,
  css
);

const sizes = sanitizeSizes({});

const Image = styled.svg`
  ${propsToCss}
`;

const children = (
  <Fragment>
    <path
      d="M400 120h-64V24c0-13.602-10.398-24-24-24H24C10.398 0 0 10.398 0 24v432c0 13.602 10.398 24 24 24h243.2l68.8-68.8V360h-16v40h-40c-13.602 0-24 10.398-24 24v40H24c-4.8 0-8-3.2-8-8V24c0-4.8 3.2-8 8-8h288c4.8 0 8 3.2 8 8v96h-64c-13.602 0-24 10.398-24 24v144c0 13.602 10.398 24 24 24h44.8l27.2 27.2 27.2-27.2H400c13.602 0 24-10.398 24-24V144c0-13.602-10.398-24-24-24zM280 416h28.8L272 452.8V424c0-4.8 3.2-8 8-8zm128-128c0 4.8-3.2 8-8 8h-51.2L328 316.8 307.2 296H256c-4.8 0-8-3.2-8-8V144c0-4.8 3.2-8 8-8h144c4.8 0 8 3.2 8 8zm0 0"
      key="key-0"
    />
    <path
      d="M120 40h96v16h-96zm0 0M40 80h24v16H40zm0 0M80 80h216v16H80zm0 0M40 128h24v16H40zm0 0M80 128h128v16H80zm0 0M40 176h24v16H40zm0 0M80 176h128v16H80zm0 0M40 224h24v16H40zm0 0M80 224h128v16H80zm0 0M40 272h24v16H40zm0 0M80 272h128v16H80zm0 0M40 320h24v16H40zm0 0M80 320h128v16H80zm0 0M40 368h24v16H40zm0 0M80 368h216v16H80zm0 0M40 416h24v16H40zm0 0M80 416h152v16H80zm0 0M360 201.602V184c0-17.602-14.398-32-32-32s-32 14.398-32 32h16c0-8.8 7.2-16 16-16s16 7.2 16 16v16h-40c-13.602 0-24 10.398-24 24v32c0 13.602 10.398 24 24 24h48c13.602 0 24-10.398 24-24v-32c0-10.398-6.398-19.2-16-22.398zM360 256c0 4.8-3.2 8-8 8h-48c-4.8 0-8-3.2-8-8v-32c0-4.8 3.2-8 8-8h48c4.8 0 8 3.2 8 8zm0 0"
      key="key-1"
    />
  </Fragment>
);

const defaultProps = {
  children,
  viewBox,
  fillColor: null,
  fillColorRule: "&&& path, &&& use, &&& g",
  sizes,
  size: null
};

Image.propTypes /* remove-proptypes */ = {
  fillColor: PropTypes.string,
  fillColorRule: PropTypes.string,
  viewBox: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired
    })
  ]),
  sizes: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number
  })
};

export default Object.assign(Image, {
  getDimensions,
  getCss,
  defaultProps,
  displayName: "Unlock"
});
