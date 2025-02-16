import jwt from 'jsonwebtoken';

class UserService {
  async getToken() {
    const token = jwt.sign({}, 'secret', { expiresIn: '1d' });
    return {
      token: token,
    };
  }
}

export default new UserService();
