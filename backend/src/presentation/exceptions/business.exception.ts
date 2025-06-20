export class BusinessException extends Error {
  constructor(message: string | string[]) {
    super(Array.isArray(message) ? message.join('; ') : message);
    this.name = 'BusinessException';
  }
} 