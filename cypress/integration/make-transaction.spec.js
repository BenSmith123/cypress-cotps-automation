/// <reference types="cypress" />

import axios from 'axios'
import { wait } from "../support/utils";


Cypress.on('uncaught:exception', (error, runnable) => {
  console.error(error)
  logToDiscord({ errorType: "Uncaught exception", ...error});
  return true
})


Cypress.on('fail', async (error, runnable) => {
  logToDiscord({ errorType: "Test fail", ...error});
  return true // return true to prevent looping
})

describe("Running Cypress COTPS transaction automation...", async () => {

  beforeEach(() => {
    cy.viewport(1000, 1100);
    cy.visit("https://www.cotps.com/");
  });

  it("Log in to COTPS and make transactions until no more funds exist", () => {

    try {
      console.log("starting");

      cy.login();

      // click on transaction hall tab
      wait(3);
      cy.get(":nth-child(3) > .uni-tabbar__bd").click();
      wait(8);

      // place orders recursively until no more funds exist
      cy.runOrderCycle().then(() => {
        console.log("done");
      });
    } catch (err) {
      console.error(err);
      // logToDiscord(err);
      cy.log(err);
      throw err;
    }
  });
});


/**
 * Sends a POST request message to discord
 *
 * @param {string|object} message
 */
export const logToDiscord = async(message) => {

  if (!Cypress.env("DISCORD_KEY")) { return null; }
	if (!message) { throw new Error('No message content'); }

	const url = "https://discord.com/api/webhooks/849967012062691328/" + Cypress.env("DISCORD_KEY");

	if (typeof message !== 'string') {
		message = JSON.stringify(message, null, 4).replace(/"|,/g, '');
	}

	const params = {
		url,
		method: 'POST',
		data: {
      username: 'COTPS automation',
      content: message,
    },
		headers: {
			'Content-Type': 'application/json',
		},
	};

	try {
		return axios(params);
	} catch (err) {
		// suppress error
		console.log('Error sending message to discord: ', err);
		return err;
	}
}
