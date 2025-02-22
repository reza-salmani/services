export const ErrorHandler = (error: any): Array<string> => {
  let result: string[] = [];
  error.graphQLErrors.forEach(
    (err: {
      message: string;
      extensions: { statusCode: number; code: string; description: string };
    }) => {
      result.push(
        `[ ${err.extensions.statusCode.toString()} ] :`.concat(
          " ",
          err.extensions.description
        )
      );
    }
  );
  return result;
};
