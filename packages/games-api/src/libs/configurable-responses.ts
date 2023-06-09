type ResponseByLabel<T> =
	| {
			label: string;
			mode: 'single';
			values: T | undefined;
	  }
	| {
			label: string;
			mode: 'array';
			values: Array<T | undefined>;
	  };

/**
 * Inspired from https://www.jamesshore.com/v2/projects/nullables/testing-without-mocks#configurable-responses
 */
export default class ConfigurableResponses<T> {
	private _responses: Array<ResponseByLabel<T>>;

	public constructor(responses: Array<ResponseByLabel<T>>) {
		this._responses = structuredClone(responses);
	}

	public setResponses(responses: Array<ResponseByLabel<T>>): void {
		this._responses = structuredClone(responses);
	}

	public next(label?: string): T | undefined {
		const response = this._responses.find(
			(response) => response.label === label || response.label === '*',
		);
		if (!response) throw new Error(`No response configured`);
		if (response?.mode === 'single') return response.values;
		if (!Array.isArray(response?.values))
			throw new Error(`Expected array of values`);
		if (response.values.length === 0) throw new Error(`No more responses`);
		return response.values.shift();
	}
}
