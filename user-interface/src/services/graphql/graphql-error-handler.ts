import { ToastMessage } from "primereact/toast";

export const ErrorHandler = (error: any): ToastMessage[] => {
  let result: ToastMessage[] = [];
  error.graphQLErrors.forEach(
    (err: {
      message: string;
      extensions: { statusCode: number; code: string; originalError: any };
    }) => {
      console.log(err);

      result.push({
        severity: "error",
        summary: err.extensions.originalError
          ? err.extensions.originalError.statusCode.toString()
          : err.extensions.statusCode.toString(),
        detail: err.extensions.originalError
          ? err.extensions.originalError.message
          : err.message,
        life: 3000,
      });
    }
  );
  return result;
};
