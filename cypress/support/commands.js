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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { wait } from "../support/utils";

Cypress.Commands.add("login", () => {
  // LOG IN!
  cy.get(".uni-tabbar > :nth-child(5)").click();
  cy.get(":nth-child(5) > uni-text").click();
  cy.get(":nth-child(151)").click();

  cy.get(":nth-child(5) > uni-input > .uni-input-wrapper > .uni-input-input")
    .click()
    .type(Cypress.env("username"));
  cy.get(":nth-child(7) > uni-input > .uni-input-wrapper > .uni-input-input")
    .click()
    .type(Cypress.env("password"));

  cy.get(".login").click();
});

Cypress.Commands.add("runOrderCycle", () => {
  console.log("running cycle");
  cy.getBalance().then((balance) => {
    console.log("balance", balance);

    if (balance < 5) {
      // no transactions to make, end here!
      return;
    }

    cy.makeTransaction(balance).then(() => {
      cy.runOrderCycle();
    });
  });
});

Cypress.Commands.add("getBalance", () => {
  console.log("getting balance");

  cy.get(".division-right > .division-num").then(async ($el) => {
    const balance = Number($el.text());
    console.log(balance);

    // check if wallet is number
    if (isNaN(balance)) {
      throw new Error("Failed to get wallet balance");
    }

    return cy.wrap(balance);
  });
});

Cypress.Commands.add("makeTransaction", () => {
  console.log("making transaction");
  cy.get(".orderBtn").click();
  wait(8);
  cy.get('.buttons > [type="primary"]').click({ force: true });
  wait(6);
  cy.get(
    ".fui-wrap__show > .fui-dialog__inner > .fui-dialog__body > uni-button"
  ).click();
  wait(4);
  return cy.wrap("transaction made");
});
