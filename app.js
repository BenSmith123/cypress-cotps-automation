const { execSync } = require("child_process");
const axios = require('axios');
require('dotenv').config();

const DISCORD_ENABLED = true;
const cycleTimeInSeconds = 7666 * 1000; // every 2hrs and 10mins-ish

const discordKey = process.env.DISCORD_KEY;
const cypressRecordKey = process.env.CYPRESS_RECORD_KEY;

const baseRunCommand = 'npm run cy:run -- --spec "cypress/integration/make-transaction.spec.js"';
const runCommand = baseRunCommand + " --record --key " + cypressRecordKey;

const testRunCommand =
  'npm run cy:run -- --spec "cypress/integration/test.spec.js"';

(async () => {
  console.log("Starting cotps-cypress!");
  const currentTime = new Date();
  console.log(currentTime);

  try {
    // setInterval(async () => {
    const a = await execSync(testRunCommand, { stdio: "inherit" });

    const nextRunTime = new Date(
      currentTime.setHours(currentTime.getHours() + 2)
    );
    console.log("Running next at: ", nextRunTime);
    // }, cycleTimeInSeconds);
  } catch (err) {
    console.error(err);
  }

})();


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