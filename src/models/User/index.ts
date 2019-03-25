import * as bcrypt from 'bcrypt';
import { Typegoose, prop, pre, post, instanceMethod, index } from 'typegoose';
import { Document } from 'mongoose';
import * as boom from 'boom';
import { isEmail } from 'validator';

const SALT_ROUND = 10;

@pre<User>('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, SALT_ROUND);
    next();
  } catch (e) {
    next(e);
  }
})
@post<User>('save', (error: Error, _: User, next: (err?: Error) => void) => {
  if (error) {
    // @ts-ignore
    const { name, code } = error;
    if (name === 'MongoError' && code === 11000) {
      next(boom.badData('The email already taken'));
    } else {
      next(error);
    }
  }
})
@index({ email: 'text', firstName: 'text', lastName: 'text' })
export class User extends Typegoose {
  @prop({
    required: true,
    unique: true,
    validate: { validator: isEmail, message: '{VALUE} is not a valid email' },
  })
  public email: string;
  @prop({ required: true })
  public firstName: string;
  @prop({ required: true })
  public lastName: string;
  @prop({ required: true })
  public password: string;
  @prop({ default: false })
  public isVerified: boolean;
  @prop()
  public verificationToken: string;
  @instanceMethod
  public async comparePasswords(password: string) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (e) {
      return null;
    }
  }
}

export interface IUserModel extends User, Document {}

export default new User().getModelForClass(User, {
  schemaOptions: {
    timestamps: true,
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        delete ret.id;
        delete ret.password;
        delete ret.verificationToken;
        return ret;
      },
    },
  },
});
