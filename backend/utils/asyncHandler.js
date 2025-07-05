

// Higher Order function which take function as an argument
//asyncHandler

export const asyncHandler = (fn) => async (req, res, next)=> {

        try{

            await fn(req, res , next)

        }
        catch(err){
            res.status(err.code || 500).json(
                    {
                        success : false,
                        message : err.message
                    }
            )
        }

}