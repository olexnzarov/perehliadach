package com.perehliadach.cli.providers

import com.perehliadach.cli.exceptions.AppException
import com.perehliadach.cli.exceptions.AppExceptionCode
import eu.europa.esig.dss.service.http.commons.CommonsDataLoader
import eu.europa.esig.dss.service.http.commons.FileCacheDataLoader
import eu.europa.esig.dss.spi.tsl.TrustedListsCertificateSource
import eu.europa.esig.dss.tsl.job.TLValidationJob
import eu.europa.esig.dss.tsl.source.TLSource
import org.apache.hc.client5.http.ssl.TrustAllStrategy
import org.springframework.stereotype.Component

@Component
class TrustedListProvider {
    private val trustedListUrls = arrayOf("https://czo.gov.ua/download/tl/TL-UA-EC.xml")

    private fun createTrustedListSource(url: String): TLSource {
        val tlSource = TLSource()
        tlSource.url = url
        return tlSource
    }

    fun getTrustedListCertificateSources():  ArrayList<TrustedListsCertificateSource> {
        try {

            val certificateSources = ArrayList<TrustedListsCertificateSource>()

            val dataLoader = CommonsDataLoader()
            dataLoader.trustStrategy = TrustAllStrategy.INSTANCE

            for (url in trustedListUrls) {
                try {
                    val certificateSource = TrustedListsCertificateSource()

                    val validationJob = TLValidationJob()
                    validationJob.setOnlineDataLoader(FileCacheDataLoader(dataLoader))
                    validationJob.setTrustedListSources(createTrustedListSource(url))
                    validationJob.setTrustedListCertificateSource(certificateSource)

                    validationJob.onlineRefresh()

                    certificateSources.add((certificateSource))
                } catch(exception: Exception) {
                    throw AppException.create(
                        AppExceptionCode.FAILED_TO_DOWNLOAD_TRUSTED_LIST,
                        url,
                        exception
                    )
                }
            }

            return certificateSources
        } catch(exception: Exception) {
            throw AppException.create(
                AppExceptionCode.FAILED_TO_INITIALIZE_TRUSTED_LISTS,
                exception.javaClass.name,
                exception
            )
        }
    }
}