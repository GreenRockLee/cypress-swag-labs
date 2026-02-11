import { homePage } from '../support/pages/home/home-page';
import { sideMenuPage } from '../support/pages/home/side-menu-page';
import { loginPage } from '../support/pages/login-page';
import { AUTH_ERRORS } from '../support/constants';

const home = new homePage();
const sideMenu = new sideMenuPage();
const login = new loginPage();

describe('Successful login and logout', () => {
  it('should log in with valid credentials and logout', () => {
    cy.login();
    home.elements.sideBurgerMenuButton()
      .click();
    sideMenu.elements.logout()
      .click();
    login.elements.usernameInput()
      .should('be.visible');
  })
});

describe('Negative scenarios', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display an error when logging in with invalid credentials', () => {
    // Input invalid username
    login.elements.usernameInput()
      .type('invalidUser');
    login.elements.usernameInput()
      .should('have.value', 'invalidUser');

    // Input invalid password
    login.elements.passwordInput()
      .type('passwd');
    login.elements.passwordInput()
      .should('have.value', 'passwd');

    // Attempt to log in and verify error message
    login.elements.loginButton()
      .should('be.visible')
      .click();
    login.elements
      .errorMessage()
      .should('contain.text', AUTH_ERRORS.INVALID_CREDENTIALS);
  });

  it('should display a empty credentials error when fields are empty', () => {
    // Ensure username is empty
    login.elements.usernameInput()
      .should('be.visible');
    login.elements.usernameInput()
      .should('be.empty');

    // Ensure password is empty
    login.elements.passwordInput()
      .should('be.visible');
    login.elements.passwordInput()
      .should('be.empty');

    // Attempt to log in and verify error message
    login.elements.loginButton()
      .should('be.visible')
      .click();
    login.elements
      .errorMessage()
      .should('contain.text', AUTH_ERRORS.EMPTY_CREDENTIALS);
  });

  it('should prevent login when SQL injection payload is submitted', () => {
    // Input SQL injection payload into username field
    login.elements.usernameInput()
      .should('be.visible');
    login.elements.usernameInput()
      .type("admin' OR '1'='1")
      .blur();

    // Input SQL injection payload into password field
    login.elements.passwordInput()
      .should('be.visible');
    login.elements.passwordInput()
      .type("admin' OR '1'='1")
      .blur();

    // Attempt to log in and verify error message
    login.elements.loginButton()
      .should('be.visible')
      .click();
    login.elements
      .errorMessage()
      .should('contain.text', AUTH_ERRORS.INVALID_CREDENTIALS);
  });

  it('should prevent login when XSS payload is submitted', () => {
    // Input XSS payload into username field
    login.elements.usernameInput()
      .should('be.visible');
    login.elements
      .usernameInput()
      .type("<script>alert('XSS')</script>")
      .blur();

    // Input XSS payload into password field
    login.elements.passwordInput()
      .should('be.visible')
      .click();
    login.elements.passwordInput()
      .type('passwd')
      .blur();

    // Attempt to log in and verify error message
    login.elements.loginButton()
      .should('be.visible')
      .click();
    login.elements
      .errorMessage()
      .should('contain.text', AUTH_ERRORS.INVALID_CREDENTIALS);
  });
});