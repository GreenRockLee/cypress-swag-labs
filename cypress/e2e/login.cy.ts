import { homePage } from '../support/pages/home/home-page';
import { sideMenuPage } from '../support/pages/home/side-menu-page';
import { loginPage } from '../support/pages/login-page';
import { AUTH_ERRORS } from '../support/constants';

const home = new homePage();
const sideMenu = new sideMenuPage();
const login = new loginPage();

/**
 *
 * Verifying the login necessary is essential, as no other application
 * features can be accessed or tested without successful authentication.
 *
 * The functionality is purposely separated into two distinct test cases:
 * one for login and one for logout. This ensures that if the login test fails,
 * we can immediately identify the root cause of subsequent test failures,
 * since the rest of the test suite depends on a successful login.
 *
 * The logout test is implemented as a standalone case to provide clear and
 * isolated feedback. For my point of view keeping login and logout independent 
 * prevents one failure from obscuring the other and makes test results easier to diagnose.
 */
describe('Successful login and logout', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should log in with valid credentials', () => {
    cy.url()
    .should('include', '/inventory.html');
  })

  it('should log in with valid credentials and logout', () => {
    home.elements.sideBurgerMenuButton()
      .click();
    sideMenu.elements.logout()
      .click();
    cy.url().should('eq', 'https://www.saucedemo.com/');
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