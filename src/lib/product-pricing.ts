type ProductPricingInput = {
  regularPrice: number;

  salePrice?: number;

  discountEnabled?: boolean;

  discountPrice?: number;

  discountStartAt?:
    | string
    | Date;

  discountEndAt?:
    | string
    | Date;
};

export function isTimedDiscountActive(
  product:
    ProductPricingInput,

  now = new Date()
) {
  if (
    !product.discountEnabled ||
    product.discountPrice ===
      undefined ||
    !product.discountStartAt ||
    !product.discountEndAt
  ) {
    return false;
  }

  const start =
    new Date(
      product.discountStartAt
    );

  const end =
    new Date(
      product.discountEndAt
    );

  if (
    Number.isNaN(
      start.getTime()
    ) ||
    Number.isNaN(
      end.getTime()
    )
  ) {
    return false;
  }

  return (
    now.getTime() >=
      start.getTime() &&
    now.getTime() <
      end.getTime()
  );
}

export function getEffectiveProductPrice(
  product:
    ProductPricingInput,

  now = new Date()
) {
  if (
    isTimedDiscountActive(
      product,
      now
    ) &&
    product.discountPrice !==
      undefined
  ) {
    return product.discountPrice;
  }

  return (
    product.salePrice ??
    product.regularPrice
  );
}