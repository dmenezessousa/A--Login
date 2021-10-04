const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../model/User");

const{
    isEmpty,
    isEmail,
    isStrongPassword,
    isAlphanumeric,
    isAlpha,
} = require("validator");

async function createUser(req,res){
    const { firstName, lastName, userName, email, password } = req.body; 
    let body = req.body;
    let errObj = {};

    //loop through the array and check if there is an empty space
    for(let key in body){
        if(isEmpty(body[key])){
            errObj[`${key}`] = `${key} cannot be empty`;
        }
    }

    //check if first name has symbols or numbers
    if(!isAlpha(firstName)){
        errObj.firstName = "First Name cannot have special characters";
    }

    //check if last name has symbols or numbers
    if(!isAlpha(lastName)){
        errObj.lastName  = "Last Name cannot have special characters"
    }

    //check for special characters
    if(!isAlphanumeric(userName)){
        errObj.userName = "UserName cannot have special characters";
    }

    //check email
    if(!isEmail(email)){
        errObj.email = "Please enter a valid email";
    }

    //check password
    if(!isStrongPassword(password)){
        errObj.password = "Please enter a valid password"
    }

    //check if its empty
    if(Object.keys(errObj).length > 0){
        return res.status(500).json({
            message: "error",
            error: errObj,
        })
    }

    try{
        let salt = await bcrypt.genSalt(10);
        let hashed = await bcrypt.hash(password,salt);

        const createdUser = new User({
            firstName, 
            lastName, 
            userName, 
            email, 
            password: hashed,
        });

        let savedUser = await createdUser.save();
        res.json({message: "success", savedUser});
    }catch(error){
        res.status(500).json({message: "Failure", error: error.message});
    }
}

async function login(req,res){
    //log the user in using email and password
    //if email doesnt exist, error message "please go sign up"
    //if email existts but wrong passsword error message" please check your email and password"
    //iff successul - send message "Login Success";
    const {email, password} = req.body;

    let errObj ={};
    if(isEmpty(password)){
        errObj.email = "email cannot be empty";
    }

    if(isEmpty(email)){
        errObj.email = "email cannot be empty";
    }

    if(!isEmail(email)){
        errObj.email = "please enter a valid email";
    }

    if(Object.keys(errObj).length > 0){
        return res.status(500).json({
            message: "error",
            error: errObj,
        });
    }

    res.json({foundUser});

    try{
        let foundUser = await User.findOne({email: email});
        if(!foundUser){
            return res.status(500).json({
                message: "error",
                error: "please go sign up",
            });
        }else{
            let comparedPassword = await bcrypt.compare(password, foundUser.password);
            if(!comparedPassword){
                return res.status(500).json({
                    message: "error",
                    error: "please check email and password",
                });
        }else{
            return res.json({
                message: "sucess",
            });
        }
    }
    }catch(e){
        res.status(500).json({message: "error", error: e.message});
    }
}
module.exports ={
    createUser,
    login,
};