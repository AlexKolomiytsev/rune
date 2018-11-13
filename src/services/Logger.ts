import * as colors from 'colors';
import * as moment from 'moment';

class Logger {
  private dateFormat: string;

  constructor() {
    this.dateFormat = 'YYYY-MM-DD [at] hh:mm:ssa';
  }

  public success(msg: any) {
    this.log('success', msg);
  }

  public error(msg: any) {
    this.log('error', msg);
  }

  public warning(msg: any) {
    this.log('warning', msg);
  }

  public info(msg: any) {
    this.log('info', msg);
  }

  // tslint:disable no-console
  private log(type: 'success' | 'error' | 'warning' | 'info', msg: any) {
    const prefix = colors.cyan(`[logger] - ${type} - ${moment().format(this.dateFormat)}:`);

    switch (type) {
      case 'success':
        console.log(prefix, colors.green(msg));
        break;
      case 'error':
        console.error(prefix, colors.red(msg));
        break;
      case 'warning':
        console.warn(prefix, colors.yellow(msg));
        break;
      case 'info':
        console.info(prefix, colors.blue(msg));
        break;
    }
  }
  // tslint:enable no-console
}

export default new Logger();
