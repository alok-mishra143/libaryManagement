import { BorrowType, responceMeassage } from "../Shared/Constant";
import { cPrisma } from "../Shared/Global";
import type { Request, Response } from "express";
import { addBorrowValidator } from "../validator/borrowValidator";
import { sendMail } from "../mail/sendMail";

const { serverMeassages, borrowMeassages, userMeassages } = responceMeassage;

// ✅ Common Error Handler
const handleError = (
  res: Response,
  error: unknown,
  message = serverMeassages.internalServerError,
) => {
  console.error(message, error);
  res.status(500).json({
    success: false,
    message: error instanceof Error ? error.message : serverMeassages.internalServerError,
  });
};

// ✅ Borrow a Book
export const addBorrow = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = await addBorrowValidator.safeParseAsync(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, error: validation.error.format() });
      return;
    }

    const { bookId, userId } = validation.data;

    const [book, user] = await Promise.all([
      cPrisma.book.findUnique({ where: { id: bookId } }),
      cPrisma.user.findUnique({ where: { id: userId } }),
    ]);

    if (!book || book.stock <= 0) {
      res.status(404).json({ success: false, error: borrowMeassages.bookNotAvailable });
      return;
    }
    if (!user) {
      res.status(404).json({ success: false, error: userMeassages.userNotFound });
      return;
    }

    // ✅ Decrease book stock & Create Borrow record in one transaction
    const borrow = await cPrisma.$transaction([
      cPrisma.book.update({
        where: { id: bookId },
        data: { stock: { decrement: 1 } },
      }),
      cPrisma.borrowedBook.create({
        data: {
          bookId,
          userId,
          borrowedAt: new Date(),
          status: BorrowType.BORROWED,
        },
      }),
    ]);

    const borrowMail = await sendMail({
      to: user.email,
      subject: borrowMeassages.bookBorrowedSuccessfully,
      text: `${borrowMeassages.bookBorrowedSuccessfully} "${book.title}"!`,
    });

    res.status(201).json({
      success: true,
      message: borrowMeassages.bookBorrowedSuccessfully,
      borrow: borrow[1],
      mail: borrowMail,
    });
  } catch (error) {
    handleError(res, error, serverMeassages.unknownError);
  }
};

// ✅ Return a Borrowed Book
export const returnBorrow = async (req: Request, res: Response): Promise<void> => {
  try {
    const borrowId = req.params.id;

    const borrow = await cPrisma.borrowedBook.findUnique({
      where: { id: borrowId },
      include: { book: true },
    });

    if (!borrow) {
      res.status(404).json({ success: false, error: borrowMeassages.borrowNotFound });
      return;
    }

    const user = await cPrisma.user.findUnique({
      where: { id: borrow.userId },
    });
    if (!user) {
      res.status(404).json({ success: false, error: userMeassages.userNotFound });
      return;
    }

    if (borrow.status === BorrowType.RETURNED) {
      res.status(400).json({ success: false, error: borrowMeassages.bookAlreadyReturned });
      return;
    }

    // ✅ Mark as returned and increment book stock in a single transaction
    await cPrisma.$transaction([
      cPrisma.borrowedBook.update({
        where: { id: borrowId },
        data: { status: BorrowType.RETURNED, returnedAt: new Date() },
      }),
      cPrisma.book.update({
        where: { id: borrow.book.id },
        data: { stock: { increment: 1 } },
      }),
    ]);
    const returnMail = await sendMail({
      to: user.email,
      subject: borrowMeassages.bookReturnedSuccessfully,
      text: `${borrowMeassages.bookReturnedSuccessfully} "${borrow.book.title}"!`,
    });

    res
      .status(200)
      .json({ success: true, message: borrowMeassages.bookReturnedSuccessfully, mail: returnMail });
  } catch (error) {
    handleError(res, error, serverMeassages.unknownError);
  }
};
