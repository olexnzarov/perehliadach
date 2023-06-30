package com.perehliadach.cli.services

import com.fasterxml.jackson.databind.ObjectMapper
import com.perehliadach.cli.exceptions.AppException
import com.perehliadach.cli.exceptions.AppExceptionCode
import eu.europa.esig.dss.validation.reports.Reports
import org.springframework.stereotype.Component
import java.io.File

@Component
class ReportDumpService {
    private val objectMapper = ObjectMapper()

    private fun writeToFile(file: String, content: String) {
        File(file).writeText(content)
    }

    fun writeToDirectory(directory: String, reports: Reports) {
        try {
            writeToFile("$directory/simple-report.xml", reports.xmlSimpleReport)
            writeToFile("$directory/validation-report.xml", reports.xmlValidationReport)
            writeToFile("$directory/detailed-report.xml", reports.xmlDetailedReport)
            writeToFile("$directory/diagnostic-data.xml", reports.xmlDiagnosticData)
        } catch(exception: Exception) {
            throw AppException.create(
                AppExceptionCode.FAILED_TO_WRITE_OUTPUT,
                exception.javaClass.name,
                exception
            )
        }
    }

    fun writeExceptionToDirectory(directory: String, exception: Exception): HashMap<String, String> {
        val kvMap = HashMap<String, String>()

        if (exception is AppException) {
            kvMap["cause"] = exception.code.toString()
            kvMap["message"] = exception.message ?: "<no message>"
            kvMap["data"] = exception.data
        } else {
            kvMap["cause"] = AppExceptionCode.UNKNOWN.toString()
            kvMap["message"] = exception.message ?: "<no message>"
            kvMap["data"] = exception.javaClass.name
        }

        val json = objectMapper.writeValueAsString(kvMap)
        writeToFile("$directory/exception.json", json)

        return kvMap
    }
}