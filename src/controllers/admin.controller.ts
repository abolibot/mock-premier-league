import { Request, Response } from "express";

import { jsonSuccessResponse } from "@/helpers/utils";
import { signupUser } from "@/services/auth.service";

export default {
    registerAdmin: async (req: Request, res: Response) => {
        const userObj = { ...req.body, is_admin: true };

        const user = await signupUser(userObj);

        return jsonSuccessResponse(
            res,
            201,
            "Admin user registered successfully",
            user,
        );
    },
};
