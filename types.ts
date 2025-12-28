export enum Framework {
  Playwright = 'Playwright',
  Cypress = 'Cypress',
  Selenium = 'Selenium WebDriver'
}

export enum Language {
  TypeScript = 'TypeScript',
  JavaScript = 'JavaScript',
  Python = 'Python',
  Java = 'Java'
}

export interface TestConfig {
  framework: Framework;
  language: Language;
  scenario: string;
}

export interface GeneratedResult {
  code: string;
  explanation: string;
}
