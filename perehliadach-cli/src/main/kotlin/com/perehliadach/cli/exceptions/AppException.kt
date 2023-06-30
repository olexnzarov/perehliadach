package com.perehliadach.cli.exceptions

class AppException(
    val code: AppExceptionCode,
    val data: String,
    inner: Exception?,
) : RuntimeException(if (inner != null) (inner.message ?: inner.toString()) else code.toString()) {
    companion object {
        fun create(code: AppExceptionCode, data: String, inner: Exception): AppException {
            if (inner is AppException) {
                return inner
            }

            return AppException(code, data, inner)
        }
    }
}
