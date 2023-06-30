package com.perehliadach.cli.services

import com.fasterxml.jackson.databind.ObjectMapper
import com.perehliadach.cli.exceptions.AppException
import com.perehliadach.cli.exceptions.AppExceptionCode
import com.perehliadach.cli.services.data.DocumentValidationData
import org.springframework.stereotype.Component
import java.io.File

@Component
class ReportDumpService {
    private val objectMapper = ObjectMapper()

    private fun writeToFile(file: String, content: String) {
        File(file).writeText(content)
    }

    private fun writeToFile(workingDirectory: File, file: String, content: String) {
        File("${workingDirectory.path}/$file").writeText(content)
    }

    private fun ensureDirectory(directory: String): File {
        val file = File(directory).normalize()
        if (!file.exists()) {
            file.mkdirs()
        }
        return file
    }

    fun writeToDirectory(directory: String, validationData: DocumentValidationData) {
        try {
            val workingDirectory = ensureDirectory(directory)

            // <output-directory>/*.xml
            writeToFile(workingDirectory, "simple-report.xml", validationData.reports.xmlSimpleReport)
            writeToFile(workingDirectory, "validation-report.xml", validationData.reports.xmlValidationReport)
            writeToFile(workingDirectory, "detailed-report.xml", validationData.reports.xmlDetailedReport)
            writeToFile(workingDirectory, "diagnostic-data.xml", validationData.reports.xmlDiagnosticData)

            // Map of <Signature ID> to <Source File>[]
            val sourceManifest = HashMap<String, MutableList<String>>()

            validationData.documents.forEach {
                // <output-directory>/source/<signature>
                val documentsDirectory = ensureDirectory("${workingDirectory.path}/source/${it.key}")
                sourceManifest[it.key] = mutableListOf()

                it.value.forEach { document ->
                    // <output-directory>/source/<signature>/<document>
                    val documentPath = "${documentsDirectory.path}/${document.name}"
                    document.save(documentPath)
                    sourceManifest[it.key]!!.add(documentPath)
                }
            }

            // <output-directory>/source/manifest.json
            writeToFile(workingDirectory, "source/manifest.json", objectMapper.writeValueAsString(sourceManifest))
        } catch (exception: Exception) {
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