/// <reference types="cypress" />

import { wait } from "../support/utils";

describe("Running Cypress COTPS transaction automation...", () => {
  beforeEach(() => {
    cy.viewport(1000, 1100);
    cy.visit("https://www.cotps.com/");
  });

  it("Log in to COTPS and make transactions until no more funds exist", () => {
    try {
      console.log("starting");
      cy.login();

      // click on transaction hall tab
      wait(2);
      cy.get(":nth-child(3) > .uni-tabbar__bd").click();
      wait(7);

      // place orders recursively until no more funds exist
      cy.runOrderCycle().then(() => {
        console.log("done");
      });
    } catch (err) {
      console.error(err);
      cy.log(err);
      throw err;
    }
  });
});
