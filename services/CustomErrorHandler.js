// class 

class CustomErrorHandler extends Error {
    constructor(status , message){
        super();
        this.status = status 
        this.message= message         
    }

    static alreadyExist(message){
         return new CustomErrorHandler(409, message);
    }

    static wrongCredentials(message= 'Username or Password is wrong!'){
         return new CustomErrorHandler(401, message);
    }

    static unAuthorized(message = 'unAuthorized'){
        return new CustomErrorHandler(401, message);
    }

    static notFound(message = '404 not found'){
        return new CustomErrorHandler(404, message);
    }

}


export default CustomErrorHandler;