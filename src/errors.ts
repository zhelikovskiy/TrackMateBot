export class CustomError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class UserHasNoTrackedItemsError extends CustomError {
	constructor(message = 'U have no tracked items') {
		super(message);
	}
}

export class ItemIdNotFoundError extends CustomError {
	constructor(message = 'Item ID not found') {
		super(message);
	}
}

export class ItemNotFoundError extends CustomError {
	constructor(message = 'Item with this ID not found') {
		super(message);
	}
}

export class DiscountAlreadyExistsError extends CustomError {
	constructor(message = 'Discount already exists on this product') {
		super(message);
	}
}

export class PriceParsingError extends CustomError {
	constructor(message = 'Cannot parse price for this item') {
		super(message);
	}
}

export class UnsupportedStoreError extends CustomError {
	constructor(message = 'Unsupported store') {
		super(message);
	}
}
