import { defineConfig } from "cypress";
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    viewportWidth: 1920,
    viewportHeight: 1080,
    numTestsKeptInMemory: 0,
    scrollBehavior: 'center',
    experimentalMemoryManagement: true,
    defaultBrowser: 'chrome',
    setupNodeEvents(on, config) {
      return config;
    },
  },
  env: {
    OFFER_USERNAME: process.env['OFFER_USERNAME'],
    OFFER_PASSWORD: process.env['OFFER_PASSWORD'],
    API_BASE_URL: 'https://reqres.in/api',
    API_KEY: process.env['API_KEY'],
    RESPONSE_TIME_LIMIT: 300
  }
});
