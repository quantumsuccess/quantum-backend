import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Define a TypeScript interface for the user document
export interface IUser extends Document {
  firstname: string;
  lastname: string;
  fathername: string;
  mothername: string;
  emailId: string;
  phoneNumber: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date; 
}

// Define schema
const registrationSchema = new Schema<IUser>(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    fathername: {
      type: String,
      required: true,
      trim: true,
    },
    mothername: {
      type: String,
      required: true,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, 'Phone number must be 10 digits'],
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);


// registrationSchema.methods.matchPassword = async function (enteredPassword:string){
//   return await bcrypt.compare(enteredPassword,this.password)
// }

// registrationSchema.pre("save", async function (next) {
//   if (!this.isModified) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// Create model
const Users = model<IUser>('Users', registrationSchema);

export default Users;
