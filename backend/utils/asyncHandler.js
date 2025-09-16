

// Higher Order function which take function as an argument
//asyncHandler

export const asyncHandler = (fn) => async (req, res, next)=> {

        try{

            await fn(req, res , next)

        }
        catch(err){
            let statusCode = 500;
            let message = err.message || "Internal Server Error";
            
            if (err.code === 11000) {
                // MongoDB duplicate key error
                statusCode = 400;
                message = "Duplicate entry. Record already exists.";
            } else if (err.name === 'ValidationError') {
                statusCode = 400;
                message = Object.values(err.errors).map(val => val.message).join(', ');
            } else if (err.statusCode && err.statusCode >= 100 && err.statusCode < 1000) {
                statusCode = err.statusCode;
            }
            
            res.status(statusCode).json(
                    {
                        success : false,
                        message : message
                    }
            )
        }

}