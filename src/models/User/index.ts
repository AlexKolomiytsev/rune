import { prop, Typegoose, pre, instanceMethod } from 'typegoose';
import * as bcrypt from 'bcrypt';

const SALT_ROUND = 10;

@pre<User>('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const hash = await bcrypt.hash(this.password, SALT_ROUND);
    this.password = hash;
    next();
  } catch (e) {
    next(e);
  }
})
export class User extends Typegoose {
  @prop({ required: true, unique: true })
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

export default new User().getModelForClass(User, {
  schemaOptions: {
    timestamps: true,
  },
});
