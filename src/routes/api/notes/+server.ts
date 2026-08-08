import { json } from '@sveltejs/kit';
import { DATA } from '$lib/data/resume';

export function GET() {
	const notes = DATA.notes.map((n) => ({
		title: n.title,
		date: n.date,
		summary: n.summary,
		tags: n.tags
	}));
	return json(notes);
}
