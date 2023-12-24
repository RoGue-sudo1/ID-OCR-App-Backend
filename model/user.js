const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    identification_number : {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    date_of_issue: {
      type: Date,
      required: true,
    },
    date_of_expiry: {
      type: Date,
      required: true,
    },
    isActive:{
        type:Boolean,
        default:true,
    }
    
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;