import { object, string, boolean, strictObject } from "zod";

export const createTeam = object({
    body: strictObject({
        name: string({
            required_error: "Name is required",
        }).min(2, "Name must be at least 2 characters"),
        short_name: string({
            required_error: "Short name is required",
        }).min(2, "Short Name must be at least 2 characters"),
        is_active: boolean().optional(),
    }),
});

export const updateTeam = object({
    body: strictObject({
        name: string().min(2, "Name must be at least 2 characters").optional(),
        short_name: string()
            .min(2, "Short Name must be at least 2 characters")
            .optional(),
    }),
});

export const updateTeamStatus = object({
    body: strictObject({
        is_active: boolean({
            required_error: "Team active status is required",
        }),
    }),
});
