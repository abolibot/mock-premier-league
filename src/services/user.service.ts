import { User, UserAttributes, UserDoc, UserModel } from "@/models/user.model";
import { FilterQuery, ProjectionType, QueryOptions } from "mongoose";

export const storeUser = async (userObj: UserAttributes) => {
    const user = User.build(userObj);
    await user.save();

    return user;
};

export const findOneUser = async (
    query: FilterQuery<UserModel> = {},
    projection: ProjectionType<UserModel> = {},
    options: QueryOptions = {},
): Promise<UserDoc | null> => {
    const user = await User.findOne<UserDoc>(query, projection, options);

    return user;
};

export const findManyUsers = () => {};
