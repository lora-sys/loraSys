import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const VIEWS_FILE = path.join(process.cwd(), 'static', '.views.json');

async function getViews() {
	try {
		const raw = await fs.readFile(VIEWS_FILE, 'utf-8');
		return JSON.parse(raw);
	} catch {
		return { total: 0, byPath: {} as Record<string, number> };
	}
}

async function increment(p: string) {
	const data = await getViews();
	data.total = (data.total || 0) + 1;
	data.byPath[p] = (data.byPath[p] || 0) + 1;
	await fs.writeFile(VIEWS_FILE, JSON.stringify(data, null, 2));
	return data;
}

export async function GET({ url }) {
	const p = url.searchParams.get('path') || '/';
	try {
		const data = await increment(p);
		return json({ total: data.total, path: data.byPath[p] || 0 });
	} catch {
		return json({ total: 0, path: 0 }, { status: 500 });
	}
}

export async function POST({ url }) {
	const p = url.searchParams.get('path') || '/';
	try {
		const data = await increment(p);
		return json(data);
	} catch {
		return json({ total: 0, path: 0 }, { status: 500 });
	}
}
