import * as colors from 'colors';
import * as moment from 'moment';

enum Types {
  Success = 'Success',
  Error = 'Error',
  Warning = 'Warning',
  Info = 'Info',
}
const { Success, Error, Warning, Info } = Types;

class Logger {
  private dateFormat: string;

  constructor() {
    this.dateFormat = 'YYYY-MM-DD [at] hh:mm:ssa';
  }

  public success(msg: any) {
    this.log(Success, msg);
  }

  public error(msg: any) {
    this.log(Error, msg);
  }

  public warning(msg: any) {
    this.log(Warning, msg);
  }

  public info(msg: any) {
    this.log(Info, msg);
  }

  // tslint:disable no-console
  private log(type: Types, msg: any) {
    const prefix = colors.cyan(`[Logger] - ${type} - ${moment().format(this.dateFormat)}:`);

    switch (type) {
      case Success:
        console.log(prefix, colors.green(msg));
        break;
      case Error:
        console.error(prefix, colors.red(msg));
        break;
      case Warning:
        console.warn(prefix, colors.yellow(msg));
        break;
      case Info:
        console.info(prefix, colors.blue(msg));
        break;
    }
  }
  // tslint:enable no-console
}

export default new Logger();
