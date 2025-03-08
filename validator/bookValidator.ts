import z from "zod";

export const bookSchema = z.object({
  id: z
    .string({ required_error: "Book ID is required." })

    .optional(),

  bookCode: z
    .string({ required_error: "Book code is required." })
    .trim()
    .min(1, "Book code cannot be empty.")
    .max(255, "Book code must not exceed 255 characters."),

  title: z
    .string({ required_error: "Title is required." })
    .trim()
    .min(1, "Title cannot be empty.")
    .max(255, "Title must not exceed 255 characters."),

  author: z
    .string({ required_error: "Author name is required." })
    .trim()
    .min(1, "Author name cannot be empty.")
    .max(255, "Author name must not exceed 255 characters."),

  description: z
    .string({ required_error: "Description is required." })
    .trim()
    .min(1, "Description cannot be empty.")
    .max(1000, "Description must not exceed 1000 characters."),

  price: z
    .number({ required_error: "Price is required." })
    .positive("Price must be greater than zero."),

  stock: z
    .number({ required_error: "Stock count is required." })
    .int("Stock count must be a whole number.")
    .nonnegative("Stock count cannot be negative."),

  borrowBooks: z.array(z.string().uuid("Invalid borrow book ID format.")).default([]),

  createdAt: z.date({ required_error: "Created date is required." }).default(new Date()),

  updatedAt: z.date({ required_error: "Updated date is required." }).default(new Date()),
});

export const addBookValidator = bookSchema.pick({
  bookCode: true,
  title: true,
  author: true,
  description: true,
  price: true,
  stock: true,
});
