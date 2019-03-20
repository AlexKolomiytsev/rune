import * as colors from 'colors';
import * as moment from 'moment';
import { injectable } from 'inversify';

enum Types {
  Success = 'Success',
  Error = 'Error',
  Warning = 'Warning',
  Info = 'Info',
}
const { Success, Error, Warning, Info } = Types;

export interface ILogger {
  success(...message: any): void;
  error(...message: any): void;
  warning(...message: any): void;
  info(...message: any): void;
  workerProcessingStarted(queueName: string, data: any): void;
}

@injectable()
export default class Logger implements ILogger {
  private _dateFormat: string = 'YYYY-MM-DD [at] hh:mm:ssa';

  public success(...msg: any) {
    this.log(Success, ...msg);
  }

  public error(...msg: any) {
    this.log(Error, ...msg);
  }

  public warning(...msg: any) {
    this.log(Warning, ...msg);
  }

  public info(...msg: any) {
    this.log(Info, ...msg);
  }

  public workerProcessingStarted(queueName: string, data: any): void {
    this.info(
      'Starting processing',
      JSON.stringify(
        {
          queueName,
          data,
        },
        null,
        2,
      ),
    );
  }

  // tslint:disable no-console
  private log(type: Types, ...msg: any) {
    const prefix = colors.cyan(`[Logger] - ${type} - ${moment().format(this._dateFormat)}:`);
    const message = msg.join(' ');

    switch (type) {
      case Success:
        console.log(prefix, colors.green(message));
        break;
      case Error:
        console.error(prefix, colors.red(message));
        break;
      case Warning:
        console.warn(prefix, colors.yellow(message));
        break;
      case Info:
        console.info(prefix, colors.blue(message));
        break;
    }
  }
  // tslint:enable no-console
}
