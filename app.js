const axios = require('axios');
const { execSync } = require("child_process");
require('dotenv').config();

// for debugging
const SKIP_CYPRESS = process.env?.SKIP_CYPRESS ?? false;

const DISCORD_ENABLED = true;
const cycleTimeInSeconds = 7666 * 1000; // every 2hrs and 10mins-ish

const discordKey = process.env.DISCORD_KEY;
const cypressRecordKey = process.env.CYPRESS_RECORD_KEY;

const baseRunCommand = 'npm run cy:run -- --spec "cypress/integration/make-transaction.spec.js"';
const runCommand = baseRunCommand + " --record --key " + cypressRecordKey;

const testRunCommand =
  'npm run cy:run -- --spec "cypress/integration/test.spec.js"';


(async () => {
  // run on first execution before setting the 2hr timer
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
    const errorMsg = `An unexpected error has occurred: ${err.message}\n\nStack: ${err.stack}`;
    await logToDiscord(errorMsg);
  }
}


/**
 * Sends a POST request message to discord
 *
 * @param {string|object} message
 */
 async function logToDiscord(message) {

	if (!DISCORD_ENABLED) { return null; }

	if (!message) { throw new Error('No message content'); }

	const url = "https://discord.com/api/webhooks/849967012062691328/" + discordKey;

	if (typeof message !== 'string') {
		data.content = JSON.stringify(message, null, 4).replace(/"|,/g, '');
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