class CustomErorHandler extends Error{

    constructor(status, msg) {
        super();
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message) {
        return  new CustomErorHandler(409, message);
    }

    static wrongCredentials(message = 'Incorrect user name or password') {
        return  new CustomErorHandler(401, message);
    }

    static unAuthorized(message = 'unauthorizes') {
        return  new CustomErorHandler(401, message);
    }

    static notFound(message = '404 not found!') {
        return  new CustomErorHandler(404, message);
    }

    static serverError(message = 'Internal erver Error!') {
        return  new CustomErorHandler(500, message);
    }
}


export default CustomErorHandler