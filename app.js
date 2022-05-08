const axios = require('axios');
const { execSync } = require("child_process");
require('dotenv').config();

// for debugging - skip running cypress
const SKIP_CYPRESS = process.env?.SKIP_CYPRESS ?? false;

const cycleTimeInSeconds = 7666 * 1000; // every 2hrs and 10mins-ish

const testRunCommand = 'npm run cy:run -- --spec "cypress/integration/test.spec.js"';

const { discordKey, runCommand } = getEnvironemnt();


(async () => {
  // run on first execution before setting the 2hr timer
  // await logToDiscord("COTPS bot says hello from VPS!");
  await main();

  setInterval(async () => {
    await main();
  }, cycleTimeInSeconds);
})();


async function main() {
  const currentTime = new Date();
  console.log('Starting transaction cycle..', currentTime);

  try {
    if (!SKIP_CYPRESS) {
      await execSync(runCommand, { stdio: "inherit" });
    }
    const nextRunTime = new Date(currentTime.setHours(currentTime.getHours() + 2));
    console.log("Running next at: ", nextRunTime);

  } catch (err) {
    // suppress error to keep running bot
    console.log('Error running cypress: ', err);
    await logToDiscord("Cypress threw an error"); // TODO - remove this once the inner cypress discord logging is fixed
  }
}


/**
 * Returns environment variables with default values if not set
 * Will throw error if required variable is missing
 */
function getEnvironemnt() {

  const username = process.env.COTPS_USERNAME;
  const password = process.env.COTPS_PASSWORD;
  const cypressRecordKey = process.env.CYPRESS_RECORD_KEY; // optional - disable cypress recording
  const discordKey = process.env.DISCORD_KEY; // optional - disable discord logs

  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  const baseRunCommand = `npm run cy:run -- --env username=${username},password=${password} --spec "cypress/integration/make-transaction.spec.js"`;
  const runCommand = cypressRecordKey 
    ? baseRunCommand + " --record --key " + cypressRecordKey 
    : baseRunCommand;

  return {
    runCommand,
    discordKey
  };
}

/**
 * Sends a POST request message to discord
 *
 * @param {string|object} message
 */
 async function logToDiscord(message) { // TODO - replace this with the cypress discord logger if possible

	if (!discordKey) { return null; }

	if (!message) { throw new Error('No message content'); }

	const url = "https://discord.com/api/webhooks/849967012062691328/" + discordKey;

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
		return await axios(params);
	} catch (err) {
		// suppress error
		console.log('Error sending message to discord: ', err);
		return err;
	}
}