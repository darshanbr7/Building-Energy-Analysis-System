import  mongoose from "mongoose";

/**
 * This function attempts to establish a connection to the database and logs the result.
 * - It uses the MongoDB connection URL defined in the environment variable `DB_URL`.
 * - If the connection is successful, a success message is logged to the console.
 * - If an error occurs during the connection process, it is caught and logged.
*/

const dbConnect =  async ( ) => {
    try {
        const db_url = process.env.DB_URL
        const connect = await mongoose.connect( db_url );
        if( connect ) console.log( "DB connected Sucessfully!")
    } catch (error) {
        console.log( error.message );
    }
}
export default dbConnect;

const dbConnect1 =  new Promise( ( resolve, reject ) => {
   ( ( ) => {
    const db_url = process.env.DB_URL
   
}  
)()
})