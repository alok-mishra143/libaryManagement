import z from "zod";
import { BorrowType } from "../Shared/Constant";

const dateSchema = z.union([
  z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format." }),
  z.date(),
]);

export const borrowSchema = z
  .object({
    bookId: z.string({ required_error: "Book ID is required." }).trim(),
    userId: z.string({ required_error: "User ID is required." }).trim(),
    borrowAt: dateSchema.default(() => new Date()).optional(),
    returnAt: dateSchema.optional(),
    status: z.nativeEnum(BorrowType).default(BorrowType.BORROWED),
  })
  .strict();

export const addBorrowValidator = borrowSchema.pick({
  bookId: true,
  userId: true,
});
