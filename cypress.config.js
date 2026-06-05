const {defineConfig} = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    excludeSpecPattern: '*.js',
    specPattern: 'cypress/integration/**/*.{feature,features}',
    baseUrl: 'http://localhost:8080',
    baseApiUrl: 'https://23.objects.htmlacademy.pro/big-trip',
    viewportHeight: 1000,
    viewportWidth: 1280,
    experimentalWebKitSupport: true,
  },
});
