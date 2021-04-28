import React from "react";
import { User } from "../helpers";

export const AuthenticatedUser = React.createContext<{
  authenticatedUser: User | null;
  clearAuthenticatedUser: () => void;
} | null>(null);
