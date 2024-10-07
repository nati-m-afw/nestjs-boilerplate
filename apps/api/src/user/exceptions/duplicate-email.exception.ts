import { BaseApiException } from '../../shared/exceptions/base-api.exception'

export class DuplicateEmailException extends BaseApiException {
  constructor(email: string) {
    super(`Email ${email} already exists`, 400)
  }
}
