import { createLogger } from '@/scripts/app-core/logger';
import { arrayify } from '@/scripts/utils';

export interface DocumentInScope {
  name: string;
  scope: string;
  type: string;
}

export interface ReportSignature {
  signedBy: string;
  verified: boolean;
  documents: DocumentInScope[];
  trustedCertificate?: string;
  bestSignatureTime?: Date;
}

export interface ReportValidationPolicy {
  name: string;
  description: string;
}

export interface ParsedSimpleReport {
  documentName: string;
  containerType: string;
  policy: ReportValidationPolicy;
  signatures: ReportSignature[];
}

export class SimpleReportParser {
  private readonly logger = createLogger('eu-dss.simple-report-parser');

  private isValidSignature(signature: any) {
    // TOTAL_PASSED, TOTAL_FAILED, INDETERMINATE, PASSED, FAILED, NO_SIGNATURE_FOUND
    return signature.Indication === 'TOTAL_PASSED';
  }

  public getSourceDocuments(report: ParsedSimpleReport): string[] {
    return Array.from(
      new Set(
        report.signatures
          .map(s => s.documents)
          .flat()
          .filter(d => d.type === 'Full document') // ASiC-E will contain signed manifests.
          .map(d => d.name)
      )
    );
  }

  /**
   * Changes parsed simple XML report structure to a usable, readable, and type-safe format.
   */
  public parse({ SimpleReport }: any): ParsedSimpleReport {
    this.logger.info('Parsing the simple report...', { document: SimpleReport.DocumentName });

    const policy: ReportValidationPolicy = {
      name: SimpleReport.ValidationPolicy.PolicyName,
      description: SimpleReport.ValidationPolicy.PolicyDescription,
    };

    this.logger.info('Validation policy', policy);
  
    const signatures: ReportSignature[] = arrayify(SimpleReport.Signature).map(
      (signature: any) => {
        return {
          signedBy: signature.SignedBy,
          verified: this.isValidSignature(signature),
          documents: arrayify(signature.SignatureScope).map(
            (file: any) =>
              ({ name: file['@_name'], scope: file['@_scope'], type: file['#text'] })
          ),
          trustedCertificate: arrayify(signature.CertificateChain.Certificate).find((c: any) => c['@_trusted'])?.QualifiedName ?? undefined,
          bestSignatureTime: signature.BestSignatureTime ? new Date(signature.BestSignatureTime) : undefined,
        }
      }
    );

    this.logger.info(`Found ${signatures.length} signature(s)`, signatures);
  
    return {
      documentName: SimpleReport.DocumentName,
      containerType: SimpleReport.ContainerType,
      policy,
      signatures,
    };
  }
}

export default new SimpleReportParser();
