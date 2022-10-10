import * as bcrypt from 'bcrypt';

export const Encrypt = {

  encrypt: async (password: string) => {
      const salt = await bcrypt.genSalt(10)
      return await bcrypt.hash(password, salt)
    },

  compare: async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword)
  }
}
