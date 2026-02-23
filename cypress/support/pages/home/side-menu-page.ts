export class SideMenuPage {
  elements = {
    allItems: () => cy.getByTestId('inventory-sidebar-link'),
    about: () => cy.getByTestId('about-sidebar-link'),
    logout: () => cy.getByTestId('logout-sidebar-link'),
    resetAppState: () => cy.getByTestId('reset-sidebar-link'),
  }
}
