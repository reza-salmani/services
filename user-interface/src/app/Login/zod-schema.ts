import { consts } from "@/utils/consts";
import { z } from "zod";

export const loginSchema = z.object({
  userName: z
    .string()
    .nonempty({ message: consts.login.errors.requiredUsername })
    .default(""),
  password: z
    .string()
    .nonempty({ message: consts.login.errors.requiredPassword })
    .default(""),
});
