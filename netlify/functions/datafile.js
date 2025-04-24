import { getStore } from '@netlify/blobs';

const store = getStore({ name: 'optimizely-datafile' });
const OPTIMIZELY_DATAFILE_URL = 'https://cdn.optimizely.com/datafiles/FN6PNAH4J4dcZQDj6epN5.json'; // Replace this
const TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function handler(event) {
    if (event.httpMethod === 'GET') {
        let cached = await store.get('datafile', { type: 'json' });

        const now = Date.now();
        const isExpired = !cached || !cached.timestamp || now - cached.timestamp > TTL_MS;

        let datafile;

        if (isExpired) {
            const res = await fetch(OPTIMIZELY_DATAFILE_URL);
            const freshData = await res.json();

            datafile = {
                timestamp: now,
                content: freshData,
            };

            await store.setJSON('datafile', datafile);
            console.log('[Blob] Refreshed and cached new datafile');
        } else {
            datafile = cached;
            console.log('[Blob] Using cached datafile');
        }

        return {
            statusCode: 200,
            body: JSON.stringify(datafile.content),
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
        };
    }

    if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body);
        const payload = {
            timestamp: Date.now(),
            content: body,
        };

        await store.setJSON('datafile', payload);

        return {
            statusCode: 200,
            body: 'Datafile manually updated',
        };
    }

    return {
        statusCode: 405,
        body: 'Method Not Allowed',
    };
}
