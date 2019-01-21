import { PassportStatic } from 'passport';
import { ExtractJwt, JwtFromRequestFunction, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { keys } from './keys';
import { UserModel } from '../models/User';

import { registerUserWithGoogle } from '../services/registerUserWithGoogle';

interface IStrategyOptions {
  jwtFromRequest: JwtFromRequestFunction;
  secretOrKey: string;
}

const strategyOptions: IStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretOrKey
};

const configPassport = (passport: PassportStatic) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(
    new JwtStrategy(strategyOptions, async (jwtPayload, done) => {
      try {
        const user = await UserModel.findOne({ _id: jwtPayload._id });
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        console.log(err);
      }
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/api/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await UserModel.findOne({ googleId: profile.id });
          if (user) {
            return done(null, user);
          }

          const newGoogleuser = await registerUserWithGoogle(profile);
          return done(null, newGoogleuser);
        } catch (err) {
          console.log(err);
        }
      }
    )
  );
};

export { configPassport };

export default configPassport;
