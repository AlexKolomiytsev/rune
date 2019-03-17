import { interfaces } from 'inversify-express-utils';
import { User } from '@app/models/User';

export default class Principal implements interfaces.Principal {
  public details: User;

  public constructor(details: User) {
    this.details = details;
  }

  public async isAuthenticated(): Promise<boolean> {
    return !!this.details;
  }

  public async isResourceOwner(): Promise<boolean> {
    return !!this.details;
  }

  public async isInRole(): Promise<boolean> {
    return !!this.details;
  }
}
