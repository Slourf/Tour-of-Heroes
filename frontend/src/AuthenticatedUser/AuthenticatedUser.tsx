import React from "react";
import { User } from "../helpers";

export const AuthenticatedUser = React.createContext<User | null>(null);