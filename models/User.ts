import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import {UserFields, UserMethods, UserModel} from '../types';
import {randomUUID} from 'crypto';

const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema<UserFields, UserModel, UserMethods>({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async (username: string) => {
        const user = await User.findOne({username});
        if (user) return false;
        return true;
      },
      message: 'This user is already registered!'
    }
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  }
});

UserSchema.methods.checkPassword = function(password: string)  {
  return bcrypt.compare(password, this.password);
}

UserSchema.methods.generateToken = function () {
  this.token = randomUUID();
}

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  const hash = await bcrypt.hash(this.password, salt);

  this.password = hash;
  next();
});

UserSchema.set('toJSON', {
  transform: (_doc, ret, _options) => {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model<UserFields, UserModel>('User', UserSchema);

export default User;