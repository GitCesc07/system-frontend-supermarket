import z from "zod";

//const errorResponseShema = z.object({
//    response: 
//});

const errorShema = z.object({
    isSuccess: z.boolean(),
    message: z.string(),
    title: z.string()
});

export const errorDataSchema = z.array(
    errorShema.pick({
        isSuccess: true,
        message: true,
        title: true
    })
)

export type Error = z.infer<typeof errorShema>;
export type ErrorData = Pick<Error, "isSuccess" | "message" | "title">;