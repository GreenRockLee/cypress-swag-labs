import { HomePage } from '../support/pages/home/home-page';
import { CartPage } from '../support/pages/home/cart-page';
import { CheckoutPage } from '../support/pages/home/checkout-page';
import { OverviewPage } from '../support/pages/home/overview-page';
import { FinishPage } from '../support/pages/home/finis-page';
import { MESSAGES } from '../support/constants';
import type { Product } from '../support/types/product';

const homePage = new HomePage();
const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();
const overviewPage = new OverviewPage();
const finishPage = new FinishPage();
let products: Product[];

describe('Order finalization', () => {
    beforeEach(() => {
        cy.login();

        // Load products fixture and store it in a variable for easy access in tests
        cy.fixture<Product[]>('products.json').then((p) => {
            products = p;
        });
    });

    it('should add products to cart, fill in shipping details, and verify order totals including tax', () => {
        // List of products that will be added to the cart later in the test
        const productsToAdd = [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)',
        ];

        // Add products to cart
        productsToAdd.forEach((name, i) => {
            homePage.addProductToCart(name);
        });

        // Open cart and verify that correct products are present with correct details
        homePage.elements.shoppingCartButton()
            .click();
        cartPage.elements.cartProducts()
            .should('have.length', productsToAdd.length);
        productsToAdd.forEach(name => cartPage.assertProductDetails(findProduct(name)));

        // Click on checkout button and fill in checkout details
        cartPage.elements.checkoutButton()
            .click();
        checkoutPage.elements.title()
            .should('be.visible')
            .should('have.text', 'Checkout: Your Information');

        // First name input
        checkoutPage.elements.firstNameInput()
            .should('be.visible');
        checkoutPage.elements.firstNameInput()
            .type('John');
        checkoutPage.elements.firstNameInput()
            .should('have.value', 'John');

        // Last name input
        checkoutPage.elements.lastNameInput()
            .should('be.visible');
        checkoutPage.elements.lastNameInput()
            .type('Doe');
        checkoutPage.elements.lastNameInput()
            .should('have.value', 'Doe');

        // Postal code input
        checkoutPage.elements.postalCodeInput()
            .should('be.visible');
        checkoutPage.elements.postalCodeInput()
            .type('12345');
        checkoutPage.elements.postalCodeInput()
            .should('have.value', '12345');

        // Click on continue button and verify that overview page is displayed
        checkoutPage.elements.continueButton()
            .should('be.visible')
            .click();
        overviewPage.elements.title()
            .should('be.visible')
            .should('have.text', 'Checkout: Overview');

        // Verify that all products are displayed on the overview page with correct details
        overviewPage.elements.cartProducts()
            .should('have.length', productsToAdd.length);
        productsToAdd.forEach(name => overviewPage.assertProductDetails(findProduct(name)));

        // Get the subtotal price of the products in the cart 
        const total = productsToAdd
            .map(name => findProduct(name))
            .reduce((sum, product) => {
                return sum + Number(product.price.replace('$', ''));
            }, 0);

        // Verify that the subtotal price is correct
        overviewPage.elements.subTotalLabel()
            .should('be.visible')
            .should('have.text', `Item total: $${total.toFixed(2)}`);

        // Calculate total price with tax (8%) and verify, that tax and total price are correct
        const totalWithTax = total + (total * 0.08);
        overviewPage.elements.taxLable()
            .should('be.visible')
            .should('have.text', `Tax: $${(totalWithTax - total).toFixed(2)}`);
        overviewPage.elements.totalLabel()
            .should('be.visible')
            .should('have.text', `Total: $${totalWithTax.toFixed(2)}`);

        // Click on finish button and verify that checkout is completed successfully and correct page is displayed
        overviewPage.elements.finishButton()
            .should('be.visible')
            .click();
        finishPage.elements.title()
            .should('be.visible')
            .should('have.text', 'Checkout: Complete!');
        finishPage.elements.completeHeader()
            .should('be.visible')
            .should('have.text', MESSAGES.CHECKOUT_SUCCESS);
        finishPage.elements.completeText()
            .should('be.visible')
            .should('have.text', MESSAGES.CHECKOUT_SUCCESS_TEXT);

        // Click on back home button and verify that home page is displayed
        // and all products are displayed with correct details, also verify that the cart is empty
        finishPage.elements.backHomeButton()
            .should('be.visible')
            .click();
        homePage.elements.products()
            .should('have.length', products.length);
        products.forEach(p => {
            homePage.assertProductDetails(p);
            homePage.assertProductButtonStatus(p.name, 'Add to cart');
        });
        homePage.elements.shoppingCartBadge()
            .should('not.exist');
    })
});

// Helper function to find a product details by the product name
const findProduct = (name: string): Product => {
    const p = products.find(x => x.name === name);
    if (!p) throw new Error(`Missing product "${name}" in products.json`);
    return p;
};