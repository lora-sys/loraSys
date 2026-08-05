import { json } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { join } from 'path';

export const GET = async () => {
	try {
		const filePath = join(process.cwd(), 'src/lib/data/contributions.json');
		const data = JSON.parse(readFileSync(filePath, 'utf-8'));
		return json(data);
	} catch {
		return json({ totalContributions: 0, weeks: [], lastUpdated: null });
	}
};
