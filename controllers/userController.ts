import { cPrisma } from "../Shared/Global";
import type { Request, Response } from "express";
import { loginValidator, signupValidator, updateUserValidator } from "../validator/userValidator";
import { responceMeassage } from "../Shared/Constant";

const { userMeassages, serverMeassages } = responceMeassage;
// todo create the constant for Responce meassage

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await cPrisma.user.findMany();
    res.status(200).json(users);
  } catch (error: unknown) {
    res.status(500).json({
      error: error instanceof Error ? error.message : serverMeassages.internalServerError,
    });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: userMeassages.userIdNotfound });
      return;
    }
    const user = await cPrisma.user.findUnique({ where: { id: id } });
    res.status(200).json(user);
  } catch (error: unknown) {
    res.status(500).json({
      error: error instanceof Error ? error.message : serverMeassages.internalServerError,
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: userMeassages.userIdNotfound });
      return;
    }

    const validation = await updateUserValidator.safeParseAsync(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.format() });
      return;
    }

    const { name, email } = validation.data;

    const existingUser = await cPrisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== id) {
      res.status(409).json({ error: userMeassages.emailAlreadyInUse });
      return;
    }

    const updatedUser = await cPrisma.user.update({
      where: { id },
      data: { name, email },
      select: { id: true, name: true, email: true, updatedAt: true },
    });

    res.status(200).json({ message: userMeassages.userUpdatedSuccessfully, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : serverMeassages.internalServerError,
    });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: userMeassages.userIdNotfound });
      return;
    }
    const user = await cPrisma.user.delete({
      where: { id },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : serverMeassages.internalServerError,
      });
  }
};

// * Login Logut Signup

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = await signupValidator.safeParseAsync(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.format() });
      return;
    }

    const { name, email, password } = validation.data;

    const existingUser = await cPrisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: userMeassages.emailAlreadyInUse });
      return;
    }

    const hashedPassword = await Bun.password.hash(password);

    const user = await cPrisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    res.status(201).json({ message: userMeassages.userCreatedSuccessfully, user });
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : serverMeassages.internalServerError,
      });
  }
};

//todo add jwt and store in cookie

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = await loginValidator.safeParseAsync(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.format() });
      return;
    }

    const { email, password } = validation.data;

    const user = await cPrisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: userMeassages.invalidCredentials });
      return;
    }

    const isPasswordValid = await Bun.password.verify(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: userMeassages.invalidCredentials });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : serverMeassages.internalServerError,
    });
  }
};
