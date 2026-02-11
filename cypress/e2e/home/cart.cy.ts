import { HomePage } from '../../support/pages/home/home-page';
import { CartPage } from '../../support/pages/home/cart-page';
import type { Product } from '../../support/types/product';

const homePage = new HomePage();
const cartPage = new CartPage();
let products: Product[];

describe('Cart functionality', () => {
    beforeEach(() => {
        cy.login();

        // Load products fixture and store it in a variable for easy access in tests
        cy.fixture<Product[]>('products.json').then((p) => {
            products = p;
        });
    });

    it('should correctly handle adding, removing and persisting multiple cart products', () => {
        // List of products that will be added to the cart later in the test
        const productsToAdd = [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)',
        ];

        // List of products that will be removed from the cart later in the test
        const productsToRemove = [
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)',
        ];

        // List of products that should remain in the cart after removal
        const remainingProducts = productsToAdd.filter(x => !productsToRemove.includes(x));

        // Verify that all products are displayed on the home page with correct details
        homePage.elements.products()
            .should('have.length', products.length);
        products.forEach(p => {
            homePage.assertProductDetails(p);
            homePage.assertProductButtonStatus(p.name, 'Add to cart');
        });

        // Add products to cart and verify cart badge count after each addition
        productsToAdd.forEach((name, i) => {
            homePage.addProductToCart(name);
            homePage.elements.shoppingCartBadge()
                .should('have.text', String(i + 1));
        });

        // Open cart and verify that correct products are present with correct details
        homePage.elements.shoppingCartButton()
            .click();
        productsToAdd.forEach(name => cartPage.assertProductDetails(findProduct(name)));

        // Remove two products from cart and verify thah they were removed correctly, 
        // also verify cart badge count after each removal
        productsToRemove.forEach((name, i) => {
            cartPage.removeItemFromCart(name);
            cartPage.elements.cartProducts()
                .should('have.length', productsToAdd.length - (i + 1));
            homePage.elements.shoppingCartBadge()
                .should('have.text', productsToAdd.length - (i + 1));
        });

        // Go to homepage, open cart again and verify that the remaining items are still in the cart
        cartPage.elements.continueShoppingButton()
            .click();
        homePage.elements.shoppingCartButton()
            .click();
        cartPage.elements.cartProducts()
            .should('have.length', remainingProducts.length);
        remainingProducts.forEach(name => cartPage.assertProductDetails(findProduct(name)));

        // Go to homepage and remove the remaining products that are still in the cart
        cartPage.elements.continueShoppingButton()
            .click();
        remainingProducts.forEach((name) => {
            homePage.assertProductButtonStatus(name, 'Remove');
            homePage.removeItemFromCart(name);
        });

        // Open cart and verify that it is empty
        homePage.elements.shoppingCartButton()
            .click();
        cartPage.elements.cartProducts()
        .should('have.length', 0);

        // Go to homepage and verify that all products are still displayed with correct details
        cartPage.elements.continueShoppingButton()
            .click();
        homePage.elements.products()
            .should('have.length', products.length);
        products.forEach(p => {
            homePage.assertProductDetails(p);
            homePage.assertProductButtonStatus(p.name, 'Add to cart');
        });
    })
});    

// Helper function to find a product details by the product name
const findProduct = (name: string): Product => {
        const p = products.find(x => x.name === name);
        if (!p) throw new Error(`Missing product "${name}" in products.json`);
        return p;
    };