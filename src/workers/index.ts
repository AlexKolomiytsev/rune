import * as Queue from 'bull';
import queues from './queues';
import processorInitialisers from './processorInitialisers';
import { logger } from '@app/services';

Object.entries(queues).forEach(async ([queueName, queue]: [string, Queue.Queue]) => {
  try {
    await queue.process(processorInitialisers[queueName]);
    logger.success(`Worker listening to '${queueName}' queue`);
  } catch (e) {
    logger.error(`Worker can't start listen to '${queueName}' queue`, e);
  }
});
