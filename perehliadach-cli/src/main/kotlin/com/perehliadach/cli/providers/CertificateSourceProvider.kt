package com.perehliadach.cli.providers

import com.perehliadach.cli.exceptions.AppException
import com.perehliadach.cli.exceptions.AppExceptionCode
import eu.europa.esig.dss.spi.x509.CertificateSource
import eu.europa.esig.dss.spi.x509.CommonTrustedCertificateSource
import org.springframework.stereotype.Component

@Component
class CertificateSourceProvider(private val trustedListProvider: TrustedListProvider) {
    fun getCertificateSource(): CertificateSource {
        try {
            val trustedSource = CommonTrustedCertificateSource()
            val trustedCertificateSources = trustedListProvider.getTrustedListCertificateSources()

            trustedCertificateSources.forEach { it ->
                try {
                    trustedSource.importAsTrusted(it)
                } catch(exception: Exception) {
                    throw AppException.create(
                        AppExceptionCode.FAILED_TO_IMPORT_TRUSTED_CERTIFICATE,
                        it.certificates.joinToString("; ") { it.issuer.prettyPrintRFC2253 },
                        exception
                    )
                }
            }

            return trustedSource
        } catch(exception: Exception) {
            throw AppException.create(
                AppExceptionCode.FAILED_TO_CREATE_TRUSTED_ROOT_CERTIFICATE,
                exception.javaClass.name,
                exception
            )
        }
    }
}