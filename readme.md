
# cotps-cypress

## Description
Automated cypress suite to log into COTPS.com and sell any available wallet funds.
The `app.js` wraps cypress and runs it on a schedule, deployed to an AWS EC2 instance for 24/7 up time.
The node processes are run using the pm2 [https://www.npmjs.com/package/pm2] npm library.

## Environment (process.env)
- Environment variables are set via node CLI and passed into the cypress process by `app.js`
- `COTPS_USERNAME` - required
- `COPTS_PASSWORD` - required
- `CYPRESS_RECORD_KEY` - optional
- `DISCORD_KEY` - optional

## Commands
- See `.linux-cli-commands` for running in EC2 etc.

### Local
- `npm start`: Starts cypress directly with UI.
- `node app.js`: Starts the wrapper node schedule to run cypress via CLI (no UI)

## EC2 instance
### Connect to ec2 instance:
- (Navigate to where file is) and run: `ssh -i "cypress-automation-ec2-key.pem" ec2-user@ec2-54-206-21-84.ap-southeast-2.compute.amazonaws.com`;
- `cd cypress-cotps-automation`
- Use git to pull latest changes

- List running processes: `pm2 list`
- See running processes: `pm2 describe {name}` e.g. `pm2 describe app`

### Running in EC2
- Debug/run app: `DISPLAY_NAME={firstName} COTPS_USERNAME={username} COTPS_PASSWORD={password} node app.js`
- Start a `pm2` process: `DISPLAY_NAME={firstName} COTPS_USERNAME={username} COTPS_PASSWORD={password} pm2 start app.js --update-env`
