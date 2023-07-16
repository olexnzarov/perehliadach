import { usingTemporaryDirectory } from '../app-core/temporary-directory';
import { ExceptionReader } from './eu-dss/exception-reader';
import { OutputReader } from './eu-dss/output-reader';
import commandLineRunner from './eu-dss/command-line-runner';

// TODO: check if Java is installed
// TODO: verify jar checksum
export class SignatureValidator {
  public async runValidation(inputFile: string) {
    return await usingTemporaryDirectory(
      async (directory) => {
        const validationOutput = await commandLineRunner.runValidationUtility(inputFile, directory);
        
        if (validationOutput.code !== 0) {
          const exceptionReader = new ExceptionReader(directory);
          throw await exceptionReader.readException();
        }

        const outputReader = new OutputReader(directory);
        return await outputReader.readOutput();
      }
    );
  }
}

export default new SignatureValidator();

