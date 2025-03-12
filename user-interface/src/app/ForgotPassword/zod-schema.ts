import { consts } from "@/utils/consts";
import { z } from "zod";

export const forgotPassword = z.object({
  userName: z
    .string()
    .nonempty({ message: consts.forgotPassword.errors.requiredUsername })
    .default(""),
  newPassword: z
    .string()
    .nonempty({ message: consts.forgotPassword.errors.requiredPassword })
    .default(""),
});
