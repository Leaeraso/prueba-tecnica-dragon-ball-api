import jwt from 'jsonwebtoken';
import config from '../config/index';
import { UserDto } from '../data/dtos/user.dto';
import { BadRequestError } from '../config/errors';
import { ErrorMessagesKeys } from '../config/errors/error-messages';

class UserService {
  async authenticateUser(user: UserDto) {
    if (!user.email || !user.username) {
      throw new BadRequestError(ErrorMessagesKeys.MISSING_DATA_USER);
    }

    const token = jwt.sign({ user }, config.SECRET_KEY!, { expiresIn: '1d' });
    return {
      token: token,
    };
  }
}

export default new UserService();
