import bcrypt from "bcrypt";
import Joi from "joi";
import JwtService from "../../services/JwtServices";
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import { REFRESH_SECRET } from "../../config";

const registerController = {
    async register(req, res, next) {
        // valiation
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
            repeat_password: Joi.ref("password"),
        });

        const { error } = registerSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { name, email, password } = req.body;

        // chek user are alerady exist or not
        try {
            const exist = await User.exists({ email: email });
            if (exist) {
                return next(
                    CustomErrorHandler.alreadyExist("This email is already taken")
                );
            }
        } catch (err) {
            return next(err);
        }

        // hash passsword
        const hashedPassword = await bcrypt.hash(password, 10);

        // prepare model for user

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        let access_token;
        let refresh_token;
        try {
            const result = await user.save();

            // return a token to the clinet
            access_token = JwtService.sign({ _id: result._id, role: result.role });
            refresh_token = JwtService.sign({ _id: result._id, role: result.role }, '1y', REFRESH_SECRET);

            // database white list 
             await RefreshToken.create({token : refresh_token})

        } catch (err) {
            return next(err);
        }

        res.json({ access_token , refresh_token });
    },
};

export default registerController;

/*

registation
------------------------------------------------------------
1) validate the request
2) authorise the request
3) check if user is in the database alrady
4) prepare model
5) store in database
6) generate jwt token
7) send response

*/

// we use joi.js library for validate user
