import 'reflect-metadata';
import * as Queue from 'bull';
import queues from './queues';
import { IProcessorInitializers } from './ProcessorInitializers';
import { ILogger } from '@app/services';
import { iocTYPES } from '@app/utils/constants';
import { inject, injectable } from 'inversify';

export interface IWorker {
  start(): void;
}

@injectable()
export default class WorkerImpl implements IWorker {
  @inject(iocTYPES.Logger)
  private readonly _logger: ILogger;
  @inject(iocTYPES.ProcessorInitializers)
  private readonly _processorInitializers: IProcessorInitializers;

  public start(): void {
    Object.entries(queues).forEach(async ([queueName, queue]: [string, Queue.Queue]) => {
      try {
        await queue.isReady();
        queue.process(this._processorInitializers.map[queueName]);
        this._logger.success(`Worker is listening to '${queueName}' queue`);
      } catch (e) {
        this._logger.error(`Error listening to ${queueName} queue`, e);
      }
    });
  }
}
