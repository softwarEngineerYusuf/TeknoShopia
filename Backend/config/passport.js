const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { email, name } = profile._json;

      try {
        // Kullanıcı varsa onu getir, yoksa yeni kullanıcı oluştur
        let user = await User.findOne({ email });
        if (!user) {
          user = new User({
            name,
            email,
            password: " ", // Google kullanıcılarının şifresi olmayacak
            phone: " ", // Gerekli değilse null bırakılabilir
          });
          await user.save();
        }
        done(null, user); // Kullanıcıyı döndürüyoruz
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
