package com.perehliadach.cli

import com.perehliadach.cli.exceptions.AppException
import com.perehliadach.cli.services.DocumentValidationService
import com.perehliadach.cli.services.ReportDumpService
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
    private fun exit(code: Int) {
        println("Exited with code $code")
        exitProcess(0)
    }

    private fun runValidation(
        inputFile: File,
        outputDirectory: String
    ) {
        try {
            reportDumpService.writeToDirectory(
                outputDirectory,
                documentValidationService.validateDocument(inputFile)
            )
            println("See '$outputDirectory' directory for results...")
            exit(0)
        } catch (exception: Exception) {
            val values = reportDumpService.writeExceptionToDirectory(outputDirectory, exception)

            println("Exception:")
            values.forEach {
                println("- ${it.key}: ${it.value}")
            }

            exit(if (exception is AppException) exception.code.ordinal + 2 else 1)
        }
    }

    override fun run(args: ApplicationArguments) {
        println("perehliadach-cli (${buildProperties.version}, ${buildProperties.time.epochSecond})")

        if (!args.containsOption("input") || !args.containsOption("output")) {
            println("--input and --output arguments must be provided")
            exit(1)
        }

        val inputFile = args.getOptionValues("input")[0]
        val outputDirectory = args.getOptionValues("output")[0]

        runValidation(
            File(inputFile),
            outputDirectory
        )
    }
}