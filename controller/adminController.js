const adminModel = require("../model/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// register admin
const registerAdminController = async (req, res) => {
  console.log(req.body);

  try {
    const { name, email, password, adminId, phone, admin } = req.body;

    //validation of the adminuser:
    if (!name || !email || !phone || !password || !adminId) {
      return res.status(500).send({
        success: false,
        message: "Please Provide All Fields admin",
      });
    }

    // check the user properly through their emailid and password:
    const exisiting = await adminModel.findOne({ email: email });

    if (exisiting) {
      return res.status(500).send({
        success: false,
        message: "Email Already Registerd please try with different email",
      });
    }

    // Hashing the user password:
    // salt is used for number of times of encryption:
    let hashPassword = await bcrypt.hash(password, 10);

    // create a new user:
    const adminUser = await adminModel.create({
      name,
      email,
      phone,
      password: hashPassword,
      adminId,
      admin,
    });

    console.log(adminUser);

    //if user created successfully:
    return res.status(201).send({
      success: true,
      message: "User is Successfully Registered",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Error while registering",
      error,
    });
  }
};

const loginAdminController = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    //validification of the user:
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please Provide correct Email and Password",
      });
    }

    //check user:
    const adminUser = await adminModel.findOne({ email });

    if (!adminUser) {
      return res.status(404).send({
        success: false,
        message: "Admin not found",
      });
    }

    // check user password || compare password:
    const isMatch = await bcrypt.compare(password, adminUser.password);

    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    //for encrypt-> we use sign.
    //for decrypt-> we use verify.

    const token = jwt.sign({ id: adminUser._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    console.log("token is : ", token);

    adminUser.password = undefined;
    const id = adminUser.adminId;

    res.status(200).send({
      success: true,
      message: "Login Successfull",
      token,
      id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Login failed",
      error,
    });
  }
};

module.exports = { registerAdminController, loginAdminController };
