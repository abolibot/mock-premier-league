import { Team, TeamAttributes, TeamDoc, TeamModel } from "@/models/team.model";
import {
    FilterQuery,
    ProjectionType,
    QueryOptions,
    UpdateQuery,
} from "mongoose";

export const storeTeam = async (teamObj: TeamAttributes) => {
    const team = Team.build(teamObj);
    await team.save();

    return team;
};

export const updateTeam = async (
    team: TeamDoc,
    updateObj: UpdateQuery<TeamDoc>,
): Promise<TeamDoc> => {
    Object.assign(team, { ...updateObj });
    await team.save();

    return team;
};

export const findOneTeam = async (
    query: FilterQuery<TeamModel> = {},
    projection: ProjectionType<TeamModel> = {},
    options: QueryOptions = {},
): Promise<TeamDoc | null> => {
    const team = await Team.findOne<TeamDoc>(query, projection, options);

    return team;
};

export const findManyTeams = async (
    query: FilterQuery<TeamModel> = {},
    projection: ProjectionType<TeamModel> = {},
    options: QueryOptions = {},
): Promise<TeamDoc[]> => {
    const team = await Team.find<TeamDoc>(query, projection, options);

    return team;
};
