const bcrypt = require("bcryptjs");
const validator = require("validator")
const User = require("../model/User");


function checkForNumberAndSymbol(target){
    if(target.match(/[!`\-=@#$%^&*()\[\],.?":;{}|<>1234567890]/g)){
        return true;
    }else{
        return false;
    }
};

function checkIsEmpty (target){
    if(target.length === 0){
        return true;
    }else{
        return false;
    }
}

function checkSymbol(target){
    if(target.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)){
        return true;
    }else{
        return false;
    }
};

function checkIsEmail(target){
    if(target.match(/\S+@\S+\.\S.+/)){
        return false;
    }else{
        return true;
    }
};

function checkPassword(target){
    if(target.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)){
        return false;
    }else{
        return true;
    }
}

async function createUser(req,res){
    const { firstName, lastName, userName, email, password } = req.body; 
    let body = req.body;
    let errObj = {};

    //loop through the array and check if there is an empty space
    for(let key in body){
        if(checkIsEmpty(body[key])){
            errObj[`${key}`] = `${key} cannot be empty`;
        }
    }

    //check if first name has symbols or numbers
    if(checkForNumberAndSymbol(firstName)){
        errObj.firstName = "First Name cannot have special characters";
    }

    //check if last name has symbols or numbers
    if(checkForNumberAndSymbol(lastName)){
        errObj.lastName  = "Last Name cannot have special characters"
    }

    //check for special characters
    if(checkSymbol(userName)){
        errObj.userName = "UserName cannot have special characters";
    }

    //check email
    if(checkIsEmail(email)){
        errObj.email = "Please enter a valid email";
    }

    //check password
    if(checkPassword(password)){
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
module.exports ={
    createUser,
};