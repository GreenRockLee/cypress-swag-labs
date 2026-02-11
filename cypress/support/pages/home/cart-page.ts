import type { Product } from '../../types/product';

export class CartPage {
  elements = {
    productName: () => cy.getByTestId('inventory-item-name'),
    productDescription: () => cy.getByTestId('inventory-item-desc'),
    productPrice: () => cy.getByTestId('inventory-item-price'),
    cartProducts: () => cy.get('[data-test*="cart-list"]').children('div[data-test*="inventory-item"]'),
    continueShoppingButton: () => cy.getByTestId('continue-shopping'),
    checkoutButton: () => cy.getByTestId('checkout'),
  };

  // Method to assert product details in the cart
  assertProductDetails(product: Product) {
    cy.contains('.cart_item', product.name).within(() => {
      this.elements.productName().should('have.text', product.name);
      this.elements.productDescription().should('have.text', product.desc);
      this.elements.productPrice().should('have.text', product.price);
    });
  }

  // Method to remove a product from the cart by its name
  removeItemFromCart(productName: string) {
    cy.contains('[data-test*="inventory-item-name"]', productName)
      .parents('[data-test*="inventory-item"]')
      .find('button')
      .click();

    // Assert that the product is removed from the cart
    cy.contains('[data-test="inventory-item-name"]', productName).should('not.exist');
  }
}
