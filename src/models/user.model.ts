import mongoose from "mongoose";
import Password from "@/helpers/password";

// describes the properties required to create a new User
export interface UserAttributes {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    is_admin?: boolean;
}

// describes the properties that a User Model has
export interface UserModel extends mongoose.Model<any> {
    build(attributes: UserAttributes): UserDoc;
    isPasswordCorrect(password: string): boolean;
}

// describes properties that a User document has
export interface UserDoc extends mongoose.Document {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    is_admin: boolean;
    created_at: string;
    updated_at: string;
}

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
        },

        last_name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        is_admin: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
        toJSON: {
            transform(_doc: UserDoc, ret: Record<string, UserDoc>) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                delete ret.password;
            },
            useProjection: true,
            versionKey: false,
        },
    },
);

userSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        const hashed = await Password.toHash(this.get("password"));
        this.set("password", hashed);
    }

    done();
});

userSchema.statics.build = (attributes: UserAttributes) => {
    return new User(attributes);
};

export const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
