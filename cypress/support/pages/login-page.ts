export class LoginPage {
  elements = {
    usernameInput: () => cy.getByTestId('username'),
    passwordInput: () => cy.getByTestId('password'),
    loginButton: () => cy.getByTestId('login-button'),
    errorMessage: () => cy.getByTestId('error'),
  }
}
