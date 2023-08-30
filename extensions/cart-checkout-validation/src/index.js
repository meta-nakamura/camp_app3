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
      errors.push({
        localizedMessage: `${merchandise?.product.handle} は ${merchandise?.product?.max_orders?.value} 点以上注文できません`,
        target: "cart"
      });
    }
  });

  return {
    errors,
  };
};