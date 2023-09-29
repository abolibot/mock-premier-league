import { findOneUser, storeUser } from "@/services/user.service";
import logger from "moment-logger";

export default async (): Promise<void> => {
    logger.log("Seeding default admin user");

    const userObj = {
        first_name: "Oluwatobi",
        last_name: "Alaran",
        email: "alarantobiloba@gmail.com",
        password: "thusombedu",
        is_admin: true,
    };

    const userExists = await findOneUser({ email: userObj.email });

    if (userExists) {
        return;
    }

    await storeUser(userObj);

    return;
};
