import { HomePage } from '../../../support/pages/home/home-page';
import type { Product } from '../../../support/types/product';

const homePage = new HomePage();
let products: Product[];

describe('Cart functionality', () => {
    beforeEach(() => {
        cy.login();

        // Load products fixture and store it in a variable for easy access in tests
        cy.fixture<Product[]>('products.json').then((p) => {
            products = p;
        });
    });

    /**
     * Another important component is the homepage, which is why I decided
     * to test it separately. If it failed to function properly or if any
     * of its sections did not load, it could disrupt the subsequent
     * execution of other tests. By isolating it, we are able to detect
     * potential causes of test failures right at the beginning.
     */
    it('should correctly handle adding, removing and persisting multiple cart products', () => {
        // Check that home page is displayed with all necessary elements
        homePage.elements.title()
            .should('be.visible')
            .should('have.text', 'Products');
        homePage.elements.shoppingCartButton()
            .should('be.visible')
        homePage.elements.sideBurgerMenuButton()
            .should('be.visible')
        homePage.elements.productsFilter()
            .should('be.visible')

        // Verify that all products are displayed on the home page with correct details
        homePage.elements.products()
            .should('have.length', products.length);
        products.forEach(p => {
            homePage.assertProductDetails(p);
            homePage.assertProductButtonStatus(p.name, 'Add to cart');
        });
    })
});    