const waitTimeMultiplier = 1.5;

/**
 * @param {number} [sec=1]
 */
export const wait = (sec = 1) => {
  cy.wait(sec * 1000 * waitTimeMultiplier);
};
