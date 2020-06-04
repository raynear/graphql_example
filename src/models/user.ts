import mongoose, { Schema, Document } from 'mongoose';
import jsonwebtoken from 'jsonwebtoken';

import dotenv from 'dotenv';
import path from 'path';

mongoose.Promise = global.Promise;

dotenv.config({path:path.join(__dirname, "../graphql.env")});

export interface IUser extends Document {
  provider: string,
  id: string,
	email: string,
  username: string,
  avatar: string,
  admin: boolean
}

const userSchema = new Schema({
  provider: { type: String },
	id: { type: String },
	email : { type: String },
  username: { type: String },
  avatar: { type: String },
  admin: { type: Boolean }
});

// userSchema.path('generateAuthToken').set()

export function generateAuthToken (id: string, name: string, email: string, avatar: string, admin: boolean) {
  const token = jsonwebtoken
    .sign(
      {
        id,
        name,
        email,
        avatar,
        admin: !!admin
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '14d',
        issuer: process.env.JWT_ISSUER as string,
        subject: id,
      }
    )
    .toString();
  return token;
}

export function setGoogleAvatarSize (avatarUrl: string, size: number) {
  if (!avatarUrl) return null
  const baseUrl = avatarUrl.split('?')[0]
  return baseUrl + `?sz=${size}`
}

export function findByExternalID(provider: string, id: string) {
  return User.findOne({
    providers: {
      $elemMatch: { provider, id },
    },
  })
}

export async function findByEmail(email: string) {
  return await User.findOne({
    email,
  });// , (e,r)=> {console.log("!@#", r)})
}

export function newUserObj(provider: string, profile: any) {
  // console.log(profile);
  let newUser
  if (provider === 'google') {
    newUser = {
      provider: 'google',
      id: profile.id,
      email: profile.emails[0].value,
      username: profile.displayName,
      avatar: "",
      admin:false
    }
    if (profile.photos[0].value) {
      newUser.avatar = profile.photos[0].value;
    }
  }
  return newUser
}

export function createUser(provider: string, profile: any) {
  const newUser = newUserObj(provider, profile)
  const user = new User(newUser)
  return user.save()
}

export async function findOrCreate(email: string, id: string, provider: string, profile: any) {
  try {
    let user;
    if (email) user = await findByEmail(email);
    if (!user) user = await findByExternalID(provider, id);
    if (!user) {
      user = await createUser(provider, profile);
    }
    const token = generateAuthToken(id, profile.displayName, email, profile.photos[0].value, user.admin);
    // console.log('findOrCreate', token);
    return { user, token };
  } catch (e) {
    return Promise.reject(new Error(e))
  }
}

const User = mongoose.model<IUser>('User', userSchema);

export default User;