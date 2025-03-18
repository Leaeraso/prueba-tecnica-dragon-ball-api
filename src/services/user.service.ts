import jwt from 'jsonwebtoken';
import config from '../config/index';
import { UserDto } from '../data/dtos/user.dto';

class UserService {
  async authenticateUser(user: UserDto) {
    const token = jwt.sign({ user }, config.SECRET_KEY!, { expiresIn: '1d' });
    return {
      token: token,
    };
  }
}

export default new UserService();
