import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { createHmac } = await import('crypto');
const { Schema } = mongoose;

  const userSchema = new Schema({
    name:{
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastname:{
        type: String,
        maxlength: 32,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },  
    userinfo: {
      type: String,
      trim: true
    },
    
    encry_password:{
      type: String,
      required: true
    },
    salt: String,
    role: {
      type: Number,
      default: 0
    },
    purchases: {
      type: Array,
      default: []
    }
  }, {timestamps: true});

  userSchema.virtual("password")
    .set(function(password)
    {
      this.password= password;
      this.salt= uuidv4();
      this.encry_password = this.securePassword(password);
    })
    .get(function(){
      return this._password;
    })

  userSchema.methods={
    authenticate: function(plainpassword)
    {
      return this.securePassword(password)===this.encry_password;
    }
,
    securePassword: function(plainpasword)
    {
      if(!plainpassword) return "";
      try {
        return createHmac('sha256', this.salt)
        .update(plainpasword)
        .digest('hex');
      } catch (error) {
        return "";
      }
    }
  }
  module.exports = mongoose.model("User",userSchema);