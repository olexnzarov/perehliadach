import { NativeApplication } from '@/scripts/app-core/native-application';
import { XMLParser } from 'fast-xml-parser';
import { normalizePath } from '@/scripts/utils';
import { createLogger } from '@/scripts/app-core/logger';
import simpleReportParser, { ParsedSimpleReport } from './simple-report-parser';

export interface SourceFile {
  name: string;
  buffer: number[];
}

export interface RawReportArtifact {
  name: string;
  file: string;
  content: string;
}

export interface ValidationOutput {
  files: SourceFile[];
  report: ParsedSimpleReport;
  raw: RawReportArtifact[];
}

export class OutputReader {
  private readonly logger = createLogger('eu-dss.output-reader');
  private readonly xmlParser = new XMLParser({ ignoreAttributes: false });

  constructor(private readonly directory: string) {
    this.directory = normalizePath(directory);
  }

  /**
   * Reads the reports and source files from the output directory.
   */
  public async readOutput(): Promise<ValidationOutput> {
    const fs = await NativeApplication.getFileSystem();

    this.logger.info('Reading validation reports...', { directory: this.directory });
    
    const [xmlDetailedReport, xmlSimpleReport, xmlDiagnosticData, xmlValidationReport] = await Promise.all([
      fs.readTextFile(`${this.directory}/detailed-report.xml`),
      fs.readTextFile(`${this.directory}/simple-report.xml`),
      fs.readTextFile(`${this.directory}/diagnostic-data.xml`),
      fs.readTextFile(`${this.directory}/validation-report.xml`)
    ]);

    const report = simpleReportParser.parse(this.xmlParser.parse(xmlSimpleReport));
    const sourceDocuments = simpleReportParser.getSourceDocuments(report);

    const filesToRead = sourceDocuments.map(
      async (documentName: string) => {
        const documentPath = `${this.directory}/source/${documentName}`
        const documentBuffer = await fs.readBinaryFile(documentPath)

        return {
          name: documentName,
          buffer: Array.from(documentBuffer),
        }
      }
    ).flat();

    this.logger.info(`Reading source documents...`, sourceDocuments);

    return {
      files: await Promise.all(filesToRead),
      report,
      raw: [
        { name: 'Simple report', file: 'simple-report.xml', content: xmlSimpleReport },
        { name: 'Detailed report', file: 'detailed-report.xml', content: xmlDetailedReport },
        { name: 'Diagnostic data', file: 'diagnostic-data.xml', content: xmlDiagnosticData },
        { name: 'Validation report (ETSI)', file: 'validation-report-etsi.xml', content: xmlValidationReport },
      ]
    };
  }
}

