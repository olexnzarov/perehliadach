# perehliadach-cli

A command line utility that uses DSS (Digital Signature Service) library to work with electronic signatures compatible with European legislation. It also supports Ukrainian European signatures and includes the Ukrainian TL to trusted certificates.

[Натисни на мене, щоб перейти на українську мову.](./README-UA.md)

## References

- [DSS Documentation](https://ec.europa.eu/digital-building-blocks/DSS/webapp-demo/doc/dss-documentation.html#_generic_information)
- [DSS Web Demo](https://ec.europa.eu/digital-building-blocks/DSS/webapp-demo/validation)

## Requirements

- Java 17+

## How to use

`java -jar ./cli.jar --input=signed-file.pdf.asice --output=./validation-result`

**Output Structure:**

- `simple-report.xml`
- `validation-report.xml`
- `detailed-report.xml`
- `diagnostic-data.xml`
- `source/manifest.json`
  - Contains a mapping of signatures to source files.
- `source/<signature>/<source-file>`
- `exception.json`
  - Only available if something happened and reports were not generated.
  - Contains "cause", "data", "message" properties. See [ReportDumpService.kt](./src/main/kotlin/com/perehliadach/cli/services/ReportDumpService.kt) for more information.