package com.perehliadach.cli

import com.perehliadach.cli.exceptions.AppException
import com.perehliadach.cli.services.DocumentValidationService
import com.perehliadach.cli.services.ReportDumpService
import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.boot.info.BuildProperties
import org.springframework.stereotype.Component
import java.io.File
import kotlin.system.exitProcess

@Component
class AppRunner(
    private val documentValidationService: DocumentValidationService,
    private val reportDumpService: ReportDumpService,
    private val buildProperties: BuildProperties
) : ApplicationRunner {
    private val logger = LoggerFactory.getLogger(AppRunner::class.java.name)

    private fun exit(code: Int) {
        println("Exited with code $code")
        exitProcess(0)
    }

    private fun runValidation(
        inputFile: File,
        outputDirectory: String
    ) {
        try {
            logger.info("Validating '${inputFile.path}' file...")
            val validationData = documentValidationService.validateDocument(inputFile)

            reportDumpService.writeToDirectory(
                outputDirectory,
                validationData
            )

            logger.info("See '$outputDirectory' directory for results...")
            exit(0)
        } catch (exception: Exception) {
            val values = reportDumpService.writeExceptionToDirectory(outputDirectory, exception)

            logger.info("Exception: ")
            values.forEach {
                logger.info("- ${it.key}: ${it.value}")
            }

            exit(if (exception is AppException) exception.code.ordinal + 2 else 1)
        }
    }

    override fun run(args: ApplicationArguments) {
        println("perehliadach-cli (${buildProperties.version}, ${buildProperties.time.epochSecond})")

        val inputOption = args.getOptionValues("input")
        val outputOption = args.getOptionValues("output")

        if (
            inputOption == null || inputOption.size < 1 ||
            outputOption == null || outputOption.size < 1
        ) {
            logger.info("--input and --output arguments must be provided")
            exit(1)
        }

        runValidation(
            File(inputOption[0]).normalize(),
            File(outputOption[0]).normalize().absolutePath
        )
    }
}