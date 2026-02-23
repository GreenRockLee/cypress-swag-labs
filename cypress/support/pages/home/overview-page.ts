import type { Product } from '../../types/product'

export class OverviewPage {
  elements = {
    title: () => cy.getByTestId('title'),
    productName: () => cy.getByTestId('inventory-item-name'),
    productDescription: () => cy.getByTestId('inventory-item-desc'),
    productPrice: () => cy.getByTestId('inventory-item-price'),
    cartProducts: () =>
      cy.get('[data-test*="cart-list"]').children('div[data-test*="inventory-item"]'),
    subTotalLabel: () => cy.getByTestId('subtotal-label'),
    taxLable: () => cy.getByTestId('tax-label'),
    totalLabel: () => cy.getByTestId('total-label'),
    finishButton: () => cy.getByTestId('finish'),
  }

  // Method to assert product details in the overview page
  assertProductDetails(product: Product) {
    cy.contains('.cart_item', product.name).within(() => {
      this.elements.productName().should('have.text', product.name)
      this.elements.productDescription().should('have.text', product.desc)
      this.elements.productPrice().should('have.text', product.price)
    })
  }
}
