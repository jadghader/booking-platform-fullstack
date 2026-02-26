export const generateVerificationCode = (length: number): string => {
  const digits = '0123456789'
  let code = ''

  while (code.length < length) {
    code += digits[Math.floor(Math.random() * digits.length)]
  }

  return code
}
