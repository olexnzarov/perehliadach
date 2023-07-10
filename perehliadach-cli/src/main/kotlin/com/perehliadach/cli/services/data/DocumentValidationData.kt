package com.perehliadach.cli.services.data

import eu.europa.esig.dss.model.DSSDocument
import eu.europa.esig.dss.validation.reports.Reports

data class DocumentValidationData(
    val reports: Reports,
    val documents: List<DSSDocument>,
)
