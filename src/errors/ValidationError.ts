/** Error related to user input validation. */
export class ValidationError extends Error {
    public constructor(message: string) {
        super(message);
    }
}
