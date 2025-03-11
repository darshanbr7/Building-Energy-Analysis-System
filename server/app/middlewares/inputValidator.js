import { validationResult } from "express-validator";
/**
 * This is the Middleware function to validate input data using express-validator.
 * @param {Object} req - The Express request object, which contains the user input to be validated.
 * @param {Object} res - The Express response object, used to send validation error responses.
 * @param {Function} next - The Express `next` function to pass control to the next middleware.
 * @returns {void|Response} -
    * If validation errors are found, sends a 400 status response with the list of errors.
    * If no errors are found, it calls the `next` middleware.
*/
const inputValidator = ( req, res, next ) => {
    try {
        const errors = validationResult( req );
        if( !errors.isEmpty() ){
            return res.status( 400 ).json( { error : errors.array() })
        } 
        next();
    } catch( error ) {
        throw new Error ( [ { msg : error.message } ] );
    }
}

export default inputValidator;