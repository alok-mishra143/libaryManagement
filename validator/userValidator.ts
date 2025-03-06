import z from "zod";

export const userValidator = z.object({
  name: z
    .string()
    .min(3, { message: "minimum 3 length required" })
    .max(255, { message: "maximum 255 length required" }),
  password: z.string().min(6, { message: "minimum 6 length required" }),
  email: z
    .string()
    .email({ message: "email is not valid" })
    .max(255, { message: "maximum 255 length required" }),
});

export const loginValidator = userValidator.pick({
  email: true,
  password: true,
});

export const signupValidator = userValidator.pick({
  name: true,
  email: true,
  password: true,
});

export const updateUserValidator = userValidator.pick({
  name: true,
  email: true,
});

export const updatePasswordValidator = userValidator.pick({
  password: true,
});
