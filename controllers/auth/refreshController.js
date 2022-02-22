import Joi from "joi";
import { REFRESH_SECRET } from "../../config";
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtServices";

const refreshController = {
  async refresh(req, res, next) {
    // validate request
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });
    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    // database
    let Refreshtoken;
    try {
      Refreshtoken = await RefreshToken.findOne({
        token: req.body.refresh_token,
      });   
      if (!Refreshtoken) {
        return next(CustomErrorHandler.unAuthorized("Invalid request 1s"));
      }
      let userId;
      try {
        const { _id } = await JwtService.verify(
          Refreshtoken.token,
          REFRESH_SECRET
        );
        userId = _id;
      } catch (error) {
        return next(new Error("invalid refresh token"));
      }

      const user = await User.findOne({ id: userId });
      if (!user) {
        return next(CustomErrorHandler.unAuthorized("no user found"));
      }

      //   tokens
      const access_token = JwtService.sign({ _id: user._id, role: user.role });
      const refresh_token = JwtService.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRET
      );

      res.json({ access_token, refresh_token });
       
    } catch (error) {
      return next(new Error("somthing want wronge" + error.message));
    }
  },
};

export default refreshController;
