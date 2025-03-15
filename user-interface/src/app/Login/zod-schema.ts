import { consts } from "@/utils/consts";
import { z } from "zod";

export const loginSchema = z.object({
  userName: z
    .string()
    .nonempty({ message: consts.errors.requiredUserName })
    .default(""),
  password: z
    .string()
    .nonempty({ message: consts.errors.requiredPassword })
    .default(""),
});
