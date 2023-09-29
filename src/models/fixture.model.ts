import mongoose from "mongoose";
import { TeamDoc } from "./team.model";
import { UserDoc } from "./user.model";

// describes the properties required to create a new Fixture
export interface FixtureAttributes {
    match_date: string;
    home_team: TeamDoc;
    away_team: TeamDoc;
    created_by: UserDoc;
    updated_by: UserDoc;
    link: string;
    home_team_score?: string;
    away_team_score?: string;
}

export enum FixtureStatusEnum {
    PENDING = "pending",
    COMPLETED = "completed",
}

// describes the properties that a Fixture Model has
export interface FixtureModel extends mongoose.Model<FixtureDoc> {
    build(attributes: FixtureAttributes): FixtureDoc;
}

// describes properties that a Fixture document has
export interface FixtureDoc extends mongoose.Document {
    match_date: string;
    home_team: TeamDoc;
    away_team: TeamDoc;
    home_team_score?: string;
    away_team_score?: string;
    created_by: UserDoc;
    updated_by: UserDoc;
    status: string;
    link: string;
    created_at: string;
    updated_at: string;
}

const fixtureSchema = new mongoose.Schema(
    {
        match_date: {
            type: Date,
            required: true,
        },

        home_team: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: "Team",
        },

        away_team: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: "Team",
        },

        home_team_score: String,

        away_team_score: String,

        created_by: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: "User",
        },

        updated_by: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: "User",
        },

        status: {
            type: String,
            required: true,
            enum: ["pending", "completed"],
            default: "pending",
        },

        link: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
        toJSON: {
            transform(_doc: FixtureDoc, ret: Record<string, FixtureDoc>) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
            useProjection: true,
            versionKey: false,
        },
    },
);

fixtureSchema.statics.build = (attributes: FixtureAttributes) => {
    return new Fixture(attributes);
};

export const Fixture = mongoose.model<FixtureDoc, FixtureModel>(
    "Fixture",
    fixtureSchema,
);
