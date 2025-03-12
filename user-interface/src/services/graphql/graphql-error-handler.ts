export const ErrorHandler = (error: any): Array<string> => {
  let result: string[] = [];
  error.graphQLErrors.forEach(
    (err: {
      message: string;
      extensions: { statusCode: number; code: string; originalError: any };
    }) => {
      console.log(err);
      // addToast({
      //   title: err.extensions.originalError
      //     ? err.extensions.originalError.statusCode
      //     : err.extensions.statusCode,
      //   description: err.extensions.originalError
      //     ? err.extensions.originalError.message
      //     : err.message,
      //   color: "danger",
      //   shouldShowTimeoutProgess: true,
      //   timeout: 3000,
      //   severity: "danger",
      //   variant: "flat",
      // });
      result.push(
        `[ ${err.extensions.statusCode.toString()} ] :`.concat(" ", err.message)
      );
    }
  );
  return result;
};
