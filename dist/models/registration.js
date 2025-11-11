import { Schema, model } from 'mongoose';
// Define schema
const registrationSchema = new Schema({
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
}, {
    timestamps: true, // adds createdAt and updatedAt
});
// Create model
const Users = model('Users', registrationSchema);
export default Users;
//# sourceMappingURL=registration.js.map