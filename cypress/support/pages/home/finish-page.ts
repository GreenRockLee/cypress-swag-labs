export class FinishPage {
  elements = {
    title: () => cy.getByTestId('title'),
    completeHeader: () => cy.getByTestId('complete-header'),
    completeText: () => cy.getByTestId('complete-text'),
    backHomeButton: () => cy.getByTestId('back-to-products'),
  }
}
