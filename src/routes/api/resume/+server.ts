import { json } from '@sveltejs/kit';
import { DATA } from '$lib/data/resume';

export function GET() {
	return json({
		name: DATA.name,
		description: DATA.description,
		skills: DATA.skills,
		education: DATA.education.map((e) => ({
			school: e.school,
			degree: e.degree,
			start: e.start,
			end: e.end
		})),
		projects: DATA.projects.map((p) => ({
			title: p.title,
			description: p.description,
			technologies: p.technologies,
			href: p.href
		})),
		social: Object.fromEntries(
			Object.entries(DATA.contact.social).map(([k, v]) => [k, v.url])
		)
	});
}
