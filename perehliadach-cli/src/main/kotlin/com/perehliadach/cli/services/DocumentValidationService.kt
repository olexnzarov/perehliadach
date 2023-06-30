package com.perehliadach.cli.services

import com.perehliadach.cli.exceptions.AppException
import com.perehliadach.cli.exceptions.AppExceptionCode
import com.perehliadach.cli.providers.CertificateVerifierProvider
import eu.europa.esig.dss.model.FileDocument

import eu.europa.esig.dss.validation.SignedDocumentValidator
import eu.europa.esig.dss.validation.reports.Reports
import org.springframework.stereotype.Component
import java.io.File

@Component
class DocumentValidationService(private val certificateVerifierProvider: CertificateVerifierProvider) {
    fun validateDocument(file: File): Reports {
        try {
            val documentValidator = SignedDocumentValidator.fromDocument(FileDocument(file))

            val certificateVerifier = certificateVerifierProvider.getCertificateVerifier()
            documentValidator.setCertificateVerifier(certificateVerifier)

            return documentValidator.validateDocument()
        } catch(exception: Exception) {
            throw AppException.create(
                AppExceptionCode.FAILED_TO_VALIDATE_DOCUMENT,
                exception.javaClass.name,
                exception
            )
        }
    }
}