import 'reflect-metadata';
import container from '../inversify.config';
import { iocTYPES } from '@app/utils/constants';
import { IWorker } from '@app/workers/WorkerImpl';

const worker = container.get<IWorker>(iocTYPES.Worker);

worker.start();
