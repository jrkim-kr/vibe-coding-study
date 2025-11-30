/**
 * 공통 응답 헬퍼 함수
 */

/**
 * 성공 응답
 */
export const sendSuccess = (res, data, message = null, statusCode = 200) => {
  const response = { success: true };
  if (message) response.message = message;
  if (data !== undefined) {
    if (Array.isArray(data) || typeof data === "object") {
      Object.assign(response, data);
    } else {
      response.data = data;
    }
  }
  return res.status(statusCode).json(response);
};

/**
 * 에러 응답
 */
export const sendError = (res, error, statusCode = 500) => {
  const response = {
    success: false,
    error:
      typeof error === "string"
        ? error
        : error.message || "오류가 발생했습니다.",
  };

  if (error?.details) {
    response.details = error.details;
  }

  if (process.env.NODE_ENV === "development" && error?.stack) {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
};

/**
 * 404 Not Found 응답
 */
export const sendNotFound = (res, resource = "리소스") => {
  return sendError(res, `${resource}를 찾을 수 없습니다.`, 404);
};

/**
 * 400 Bad Request 응답
 */
export const sendBadRequest = (res, message = "잘못된 요청입니다.") => {
  return sendError(res, message, 400);
};

/**
 * 401 Unauthorized 응답
 */
export const sendUnauthorized = (res, message = "인증이 필요합니다.") => {
  return sendError(res, message, 401);
};

/**
 * 403 Forbidden 응답
 */
export const sendForbidden = (res, message = "접근 권한이 없습니다.") => {
  return sendError(res, message, 403);
};

/**
 * 409 Conflict 응답
 */
export const sendConflict = (res, message = "이미 존재하는 리소스입니다.") => {
  return sendError(res, message, 409);
};

/**
 * Pagination 헬퍼
 */
export const createPagination = (page, limit, total) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const totalNum = total || 0;

  return {
    page: pageNum,
    limit: limitNum,
    total: totalNum,
    pages: Math.ceil(totalNum / limitNum),
    hasNext: pageNum * limitNum < totalNum,
    hasPrev: pageNum > 1,
  };
};

/**
 * Pagination 계산 (skip, limit)
 */
export const calculatePagination = (page, limit) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  return { skip, limit: limitNum, page: pageNum };
};

/**
 * 비동기 컨트롤러 래퍼 (에러 처리 자동화)
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error("컨트롤러 오류:", error);
      sendError(res, error);
    });
  };
};
