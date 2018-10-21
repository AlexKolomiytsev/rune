import { prop, Typegoose, pre } from 'typegoose';
import * as bcrypt from 'bcrypt';

const SALT_ROUND = 10;

@pre<User>('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt
    .hash(this.password, SALT_ROUND)
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(next);
})
class User extends Typegoose {
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
}

export default new User().getModelForClass(User, {
  schemaOptions: {
    timestamps: true,
  },
});
