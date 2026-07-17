// TODO: Implement user.ts

//this simplifys the info that is sent to the frontend, ensures that no sensitive user intfo (hashedpass) is sent to the frontend
import type { User } from "@prisma/client";

export type SafeUser = Omit<User, "password">

//commonly used data for display on the frontend
export type UserSummary = Pick<User, "id"| "name" | "email" | "role">
