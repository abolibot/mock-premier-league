import { Response } from "express";

export const jsonSuccessResponse = (
    res: Response,
    statusCode: number,
    message?: string,
    data?: any,
): Response => {
    return res.status(statusCode).json({
        status: true,
        message,
        data,
    });
};

export const generateUniqueFixtureLink = (
    homeTeamShortName: string,
    awayTeamShortName: string,
): string => {
    const timestamp = Date.now().toString();
    const uniqueIdentifier = Math.random().toString(36).substring(2, 15);

    return `${timestamp}${uniqueIdentifier}-${homeTeamShortName.toUpperCase()}-${awayTeamShortName.toUpperCase()}`;
};

export const generateRandomScore = (min: number, max: number): number => {
    // Generate a random number between 0 (inclusive) and 1 (exclusive)
    const randomFraction = Math.random();

    // Scale the random number to fit the desired range
    const randomNumberInRange =
        Math.floor(randomFraction * (max - min + 1)) + min;

    return randomNumberInRange;
};
