import { object, string, strictObject, coerce, number } from "zod";

export const createFixture = object({
    body: strictObject({
        match_date: coerce.date().refine((value) => !isNaN(value.getTime()), {
            message: "Invalid match date-time",
        }),
        home_team: string({
            required_error: "Home team ID is required",
        }).min(2, "Home team ID must be at least 2 characters"),
        away_team: string({
            required_error: "Away team ID is required",
        }).min(2, "Away team ID must be at least 2 characters"),
    }).refine((data) => data.home_team !== data.away_team, {
        path: ["away_team"],
        message: "Home and Away teams must be different",
    }),
});

export const updateFixture = object({
    body: strictObject({
        match_date: coerce.date().refine((value) => !isNaN(value.getTime()), {
            message: "Invalid match date-time",
        }),
    }),
});

export const updateFixtureResult = object({
    body: strictObject({
        home_team_score: number({
            required_error: "Home team score is required",
        }).nonnegative(),
        away_team_score: number({
            required_error: "Away team score is required",
        }).nonnegative(),
    }),
});
