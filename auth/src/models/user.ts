import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface which defines the properties needed to create a new User

interface UserAttrs {
  email: string;
  password: string;
}

// An interface which defines the properties a User model has

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// This has nothing to do with typescript. Defines a schema only for mongoose
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
    done();
  }
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Typescript has not idea what properties are fed into the User object
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
