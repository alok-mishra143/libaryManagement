export const responceMeassage = {
  userMeassages: {
    userNotFound: "User not found",
    emailAlreadyInUse: "Email is already in use by another user",
    userUpdatedSuccessfully: "User updated successfully",
    invalidCredentials: "Invalid credentials",
    userCreatedSuccessfully: "User created successfully",
    userDeletedSuccessfully: "User deleted successfully",
    userLoggedOutSuccessfully: "User logged out successfully",
    userIdNotfound: "User ID is required",
  },
  bookMeassages: {
    bookNotFound: "Book not found",
    bookCreatedSuccessfully: "Book created successfully",
    bookDeletedSuccessfully: "Book deleted successfully",
    bookUpdatedSuccessfully: "Book updated successfully",
    bookIdNotfound: "Book ID is required",
  },
  borrowMeassages: {
    borrowNotFound: "Borrow record not found",
    bookNotAvailable: "Book is not available",
    bookAlreadyReturned: "Book already returned",
    bookBorrowedSuccessfully: "Book borrowed successfully",
    bookReturnedSuccessfully: "Book returned successfully",
  },
  serverMeassages: {
    unknownError: "Unknown error",
    internalServerError: "Internal server error",
  },
};
export enum BorrowType {
  BORROWED = "BORROWED",
  RETURNED = "RETURNED",
}
