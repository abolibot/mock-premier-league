import logger from "moment-logger";
import teams from "@/database/data/teams.json";
import { defaultAdmin } from "./default-admin.seeder";
import { findOneUser } from "@/services/user.service";
import { findOneTeam, storeTeam } from "@/services/team.service";
import { TeamAttributes } from "@/models/team.model";

export default async (): Promise<void> => {
    logger.log("Seeding teams");

    const user = await findOneUser({ email: defaultAdmin.email });

    if (!user) {
        return;
    }

    for (const team of teams) {
        let teamExists = await findOneTeam({ name: team.name });

        if (teamExists) {
            continue;
        }

        teamExists = await findOneTeam({ short_name: team.short_name });

        if (teamExists) {
            continue;
        }

        await storeTeam({
            ...team,
            is_active: true,
            created_by: user,
            updated_by: user,
        } as TeamAttributes);
    }

    return;
};
