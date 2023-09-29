import AuthenticationError from "@/errors/authentication.error";
import BadRequestError from "@/errors/bad-request.error";
import NotFoundError from "@/errors/not-found.error";
import {
    generateUniqueFixtureLink,
    jsonSuccessResponse,
} from "@/helpers/utils";
import { FixtureStatusEnum } from "@/models/fixture.model";
import {
    deleteOneFixture,
    findManyFixtures,
    findOneFixture,
    storeFixture,
    updateFixture,
} from "@/services/fixture.service";
import { findOneTeam } from "@/services/team.service";
import { findOneUser } from "@/services/user.service";
import { Request, Response } from "express";

export default {
    createFixture: async (req: Request, res: Response) => {
        const user = await findOneUser({ _id: req.session?.user?.id });

        if (!user) {
            throw new AuthenticationError(
                "Missing or invalid authentication token",
            );
        }

        // check that teams are active
        const homeTeam = await findOneTeam({
            _id: req.body.home_team,
            is_active: true,
        });

        if (!homeTeam) {
            throw new BadRequestError(
                "Team with provided home team ID does not exist or is inactive",
            );
        }

        const awayTeam = await findOneTeam({
            _id: req.body.away_team,
            is_active: true,
        });

        if (!awayTeam) {
            throw new BadRequestError(
                "Team with provided away team ID does not exist or is inactive",
            );
        }

        // check that teams don't already have a match on match date
        const eitherTeamHasMatchOnDate = await findManyFixtures({
            match_date: req.body.match_date,
            $or: [
                {
                    home_team: {
                        $in: [req.body.home_team, req.body.away_team],
                    },
                },
                {
                    away_team: {
                        $in: [req.body.home_team, req.body.away_team],
                    },
                },
            ],
        });

        if (eitherTeamHasMatchOnDate.length > 0) {
            throw new BadRequestError(
                "one of the teams has a match on provided match date",
            );
        }

        const uniqueLink = generateUniqueFixtureLink(
            homeTeam.short_name,
            awayTeam.short_name,
        );

        const fixtureObj = {
            ...req.body,
            home_team: homeTeam,
            away_team: awayTeam,
            created_by: user,
            updated_by: user,
            link: uniqueLink,
        };

        const fixture = await storeFixture(fixtureObj);

        return jsonSuccessResponse(
            res,
            201,
            "Fixture created successfully",
            fixture,
        );
    },

    updateFixture: async (req: Request, res: Response) => {
        const user = await findOneUser({ _id: req.session?.user?.id });

        if (!user) {
            throw new AuthenticationError(
                "Missing or invalid authentication token",
            );
        }

        let fixture = await findOneFixture({
            _id: req.params.id,
            status: FixtureStatusEnum.PENDING,
        });

        if (!fixture) {
            throw new NotFoundError(
                "Fixture with ID does not exist or has already been completed",
            );
        }

        if (Object.keys(req.body).length < 1) {
            return jsonSuccessResponse(
                res,
                200,
                "Fixture updated successfully",
                fixture,
            );
        }

        fixture = await updateFixture(fixture, {
            ...req.body,
            updated_by: user,
        });

        return jsonSuccessResponse(
            res,
            200,
            "Fixture updated successfully",
            fixture,
        );
    },

    updateFixtureResult: async (req: Request, res: Response) => {
        const user = await findOneUser({ _id: req.session?.user?.id });

        if (!user) {
            throw new AuthenticationError(
                "Missing or invalid authentication token",
            );
        }

        let fixture = await findOneFixture({
            _id: req.params.id,
            status: FixtureStatusEnum.PENDING,
        });

        if (!fixture) {
            throw new NotFoundError(
                "Fixture with ID does not exist or has already been completed",
            );
        }

        fixture = await updateFixture(fixture, {
            ...req.body,
            updated_by: user,
            status: FixtureStatusEnum.COMPLETED,
        });

        return jsonSuccessResponse(
            res,
            200,
            "Fixture result updated successfully",
            fixture,
        );
    },

    getFixture: async (req: Request, res: Response) => {
        const fixture = await findOneFixture(
            { _id: req.params.id },
            {},
            {
                populate: [
                    "created_by",
                    "updated_by",
                    "home_team",
                    "away_team",
                ],
            },
        );

        if (!fixture) {
            throw new NotFoundError("fixture with ID does not exist");
        }

        return jsonSuccessResponse(
            res,
            200,
            "Fixture fetched successfully",
            fixture,
        );
    },

    getFixtures: async (req: Request, res: Response) => {
        const status = req.query.status as FixtureStatusEnum;

        const fixtures = await findManyFixtures(
            {
                ...(status && { status }),
            },
            {},
            {
                populate: [
                    "created_by",
                    "updated_by",
                    "home_team",
                    "away_team",
                ],
            },
        );

        return jsonSuccessResponse(
            res,
            200,
            "Fixtures fetched successfully",
            fixtures,
        );
    },

    deleteFixture: async (req: Request, res: Response) => {
        let fixture = await findOneFixture({ _id: req.params.id });

        if (!fixture) {
            throw new NotFoundError("fixture with ID does not exist");
        }

        fixture = await deleteOneFixture(fixture);

        return jsonSuccessResponse(res, 204);
    },
};
