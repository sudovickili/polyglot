import z from "zod";

// There aren't official, separate language codes form simplified/traditional Chinese
export const LearningLanguageSchema = z.literal("zh-simplified")
export const NativeLanguageSchema = z.literal("en")

export const LanguageSettingsSchema = z.object({
  learning: z.string(),
  native: z.string()
})