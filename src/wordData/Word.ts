import z from "zod";

const WordSchema = z.string().brand("Word");
export type Word = z.infer<typeof WordSchema>;

const CharSchema = z.string().brand("Char");
export type Char = z.infer<typeof CharSchema>;