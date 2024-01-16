// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface PageCount {
		entries: number,
		pages: number
	}

	interface TimingResponse {
		rank: number,
		date: string,
		name: string,
		car: string,
		input: string | undefined,
		tyre: string | undefined,
		s1: string | undefined,
		s2: string | undefined,
		s3: string | undefined,
		s4: string | undefined,
		time: string,
		fastest: boolean,
		sourcePage: string
	}
	interface PointsResponse {
		rank: number,
		name: string,
		points: number,
		sourcePage: string
	}
	interface OvertakeResponse {
		rank: number,
		date: string,
		name: string,
		car: string,
		duration: string,
		spm: string,
		score: string,
		sourcePage: string
	}
}

export {};
