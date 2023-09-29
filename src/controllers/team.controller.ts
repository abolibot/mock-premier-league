import { Request, Response } from "express";

import { jsonSuccessResponse } from "@/helpers/utils";
import { findOneUser } from "@/services/user.service";
import {
    findManyTeams,
    findOneTeam,
    storeTeam,
    updateTeam,
} from "@/services/team.service";
import NotFoundError from "@/errors/not-found.error";
import BadRequestError from "@/errors/bad-request.error";
import AuthenticationError from "@/errors/authentication.error";

export default {
    createTeam: async (req: Request, res: Response) => {
        const user = await findOneUser({ _id: req.session?.user?.id });

        if (!user) {
            throw new AuthenticationError(
                "Missing or invalid authentication token",
            );
        }

        const teamObj = {
            is_active: true,
            ...req.body,
            created_by: user,
            updated_by: user,
        };

        let team = await findOneTeam({ name: teamObj.name });

        if (team) {
            throw new BadRequestError("Team with name already exist");
        }

        team = await findOneTeam({ short_name: teamObj.short_name });

        if (team) {
            throw new BadRequestError("Team with short name already exist");
        }

        team = await storeTeam(teamObj);

        return jsonSuccessResponse(res, 201, "Team created successfully", team);
    },

    updateTeam: async (req: Request, res: Response) => {
        const user = await findOneUser({ _id: req.session?.user?.id });

        if (!user) {
            throw new AuthenticationError(
                "Missing or invalid authentication token",
            );
        }

        let team = await findOneTeam({ _id: req.params.id, is_active: true });

        if (!team) {
            throw new NotFoundError(
                "team with ID does not exist or is inactive",
            );
        }

        if (Object.keys(req.body).length < 1) {
            return jsonSuccessResponse(
                res,
                200,
                "Team updated successfully",
                team,
            );
        }

        team = await updateTeam(team, { ...req.body, updated_by: user });

        return jsonSuccessResponse(res, 200, "Team updated successfully", team);
    },

    updateTeamStatus: async (req: Request, res: Response) => {
        const user = await findOneUser({ _id: req.session?.user?.id });

        if (!user) {
            throw new AuthenticationError(
                "Missing or invalid authentication token",
            );
        }

        let team = await findOneTeam({ _id: req.params.id });

        if (!team) {
            throw new NotFoundError("team with ID does not exist");
        }

        team = await updateTeam(team, { ...req.body, updated_by: user });

        return jsonSuccessResponse(
            res,
            200,
            "Team Status updated successfully",
            team,
        );
    },

    getTeam: async (req: Request, res: Response) => {
        const team = await findOneTeam(
            { _id: req.params.id, is_active: true },
            {},
            { populate: ["created_by", "updated_by"] },
        );

        if (!team) {
            throw new NotFoundError(
                "team with ID does not exist or is inactive",
            );
        }

        return jsonSuccessResponse(res, 200, "Team fetched successfully", team);
    },

    getTeams: async (_req: Request, res: Response) => {
        const teams = await findManyTeams(
            { is_active: true },
            {},
            { populate: ["created_by", "updated_by"] },
        );

        return jsonSuccessResponse(
            res,
            200,
            "Teams fetched successfully",
            teams,
        );
    },
};
