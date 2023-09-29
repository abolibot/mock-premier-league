import mongoose from "mongoose";
import { UserDoc } from "./user.model";

// describes the properties required to create a new Team
export interface TeamAttributes {
    name: string;
    short_name: string;
    created_by: UserDoc;
    updated_by: UserDoc;
    is_active: boolean;
}

// describes the properties that a Team Model has
export interface TeamModel extends mongoose.Model<TeamDoc> {
    build(attributes: TeamAttributes): TeamDoc;
}

// describes properties that a Team document has
export interface TeamDoc extends mongoose.Document {
    name: string;
    short_name: string;
    created_by: UserDoc;
    updated_by: UserDoc;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },

        short_name: {
            type: String,
            required: true,
            unique: true,
        },

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

        is_active: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
        toJSON: {
            transform(_doc: TeamDoc, ret: Record<string, TeamDoc>) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
            useProjection: true,
            versionKey: false,
        },
    },
);

teamSchema.statics.build = (attributes: TeamAttributes) => {
    return new Team(attributes);
};

export const Team = mongoose.model<TeamDoc, TeamModel>("Team", teamSchema);
