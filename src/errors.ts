export class CustomError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class DiscountAlreadyExistsError extends CustomError {
	constructor(message = 'Discount already exists on this product') {
		super(message);
	}
}

export class ItemNotFoundError extends CustomError {
	constructor(message = 'Item not found') {
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
