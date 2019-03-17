import 'reflect-metadata';
import * as Queue from 'bull';
import queues from './queues';
import processorInitialisers from './processorInitialisers';

import container from '@app/inversify.config';
import { ILogger } from '@app/services';
import { iocTYPES } from '@app/utils/constants';
const logger = container.get<ILogger>(iocTYPES.Logger);

// TODO: move workers to inversify
Object.entries(queues).forEach(async ([queueName, queue]: [string, Queue.Queue]) => {
  try {
    await queue.isReady();
    queue.process(processorInitialisers[queueName]);
    logger.success(`Worker is listening to '${queueName}' queue`);
  } catch (e) {
    logger.error(`Error listening to ${queueName} queue`, e);
  }
});
