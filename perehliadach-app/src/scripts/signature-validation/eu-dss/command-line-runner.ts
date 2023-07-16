import { createLogger } from '@/scripts/app-core/logger';
import { NativeApplication } from '@/scripts/app-core/native-application';

export interface ValidationUtilityResult {
  code: number;
  stdout: string;
}

/* inject-jar-sha1 */ const JAR_SHA1 = 'bf431f154753e1357fe4ba774bc85e57215d2e97' as string;

export class CommandLineRunner {
  private readonly logger = createLogger('eu-dss.command-line-runner');

  private async getJarLocation() {
    const path = await NativeApplication.getPath();
    const absolutePath = await path.resolveResource('resources/perehliadach-cli.jar');
    return absolutePath.replace('\\\\?\\', '');
  }

  private async runCommand(executable: string, args: string[]) {
    const { Command } = await NativeApplication.getShell();

    this.logger.info(`Running...`, [executable, ...args]);

    const command = new Command(
      executable, 
      args
    );

    const response = await command.execute();

    this.logger.info(`Done running, the exit code is ${response.code}`, { stdout: response.stdout });

    return response;
  }

  /**
   * It checks if Java is installed, verifies executable's integrity, and then runs the validation utility.
   */
  public async runValidationUtility(inputFile: string, outputDirectory: string): Promise<ValidationUtilityResult> {
    const jarLocation = await this.getJarLocation();

    const { code, stdout } = await this.runCommand(
        'java', 
        [
            '-jar', jarLocation, 
            `--input=${inputFile}`,
            `--output=${outputDirectory}`
        ]
    );

    return { 
      code: code ?? -1, 
      stdout,
    };
  }
}

export default new CommandLineRunner();
