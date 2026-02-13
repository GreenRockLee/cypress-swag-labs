# Moxymind Automation Project

## Overview
This project contains automated tests built with Cypress.

Each `.cy.ts` file includes a short description explaining why the specific section was selected for automation.

## Getting Started
### 1. Clone the Repository
git clone https://github.com/GreenRockLee/cypress-swag-labs.git

### 2. Install Dependencies
npm install

### 3. Configure Environment Variables
- Create a .env file in the root directory and add the following credentials:  
 OFFER_USERNAME=standard_user  
 OFFER_PASSWORD=secret_sauce
 API_KEY=[It is necessary to create an account at https://reqres.in/ and generate an API key.]

### 4. Run the Tests
- in headed mode:    
npx cypress open

- or in headless mode:  
npx cypress run

## Autor
Matúš Šášik
