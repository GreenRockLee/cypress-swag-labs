import type { Product } from '../../types/product';

export class HomePage {
  elements = {
    sideBurgerMenuButton: () => cy.getById('react-burger-menu-btn'),
    products: () => cy.get('.inventory_item'),
    productName: () => cy.getByTestId('inventory-item-name'),
    productDescription: () => cy.getByTestId('inventory-item-desc'),
    productPrice: () => cy.getByTestId('inventory-item-price'),
    shoppingCartButton: () => cy.getById('shopping_cart_container'),
    shoppingCartBadge: () => cy.getByTestId('shopping-cart-badge'),
  };

  // Method to add a product to the cart by its name
  addProductToCart(productName: string) {
    this.elements.productName()
      .contains(productName)
      .parents('[data-test*="inventory-item-description"]')
      .find('button')
      .contains('Add to cart')
      .click();
  }
  // Method to remove a product from the cart by its name
  removeItemFromCart(productName: string) {
    this.elements.productName()
      .contains(productName)
      .parents('[data-test*="inventory-item-description"]')
      .find('button')
      .contains('Remove')
      .click();
  }

  // Method to assert product details on the homepage
  assertProductDetails(product: Product) {
    cy.contains('.inventory_item', product.name).within(() => {
      this.elements.productName().should('have.text', product.name);
      this.elements.productDescription().should('have.text', product.desc);
      this.elements.productPrice().should('have.text', product.price);
    });
  }

  // Method to assert the status of the product button (Add to cart or Remove) based on the product name
  assertProductButtonStatus(productName: string, buttonText: string) {
    cy.contains('.inventory_item', productName)
      .within(() => {
        cy.get('button')
          .should('contain.text', buttonText);
      });
  }
}

