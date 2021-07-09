import React from "react";
import DateField from "../../FormTools/DateField/DateField";
import InputField from "../../FormTools/InputField/InputField";
import SelectField from "../../FormTools/SelectField/SelectField";
import { User } from "../../helpers";

export interface UserWithProfile extends User {
  gender: string;
  firstname: string;
  lastname: string;
  birthdate: string;
  phone_number: string;
  email: string;
  password: string;
}

export const profileField = [
  {
    id: "username",
    component: (
      <InputField id="username" name="Username" style={{ width: "100%" }} />
    ),
    disabled: true,
    url: "/api/users",
  },
  {
    id: "password",
    component: (
      <InputField id="password" name="Password" style={{ width: "100%" }} />
    ),
    disabled: true,
    url: "/api/auth",
  },
  {
    id: "firstname",
    component: (
      <InputField id="firstname" name="Firstname" style={{ width: "100%" }} />
    ),
    disabled: true,
    url: "/api/users/profile",
  },
  {
    id: "lastname",
    component: (
      <InputField id="lastname" name="Lastname" style={{ width: "100%" }} />
    ),
    disabled: true,
    url: "/api/users/profile",
  },
  {
    id: "gender",
    component: (
      <SelectField id="gender" name="Gender" style={{ width: "100%" }}>
        <option />
        <option>Male</option>
        <option>Female</option>
      </SelectField>
    ),
    disabled: true,
    url: "/api/users/profile",
  },
  {
    id: "birthdate",
    component: (
      <DateField id="birthdate" name="Birthdate" style={{ width: "100%" }} />
    ),
    disabled: true,
    url: "/api/users/profile",
  },
  {
    id: "phone_number",
    component: (
      <InputField id="phone_number" name="Phone N°" style={{ width: "100%" }} />
    ),
    disabled: true,
    url: "/api/users/profile",
  },
  {
    id: "email",
    component: (
      <InputField id="email" name="Email address" style={{ width: "100%" }} />
    ),
    disabled: true,
    url: "/api/users/profile",
  },
];