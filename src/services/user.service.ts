import jwt from 'jsonwebtoken';

class UserService {
  async getToken() {
    return jwt.sign({}, 'secret', { expiresIn: '1d' });
  }
}

export default new UserService();
