import { consts } from "@/utils/consts";
import { z } from "zod";

export const UserUpsert = z.object({
  userName: z
    .string({ message: consts.errors.requiredUserName })
    .nonempty({ message: consts.errors.requiredUserName }),
  password: z.string({ message: consts.errors.requiredPassword }).optional(),
  email: z
    .string({ message: consts.errors.requiredEmail })
    .nonempty({ message: consts.errors.requiredEmail }),
  phone: z
    .string({ message: consts.errors.requiredPhone })
    .nonempty({ message: consts.errors.requiredPhone }),
  nationalCode: z
    .string({ required_error: consts.errors.requirednationalCode })
    .nonempty({ message: consts.errors.requirednationalCode }),
});
