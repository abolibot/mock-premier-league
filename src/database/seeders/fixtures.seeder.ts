import { findManyTeams } from "@/services/team.service";
import logger from "moment-logger";
import { defaultAdmin } from "./default-admin.seeder";
import { findOneUser } from "@/services/user.service";
import { TeamDoc } from "@/models/team.model";
import { UserDoc } from "@/models/user.model";
import { findManyFixtures, storeFixture } from "@/services/fixture.service";
import {
    generateRandomScore,
    generateUniqueFixtureLink,
} from "@/helpers/utils";

const generateRandomMatchups = async (teams: TeamDoc[], user: UserDoc) => {
    const matchups: [TeamDoc, TeamDoc][] = [];

    for (let i = 0; i < teams.length; i++) {
        const startDate = new Date("2023-01-07 15:00:00");
        const midseason = teams.length / 2;
        const matchDaysFrequency = 7;

        for (let j = i + 1; j < teams.length; j++) {
            matchups.push([teams[i], teams[j]]);
            matchups.push([teams[j], teams[i]]);

            const currentDate = new Date(startDate);
            // eslint-disable-next-line prettier/prettier
            currentDate.setDate(new Date(startDate).getDate() + (j - 1) * matchDaysFrequency);

            const homeTeam = teams[i];
            const awayTeam = teams[j];

            const eitherTeamHasMatchOnDate = await findManyFixtures({
                match_date: currentDate,
                $or: [
                    {
                        home_team: {
                            $in: [homeTeam, awayTeam],
                        },
                    },
                    {
                        away_team: {
                            $in: [homeTeam, awayTeam],
                        },
                    },
                ],
            });

            if (eitherTeamHasMatchOnDate.length > 0) {
                continue;
            }

            const fixtureObj = {
                match_date: currentDate.toDateString(),
                home_team: homeTeam,
                away_team: awayTeam,
                created_by: user,
                updated_by: user,
                link: generateUniqueFixtureLink(
                    homeTeam.short_name,
                    awayTeam.short_name,
                ),
            };

            currentDate.setDate(
                new Date(startDate).getDate() + (midseason - 1) * 7,
            );

            const returnLegFixtureObj = {
                match_date: currentDate.toDateString(),
                home_team: awayTeam,
                away_team: homeTeam,
                created_by: user,
                updated_by: user,
                link: generateUniqueFixtureLink(
                    awayTeam.short_name,
                    homeTeam.short_name,
                ),
            };

            if (currentDate < new Date()) {
                await storeFixture({
                    ...fixtureObj,
                    home_team_score: `${generateRandomScore(0, 5)}`,
                    away_team_score: `${generateRandomScore(0, 5)}`,
                });

                await storeFixture({
                    ...returnLegFixtureObj,
                    home_team_score: `${generateRandomScore(0, 5)}`,
                    away_team_score: `${generateRandomScore(0, 5)}`,
                });
            } else {
                await storeFixture(fixtureObj);
                await storeFixture(returnLegFixtureObj);
            }
        }
    }

    return matchups;
};

export default async (): Promise<void> => {
    logger.log("Seeding fixtures");

    const user = await findOneUser({ email: defaultAdmin.email });

    if (!user) {
        return;
    }

    const teams = await findManyTeams({});

    await generateRandomMatchups(teams, user);

    return;
};
