export class CheckoutPage {
    elements = {
        title: () => cy.getByTestId('title'),
        firstNameInput: () => cy.getByTestId('firstName'),
        lastNameInput: () => cy.getByTestId('lastName'),
        postalCodeInput: () => cy.getByTestId('postalCode'),
        continueButton: () => cy.getByTestId('continue'),
    };
}
