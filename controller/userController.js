const userModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const registerController = async (req, res) => {
  try {
    const { name, email, phone, password, userId,pdf } = req.body;

    // Check if all required fields are provided
    if (!(name || email || phone || password || userId || pdf)) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if email already exists
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered, please login",
      });
    }

    const pdfFile = req.files.pdf[0].path;
    console.log(pdfFile);

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    

     

      // Create user
      const user = await userModel.create({
        name,
        email,
        phone,
        password: hashPassword,
        userId,
        pdf:pdfFile,
      });

      if(!user || user.length===0)
      {
        res.status(500).json({
          success:false,
          message:"failed to create user",
        })
      }
      // Send success response
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user,
      });
  
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ success: false, message: "Error registering user", error });
  }
};
const loginController = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    //validification of the user:
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please Provide Email Or Password",
      });
    }

    //check user:
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }

    // check user password || compare password:
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    //for encrypt-> we use sign.
    //for decrypt-> we use verify.

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    console.log("token is : ", token);

    user.password = undefined;

    res.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login API",
      error,
    });
  }
};

// //function for get the user data:
// const getUserController = async(req,res) => {
//   try {

//       //first  find the user:
//       const user = await userModel.findById({_id:req.body.id});

//       //validation of the user , if not then return error:
//       if(!user)
//       {
//           return res.status(404).send({
//               success:false,
//               message:"User Not Found",
//           });
//       }

//       console.log(user);

//       //send response:
//       res.status(200).send({
//           success:true,
//           message:"User get Successfully",
//           user,
//       })
//   } catch (error) {
//       console.log(error);
//       res.status(500).send({
//           success:false,
//           message:"Error in Get User API",
//           error
//       })
//   }
// };

// //for update the user data:
// const updateUserController = async(req,res) =>{
//   try {
//       // first  find the user:
//       const user = await userModel.findById({_id: req.body.id});

//       //validation of the user:
//       if(!user)
//       {
//           return res.status(404).sned({
//               success:false,
//               message:"User Not found"
//           });
//       }

//       // after then update the user data:
//       const {name,email,phone} = req.body;

//       if(name){
//           user.name = name;
//       }
//       if(email){
//           user.email = email;
//       }
//       if(user.phone){
//           user.phone = phone;
//       }

//       //save the updated user data :
//       await user.save();

//       console.log(user);

//       res.status(200).send({
//           success:true,
//           message:"User Updated Successfully"
//       })
//   } catch (error) {
//       console.log(error);
//       res.status(500).send({
//           success:false,
//           message:"Error in Updated User API",
//           error,
//       });
//   }
// };

// // function for update user password :
// const updatePasswordController = async (req, res) => {
//   try {

//     // first  find the user:
//     const user = await userModel.findById({ _id: req.body.id });

//     //validation of the user:
//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "User Not Found",
//       });
//     }
//     // get data from the user (user ko old aur new password dalna hoga tabhi password upddate hoga):
//     const { oldPassword, newPassword } = req.body;

//     if (!oldPassword || !newPassword)
//     {
//       return res.status(500).send({
//         success: false,
//         message: "Please Provide Old or New PasswOrd",
//       });
//     }

//     //check user password  | compare password:
//     const isMatch = await bcrypt.compare(oldPassword, user.password);

//     if (!isMatch) {
//       return res.status(500).send({
//         success: false,
//         message: "Invalid old password",
//       });
//     }
//     //hashing password
//     var salt = bcrypt.genSaltSync(10);

//     const hashedPassword = await bcrypt.hash(newPassword, salt);

//     user.password = hashedPassword;

//     await user.save();

//     console.log(user);

//     res.status(200).send({
//       success: true,
//       message: "Password Updated!",
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error In Password Update API",
//       error,
//     });
//   }
// };

// //function for reset the password:
// const resetPasswordController = async(req,res) =>{
//   try {
//       const {email, newPassword} = req.body;

//       if(!email || !newPassword){
//           return res.status(500).send({
//               success:false,
//               message:"Please Provide ALl fields"
//           });
//       };

//       const user = await userModel.findOne({email});

//       if(!user)
//       {
//           return res.status(500).send({
//               success:false,
//               message:"User Not Found or Invalid answer"
//           });
//       }

//       //hashing password:
//       var salt = bcrypt.genSaltSync(10);
//       const hashedPassword = await bcrypt.hash(newPassword,salt);

//       user.password = hashedPassword;

//       await user.save();

//       res.status(200).send({
//           success:true,
//           message:"Password reset successfully",
//       })
//   } catch (error) {
//       console.log(error);
//       res.status(500).send({
//           success:false,
//           message:"Error in Password Reset API",
//           error,
//       })
//   };
// }

// //DELETE PROFILE ACCOUNT:
// const deleteProfileController = async(req,res) =>{
//   try {
//       const id = req.params.id;
//       const user = await userModel.findByIdAndDelete(id);

//       console.log("delete user is : ",user);
//       return res.status(200).send({
//           success:true,
//           message:"Your account has been deleted",
//       });

//   } catch (error) {
//       console.log(error);
//       res.status(500).send({
//           success:false,
//           message:"Error In Delete Profile API",
//           error,
//       });
//   }
// }

// module.exports = {registerController,loginController,getUserController,updateUserController,updatePasswordController,deleteProfileController,resetPasswordController};

module.exports = { registerController, loginController };
