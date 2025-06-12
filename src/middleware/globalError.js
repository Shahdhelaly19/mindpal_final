

export const globalError = (error, req, res, next) => {
    res.status(error.statusCode || 500)
        .json(
            {
                err: "error",
                message: error.message,
                code: error.statusCode,
                stack:error.stack
            })
}