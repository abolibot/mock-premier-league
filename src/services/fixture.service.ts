import {
    Fixture,
    FixtureAttributes,
    FixtureDoc,
    FixtureModel,
} from "@/models/fixture.model";
import {
    FilterQuery,
    ProjectionType,
    QueryOptions,
    UpdateQuery,
} from "mongoose";

export const storeFixture = async (fixtureObj: FixtureAttributes) => {
    const fixture = Fixture.build(fixtureObj);
    await fixture.save();

    return fixture;
};

export const updateFixture = async (
    fixture: FixtureDoc,
    updateObj: UpdateQuery<FixtureDoc>,
): Promise<FixtureDoc> => {
    console.log(updateObj);
    Object.assign(fixture, { ...updateObj });
    await fixture.save();

    return fixture;
};

export const findOneFixture = async (
    query: FilterQuery<FixtureModel> = {},
    projection: ProjectionType<FixtureModel> = {},
    options: QueryOptions = {},
): Promise<FixtureDoc | null> => {
    const fixture = await Fixture.findOne<FixtureDoc>(
        query,
        projection,
        options,
    );

    return fixture;
};

export const findManyFixtures = async (
    query: FilterQuery<FixtureModel> = {},
    projection: ProjectionType<FixtureModel> = {},
    options: QueryOptions = {},
): Promise<FixtureDoc[]> => {
    const fixture = await Fixture.find<FixtureDoc>(query, projection, options);

    return fixture;
};

export const deleteOneFixture = async (
    fixture: FixtureDoc,
): Promise<FixtureDoc> => {
    return await fixture.deleteOne();
};
