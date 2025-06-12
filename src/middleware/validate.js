import { AppError } from "../utils/appError.js"

export const validate = (schema) => {
    return (req, res, next) => {

        let dataField = { ...req.body, ...req.params, ...req.query }

        if (req.file) {
            dataField[req.file.fieldname] = req.file;
        }

        if (req.files) {
            Object.keys(req.files).forEach(key => dataField[key] = req.files[key])
        }


        let { error } = schema.validate(dataField, { abortEarly: false })
        if (!error)
            next()
        else {
            let errMsg = error.details.map(err => err.message)
            next(new AppError(errMsg, 401))
        }
    }
}
