export class CheckoutPage {
  elements = {
    title: () => cy.getByTestId('title'),
    firstNameInput: () => cy.getByTestId('firstName'),
    lastNameInput: () => cy.getByTestId('lastName'),
    postalCodeInput: () => cy.getByTestId('postalCode'),
    continueButton: () => cy.getByTestId('continue'),
  }

  /**
   * Fills out the checkout form with the provided information
   */
  fillCheckoutForm(firstName: string, lastName: string, postalCode: string) {
    //First name input
    this.elements.firstNameInput().should('be.visible')
    this.elements.firstNameInput().type(firstName)
    this.elements.firstNameInput().should('have.value', firstName)

    // Last name input
    this.elements.lastNameInput().should('be.visible')
    this.elements.lastNameInput().type(lastName)
    this.elements.lastNameInput().should('have.value', lastName)

    // Postal code input
    this.elements.postalCodeInput().should('be.visible')
    this.elements.postalCodeInput().type(postalCode)
    this.elements.postalCodeInput().should('have.value', postalCode)

    return this
  }
}
