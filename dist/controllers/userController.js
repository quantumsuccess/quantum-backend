import bcrypt from 'bcrypt';
import Users from '../models/registration.js';
// Register user controller
export const registerUser = async (req, res) => {
    try {
        const { firstname, lastname, fathername, mothername, emailId, phoneNumber, password, } = req.body;
        // Validate required fields
        if (!firstname || !lastname || !fathername || !mothername || !emailId || !phoneNumber || !password) {
            res.status(400).json({ message: "Please enter all the fields" });
            return;
        }
        // Check if user already exists
        const userExists = await Users.findOne({ emailId });
        if (userExists) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create user
        const user = await Users.create({
            firstname,
            lastname,
            fathername,
            mothername,
            emailId,
            phoneNumber,
            password: hashedPassword,
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                emailId: user.emailId,
                phoneNumber: user.phoneNumber,
                // token: generateToken(user._id),
            });
        }
        else {
            res.status(400).json({ message: "Failed to create the user" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
//# sourceMappingURL=userController.js.map