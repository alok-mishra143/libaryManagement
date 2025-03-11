import { cPrisma } from "../Shared/Global";
import type { Request, Response } from "express";
import { responceMeassage } from "../Shared/Constant";
import { addBookValidator, updateBookValidator } from "../validator/bookValidator";

const { bookMeassages, serverMeassages } = responceMeassage;

// ✅ Common Error Handler
const handleError = (res: Response, error: unknown, message = "Internal server error.") => {
  console.error(message, error);
  res.status(500).json({
    success: false,
    message: error instanceof Error ? error.message : serverMeassages.internalServerError,
  });
};

// ✅ Add or Update Book
export const addBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = await addBookValidator.safeParseAsync(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, error: validation.error.format() });
      return;
    }

    const { bookCode, title, author, description, price, stock } = validation.data;

    const book = await cPrisma.book.create({
      data: { bookCode, title, author, description, price, stock },
    });

    res.status(200).json({
      success: true,
      message: bookMeassages.bookCreatedSuccessfully,
      data: book,
    });
  } catch (error) {
    handleError(res, error, serverMeassages.unknownError);
  }
};

// ✅  Update Book

export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ success: false, message: bookMeassages.bookIdNotfound });
      return;
    }
    const validator = await updateBookValidator.safeParseAsync(req.body);
    if (!validator.success) {
      res.status(400).json({ success: false, error: validator.error.format() });
      return;
    }
    const { bookCode, title, author, description, price, stock } = validator.data;

    const book = await cPrisma.book.update({
      where: { id },
      data: { bookCode, title, author, description, price, stock },
    });

    res.status(200).json({
      success: true,
      message: bookMeassages.bookUpdatedSuccessfully,
      data: book,
    });
  } catch (error) {
    console.error(error);
    handleError(res, error, serverMeassages.unknownError);
  }
};

// ✅ Fetch All Books with Pagination, Search & Sorting
export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search = "",
      page = "1",
      limit = "10",
      col = "createdAt",
      order = "asc",
    } = req.query as Record<string, string>;

    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * pageSize;
    const sortOrder = order === "desc" ? "desc" : "asc";

    const searchFilter = search
      ? {
          OR: ["title", "description", "author", "bookCode"].map((field) => ({
            [field]: { contains: search, mode: "insensitive" },
          })),
        }
      : undefined;

    const [books, totalBooks] = await Promise.all([
      cPrisma.book.findMany({
        where: searchFilter,
        orderBy: { [col]: sortOrder },
        skip,
        take: pageSize,
      }),
      cPrisma.book.count({ where: searchFilter }),
    ]);

    res.status(200).json({
      success: true,
      data: books,
      pagination: { page: pageNumber, limit: pageSize, total: totalBooks },
    });
  } catch (error) {
    handleError(res, error, serverMeassages.unknownError);
  }
};

// ✅ Fetch Book by ID
export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ success: false, message: bookMeassages.bookIdNotfound });
      return;
    }

    const book = await cPrisma.book.findUnique({ where: { id } });
    if (!book) {
      res.status(404).json({ success: false, message: bookMeassages.bookNotFound });
      return;
    }

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    handleError(res, error, serverMeassages.unknownError);
  }
};

// ✅ Delete Book by ID
export const deleteBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ success: false, message: bookMeassages.bookIdNotfound });
      return;
    }

    await cPrisma.book.delete({ where: { id } });

    res.status(200).json({ success: true, message: bookMeassages.bookDeletedSuccessfully });
  } catch (error) {
    handleError(res, error, serverMeassages.unknownError);
  }
};
