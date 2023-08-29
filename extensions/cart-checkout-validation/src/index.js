// @ts-check

/**
 * @typedef {import("../generated/api").InputQuery} InputQuery
 * @typedef {import("../generated/api").FunctionResult} FunctionResult
 */

export default /**
 * @param {InputQuery} input
 * @returns {FunctionResult}
 */
(input) => {
  const errors = [];

  input.cart.lines.forEach(lineItem => {
    const { quantity, merchandise } = lineItem;
    const max = Number.parseInt(merchandise?.product?.max_orders?.value);

    if (max && quantity > max) {
      console.log("error!!!");
      errors.push({
        localizedMessage: `Can't order more than ${merchandise?.product?.max_orders?.value} of ${merchandise?.product.handle}`,
        target: "cart"
      });
    }
  });

  return {
    errors,
  };
};