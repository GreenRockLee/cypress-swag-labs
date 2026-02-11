export class loginPage {
  elements = {
    usernameInput: () => cy.getByTestId('username'),
    passwordInput: () => cy.getByTestId('password'),
    loginButton: () => cy.getByTestId('login-button'),
    errorMessage: () => cy.getByTestId('error'),
  };
}  