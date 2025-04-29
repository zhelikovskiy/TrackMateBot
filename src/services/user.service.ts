import { where } from 'sequelize';
import User from '../models/user.model';

type CreateUserDto = {
	id: number;
};

type UpdateThresholdDto = {
	id: number;
};

class UserService {
	public async createUser(data: CreateUserDto): Promise<User> {
		return User.create({ id: data.id, items: null });
	}

	public async getUser(id: number): Promise<User | null> {
		return User.findOne({ where: { id } });
	}
}

export default new UserService();
