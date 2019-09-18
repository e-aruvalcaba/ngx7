// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (username, password) => {
    cy.request({
      method: 'POST',
      url: 'https://uscldcnxapmsa01.azure-api.net/v6/secm/oam/oauth2/token',
      form: true,
      body: {
        grant_type: 'password',
        scope: 'security',
        username,
        password,
        client_id: '721e5c7b-73b8-40e1-8cb2-31c7dbdbd1be',
      },
    }).then(resp => {
      window.sessionStorage.setItem('access_token', resp.body.oauth2.access_token);
      window.sessionStorage.setItem('applications', JSON.stringify(resp.body.applications));
      window.sessionStorage.setItem('auth_token', resp.body.oauth2.access_token);
      window.sessionStorage.setItem('country', resp.body.country);
      window.sessionStorage.setItem('expires_in', resp.body.oauth2.expires_in);
      window.sessionStorage.setItem('jwt', resp.body.jwt);
      window.sessionStorage.setItem('language', `en_${resp.body.country}`);
      window.sessionStorage.setItem('refresh_token', resp.body.oauth2.refresh_token);
      window.sessionStorage.setItem('region', resp.body.oauth2.region);
      window.sessionStorage.setItem('role', resp.body.role);
      window.sessionStorage.setItem('token_data', JSON.stringify(resp.body));
      window.sessionStorage.setItem('userInfo', JSON.stringify(resp.body));
      window.sessionStorage.setItem('user_applications', JSON.stringify(resp.body.applications));
      window.sessionStorage.setItem('user_customer', JSON.stringify(resp.body.customer));
      window.sessionStorage.setItem('user_profile', JSON.stringify(resp.body.profile));
      window.sessionStorage.setItem('username', resp.body.profile.userAccount);
    });
  });
  