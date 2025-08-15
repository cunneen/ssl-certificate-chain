// set up our logger
import { type HookFunction } from 'mocha'
import { debug } from 'debug'
import 'anylogger-debug'
import anylogger from 'anylogger'

// debug.enable('ssl-certificate-chain:*,test-ssl-certificate-chain:*')

const logger = anylogger('test-ssl-certificate-chain:globalSetup')
export const mochaGlobalSetup: HookFunction = async function mochaGlobalSetup() {
  logger.info("logging is set up");
}

