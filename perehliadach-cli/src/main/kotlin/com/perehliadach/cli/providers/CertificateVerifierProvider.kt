package com.perehliadach.cli.providers

import com.perehliadach.cli.exceptions.AppException
import com.perehliadach.cli.exceptions.AppExceptionCode
import eu.europa.esig.dss.service.crl.OnlineCRLSource
import eu.europa.esig.dss.service.ocsp.OnlineOCSPSource
import eu.europa.esig.dss.spi.x509.aia.DefaultAIASource
import eu.europa.esig.dss.validation.CertificateVerifier
import eu.europa.esig.dss.validation.CommonCertificateVerifier
import org.springframework.stereotype.Component

@Component
class CertificateVerifierProvider(private val certificateSourceProvider: CertificateSourceProvider) {
    fun getCertificateVerifier(): CertificateVerifier {
        try {
            val certificateVerifier = CommonCertificateVerifier()

            certificateVerifier.aiaSource = DefaultAIASource()
            certificateVerifier.ocspSource = OnlineOCSPSource()
            certificateVerifier.crlSource = OnlineCRLSource()

            val certificateSource = certificateSourceProvider.getCertificateSource()
            certificateVerifier.addTrustedCertSources(certificateSource)

            return certificateVerifier
        } catch(exception: Exception) {
            throw AppException.create(
                AppExceptionCode.FAILED_TO_CREATE_CERTIFICATE_VERIFIER,
                exception.javaClass.name,
                exception
            )
        }
    }
}