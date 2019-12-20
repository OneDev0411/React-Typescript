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

const width = "24";
const height = "24";
const viewBox = "0 0 24 24";

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
      fill="#000"
      fillRule="evenodd"
      d="M4 3.75c-.788 0-1.25.539-1.25 1v10.5c0 .461.462 1 1.25 1h16c.788 0 1.25-.539 1.25-1V4.75c0-.461-.462-1-1.25-1H4zm16 14h-7.25v2.5H15a.75.75 0 010 1.5H9a.75.75 0 010-1.5h2.25v-2.5H4c-1.422 0-2.75-1.028-2.75-2.5V4.75c0-1.472 1.328-2.5 2.75-2.5h16c1.422 0 2.75 1.028 2.75 2.5v10.5c0 1.472-1.328 2.5-2.75 2.5z"
      clipRule="evenodd"
      key="key-0"
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
  displayName: "Pc"
});
