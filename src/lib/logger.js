import pino from 'pino';
import ENV from '@/lib/constants/environmentVariables';

const options = {
  level: process.env.NEXT_PUBLIC_LOGGING_LEVEL?.toLowerCase() || 'info',
};

if (ENV.IS_DEV) {
  options.transport = {
    target: 'pino-pretty',
    options: {
      ignore: 'pid,hostname',
      translateTime: 'SYS:standard',
    },
  };
}

const logger = pino(options);

export default logger;
