import { where } from 'sequelize';
import User from '../models/user.model';

type CreateUserDto = {
	id: number;
};

type UpdateThresholdDto = {
	id: number;
	threshold: number;
};

class UserService {
	createUser(data: CreateUserDto): Promise<User> {
		return User.create({ id: data.id, items: null, threshold: 0 });
	}

	updateThreshold(data: UpdateThresholdDto): Promise<number[]> {
		return User.update(
			{ threshold: data.threshold },
			{ where: { id: data.id } }
		);
	}
}

export default new UserService();
