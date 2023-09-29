import { findOneUser, storeUser } from "@/services/user.service";
import logger from "moment-logger";

export const defaultAdmin = {
    first_name: "Oluwatobi",
    last_name: "Alaran",
    email: "alarantobiloba@gmail.com",
    password: "thusombedu",
    is_admin: true,
};

export default async (): Promise<void> => {
    logger.log("Seeding default admin user");

    const userExists = await findOneUser({ email: defaultAdmin.email });

    if (userExists) {
        return;
    }

    await storeUser(defaultAdmin);

    return;
};
