export default class ShoppingCart {
  constructor(pricingRules) {
    this.pricingRules = pricingRules;
    this.items = [];
    this.appliedPromoCode = null;
  }

  add(itemCode, promoCode = null) {
    const product = this.pricingRules.products.find(p => p.code === itemCode);
    if (!product) throw new Error(`Unknown product code: ${itemCode}`);

    let existingItem = this.items.find(i => i.code === itemCode);
    if (promoCode === "FREE") {
      this.items.push({ code: product.code, name: product.name, price: 0, quantity: 1 })
    } else {
      if (existingItem && !(existingItem.price === 0)) {
        existingItem.quantity += 1;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
    }

    if (promoCode) this.appliedPromoCode = promoCode;

    const bundlePromo = Object.values(this.pricingRules.promos).find(
      p => p.type === "bundle" && p.appliesTo === itemCode
    );
    if (bundlePromo) {
      this.add(bundlePromo.freeItem, "FREE");
    }
  }

  get total() {
    let sum = 0;
    for (const item of this.items) {
      let price = item.price;
      let qty = item.quantity;

      const bulkPromo = Object.values(this.pricingRules.promos).find(
        p => p.type === "bulk" && p.appliesTo === item.code
      );
      if (bulkPromo && qty > bulkPromo.minQty) {
        price = bulkPromo.newPrice;
      }

      const qtyPromo = Object.values(this.pricingRules.promos).find(
        p => p.type === "quantity" && p.appliesTo === item.code
      );
      if (qtyPromo) {
        const freeItems = Math.floor(qty / qtyPromo.buy);
        qty -= freeItems;
      }

      sum += qty * price;
    }

    const percentPromo = this.pricingRules.promos[this.appliedPromoCode];
    if (percentPromo && percentPromo.type === "percentage") {
      sum = sum * (1 - percentPromo.value);
    }

    return Number(sum.toFixed(2));
  }
}
