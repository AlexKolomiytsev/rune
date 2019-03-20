import { Job } from 'bull';

export default interface IGenericJobProcessor<TJob, TReturn> {
  process(job: Job<TJob>): Promise<TReturn>;
}
