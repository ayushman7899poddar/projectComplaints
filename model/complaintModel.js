const mongoose=require("mongoose");
const validator=require("validator");

const complaintSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:[true,"Name is required"]
    },
    fatherName:{
        type:String,
        required:[true,"fatherName is required"],
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:[true,"phone no is required"],
        unique:true
    },
    idProofNumber:{
        type:String,
        required:true,
        unique:true
    },
    //id proof image model
    idPdf:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    //extra file upload
    applicationPdf:{
        type:String,
        required:true
    },
    //written file upload
    //status of complain 
    access:{
        type:Boolean,
        default:true // complain active to delete make false
    }
});

// const complaint=mongoose.model("complaint",complaintSchema);
// export default complaint;

module.exports = mongoose.model("Complaint",complaintSchema);