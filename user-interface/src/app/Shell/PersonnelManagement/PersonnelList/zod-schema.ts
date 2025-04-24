import { consts } from "@/utils/consts";
import { z } from "zod";

export const PersonnelUpsert = z.object({
  name: z.string({ message: consts.errors.requiredName }),
  family: z.string({ message: consts.errors.requiredFamily }),
  birthDate: z.date({ message: consts.errors.requiredBirthDate }),
  nationalCode: z.string({
    required_error: consts.errors.requirednationalCode,
  }),
  activation: z.boolean().default(false),
});
