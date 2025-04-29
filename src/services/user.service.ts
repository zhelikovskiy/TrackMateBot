import { where } from 'sequelize';
import User from '../models/user.model';

type CreateUserDto = {
	id: number;
};

type UpdateThresholdDto = {
	id: number;
};

class UserService {
	createUser(data: CreateUserDto): Promise<User> {
		return User.create({ id: data.id, items: null});
	}

	getUser(id: number): Promise<User | null> {
		return User.findOne({ where: { id } });
	}

}

export default new UserService();
