package com.perehliadach.cli.services

import com.perehliadach.cli.exceptions.AppException
import com.perehliadach.cli.exceptions.AppExceptionCode
import com.perehliadach.cli.providers.CertificateVerifierProvider
import com.perehliadach.cli.services.data.DocumentValidationData
import eu.europa.esig.dss.model.DSSDocument
import eu.europa.esig.dss.model.FileDocument

import eu.europa.esig.dss.validation.SignedDocumentValidator
import org.springframework.stereotype.Component
import java.io.File

@Component
class DocumentValidationService(private val certificateVerifierProvider: CertificateVerifierProvider) {
    fun validateDocument(file: File): DocumentValidationData {
        try {
            val documentValidator = SignedDocumentValidator.fromDocument(FileDocument(file))

            val certificateVerifier = certificateVerifierProvider.getCertificateVerifier()
            documentValidator.setCertificateVerifier(certificateVerifier)

            val documents = HashMap<String, List<DSSDocument>>()
            documentValidator.signatures.forEach {
                documents[it.id] = documentValidator.getOriginalDocuments(it)
            }

            return DocumentValidationData(
                documentValidator.validateDocument(),
                documents,
            )
        } catch (exception: Exception) {
            throw AppException.create(
                AppExceptionCode.FAILED_TO_VALIDATE_DOCUMENT,
                exception.javaClass.name,
                exception
            )
        }
    }
}