export class Logger {
  constructor(
    private readonly namespace: string,
    private readonly color: { background: string; text: string } = { background: 'black', text: 'white' }
  ) {}

  private getPrefix(type: string, textColor: string, backgroundColor: string) {
    return [
      `%c ${type} %c ${this.namespace} `,
      `color: ${textColor}; background-color: ${backgroundColor}; font-weight: 600`,
      `color: ${this.color.text}; background-color: ${this.color.background}`
    ];
  }

  public info(...message: any[]) {
    console.log(
      ...this.getPrefix('ℹ️ info', 'black', '#48cae4'),
      ...message
    );
  }

  public warn(...message: any[]) {
    console.warn(
      ...this.getPrefix('warn', 'black', '#ffea00'),
      ...message
    );
  }

  public error(...message: any[]) {
    console.error(
      ...this.getPrefix('error', 'white', '#bf0603'),
      ...message
    );
  }
}

const backgroundColors = [
  '#797d62', '#d08c60', '#997b66', '#7b8f4b',
  '#aa767c', '#fe6a86', '#603140', '#5e5b52',
  '#48392a', '#421820', '#8e6e53', '#602437',
  '#495057', '#403d39', '#339989', '#000000'
];

let loggerCount = 0;

export const createLogger = (namespace: string) => { 
  const logger = new Logger(
    namespace, 
    { 
      background: backgroundColors[loggerCount % backgroundColors.length], 
      text: 'white' 
    },
  );

  loggerCount++;

  return logger;
};

