import * as Queue from 'bull';
import queues from './queues';
import processorInitialisers from './processorInitialisers';
import { logger } from '@app/services';

Object.entries(queues).forEach(([queueName, queue]: [string, Queue.Queue]) => {
  logger.info(`Worker listening to '${queueName}' queue`);
  queue.process(processorInitialisers[queueName]);
});
