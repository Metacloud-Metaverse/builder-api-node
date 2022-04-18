
const ApiResponseCode = require("../constants/ApiResponseCode");
const BaseException = require("../exceptions/BaseException");

module.exports = class ApiResponse {
  static error(req: any, res: any, statusCode: any, errors: any, message: any) {
    res.status(400);
    res.send({ statusCode, errors, message });
    return;
  }

  static send(
    req: any,
    res: any,
    dataKey: any,
    data: any,
    message = "",
    statusCode = ApiResponseCode.SUCCESS,
    serverCode = 200
  ) {
    const response: any = {};
    response.statusCode = statusCode;
    if (dataKey) {
      response[dataKey] = data;
    } else {
      response.data = null;
    }
    response.message = message;
    return res.status(serverCode).json(response);
  }

  static sendError(
    req: any,
    res: any,
    dataKey: any,
    data: any,
    message = "",
    statusCode = ApiResponseCode.FAIL,
    serverCode = 400
  ) {
    const response: any = {};
    response.statusCode = statusCode;
    if (dataKey) {
      response[dataKey] = data;
    } else {
      response.data = null;
    }
    response.message = message;
    return res.status(serverCode).json(response);
  }

  static sendException(req: any, res: any, exception: any) {
    const response: any = {};
    response.data = null;
    if (exception instanceof BaseException) {
      response.statusCode = exception.statusCode;
      response.serverCode = exception.serverCode;
    } else {
      response.statusCode = ApiResponseCode.SERVER_ERROR;
      response.serverCode = 500;
    }
    response.message = exception.message || "";
    return res.status(response.serverCode).json(response);
  }

  /**
   *
   * @param req
   * @param res
   * @returns {*}
   */
  static sendFromOptions(req: any, res: any, options: any) {
    const statusCode = options.statusCode || ApiResponseCode.SUCCESS;
    const serverCode = options.serverCode || 200;
    const data = options.data || null;
    const dataKey = options.dataKey || "data";
    const message = options.message || "";
    return ApiResponse.send(
      req,
      res,
      dataKey,
      data,
      statusCode,
      serverCode,
      message
    );
  }
}


