import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Users from "../models/registration.js";
import generateToken,{matchPassword} from "../utils/helper.js";



// Define the expected request body type
interface RegisterUserBody {
  firstname: string;
  lastname: string;
  fathername: string;
  mothername: string;
  emailId: string;
  phoneNumber: string;
  password: string;
}

interface AuthRequestBody {
  email: string;
  password: string;
}

// Register user controller
export const registerUser = async (
  req: Request<{}, {}, RegisterUserBody>,
  res: Response
): Promise<void> => {
  try {
    const {
      firstname,
      lastname,
      fathername,
      mothername,
      emailId,
      phoneNumber,
      password,
    } = req.body;

    // Validate required fields
    if (
      !firstname ||
      !lastname ||
      !fathername ||
      !mothername ||
      !emailId ||
      !phoneNumber ||
      !password
    ) {
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
    } else {
      res.status(400).json({ message: "Failed to create the user" });
    }
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const authUser = async (
  req: Request<{}, {}, AuthRequestBody>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  // Find user by email
  const user = await Users.findOne({ emailId:email });
  
  console.log("user",user)
  // Check password
  let passwordMatched
  if(user){
    passwordMatched = await matchPassword(password,user.password)
  }

  if (user && (passwordMatched)) {
    res.json({
      _id: user._id,
      name: user?.firstname,
      email: user?.emailId,
      token: generateToken(user?._id.toString()),
    });
  } else {
    res.status(400).json("Invalid email or password");
    throw new Error("Invalid email or password");
  }
};
