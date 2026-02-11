/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {

            /**
            * Custom command for logging into the application.
            */
            login(): Chainable<void>;

            /**
            * Custom selector helper for querying elements by data-test attribute.
            *
            * @param selector - Value of the data-test attribute
            * @param options - Optional Cypress query options (timeout, within ...)
            */
            getByTestId(
                selector: string,
                options?: Partial<Cypress.Timeoutable & Cypress.Withinable>,
            ): Chainable<JQuery<HTMLElement>>;
        }
    }
}
export { };

/**
 * Custom command to retrieve elements using the data-test attribute.
 */
Cypress.Commands.add('getByTestId', (selector, options = {}) => {
    return cy.get(`[data-test="${selector}"]`, options);
});

/**
 * Custom login command.
 * Credentials are retrieved from environment variables to avoid hardcoding secrets.
 */
Cypress.Commands.add('login', () => {
    const username = Cypress.env('OFFER_USERNAME');
    const password = Cypress.env('OFFER_PASSWORD');

    cy.visit('/')
    cy.getByTestId('username').type(username)
    cy.getByTestId('password').type(password)
    cy.getByTestId('login-button').click()
});

