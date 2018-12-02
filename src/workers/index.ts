import * as Queue from 'bull';
import queues from './queues';
import processorInitialisers from './processorInitialisers';
import { logger } from '@app/services';

Object.entries(queues).forEach(async ([queueName, queue]: [string, Queue.Queue]) => {
  try {
    await queue.isReady();
    queue.process(processorInitialisers[queueName]);
    logger.success(`Worker is listening to '${queueName}' queue`);
  } catch (e) {
    logger.error(`Error listening to ${queueName} queue`, e);
  }
});
