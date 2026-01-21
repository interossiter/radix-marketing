// Radix Root Lookup API
// Vercel Serverless Function

import { readFileSync } from 'fs';
import { join } from 'path';

// Load all corpus files at cold start
let allFragments = null;

function loadCorpus() {
    if (allFragments) return allFragments;

    const dataDir = join(process.cwd(), 'data');
    const corpusFiles = [
        'corpus-elements.json',
        'corpus-testprep.json',
        'corpus-medical.json',
        'corpus-legal.json',
        'corpus-science.json',
        'corpus-suneung.json'
    ];

    allFragments = [];
    const seenIds = new Set();

    for (const file of corpusFiles) {
        try {
            const data = JSON.parse(readFileSync(join(dataDir, file), 'utf8'));
            for (const fragment of data.fragments || []) {
                if (!seenIds.has(fragment.id)) {
                    seenIds.add(fragment.id);
                    allFragments.push({
                        ...fragment,
                        source: file.replace('corpus-', '').replace('.json', '')
                    });
                }
            }
        } catch (e) {
            console.error(`Failed to load ${file}:`, e.message);
        }
    }

    return allFragments;
}

function searchFragments(query, lang = 'en') {
    const fragments = loadCorpus();
    const q = query.toLowerCase().trim();

    // Search by form (exact match or prefix)
    const byForm = fragments.filter(f =>
        f.forms.some(form => form.toLowerCase() === q || form.toLowerCase().startsWith(q))
    );

    // Search by meaning (contains)
    const byMeaning = fragments.filter(f =>
        f.meaning.toLowerCase().includes(q) ||
        (f.synonyms || []).some(s => s.toLowerCase().includes(q))
    );

    // Combine and dedupe
    const seen = new Set();
    const results = [];
    for (const f of [...byForm, ...byMeaning]) {
        if (!seen.has(f.id)) {
            seen.add(f.id);
            results.push(formatFragment(f, lang));
        }
    }

    return results.slice(0, 10); // Limit to 10 results
}

function formatFragment(fragment, lang) {
    const result = {
        id: fragment.id,
        forms: fragment.forms,
        meaning: fragment.meaning,
        synonyms: fragment.synonyms || [],
        examples: fragment.examples || [],
        origin: fragment.origin,
        position: fragment.position,
        explanation: fragment.explanation,
        source: fragment.source
    };

    // Add translations if requested
    if (lang !== 'en' && fragment.translations && fragment.translations[lang]) {
        result.translation = fragment.translations[lang];
    }

    return result;
}

function findRelatedRoots(fragmentId) {
    const fragments = loadCorpus();
    const target = fragments.find(f => f.id === fragmentId);
    if (!target) return [];

    // Find roots that share examples
    const targetExamples = new Set(target.examples || []);
    const related = fragments
        .filter(f => f.id !== fragmentId)
        .map(f => {
            const sharedExamples = (f.examples || []).filter(e => targetExamples.has(e));
            return { fragment: f, shared: sharedExamples.length };
        })
        .filter(r => r.shared > 0)
        .sort((a, b) => b.shared - a.shared)
        .slice(0, 5)
        .map(r => ({
            id: r.fragment.id,
            forms: r.fragment.forms,
            meaning: r.fragment.meaning,
            sharedExamples: r.shared
        }));

    return related;
}

export default function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { q, id, lang = 'en', related } = req.query;

    // Lookup by ID
    if (id) {
        const fragments = loadCorpus();
        const fragment = fragments.find(f => f.id === id);
        if (!fragment) {
            return res.status(404).json({ error: 'Root not found', id });
        }

        const result = formatFragment(fragment, lang);

        // Include related roots if requested
        if (related === 'true') {
            result.related = findRelatedRoots(id);
        }

        return res.status(200).json(result);
    }

    // Search by query
    if (q) {
        const results = searchFragments(q, lang);
        return res.status(200).json({
            query: q,
            count: results.length,
            results
        });
    }

    // No query provided - return API info
    return res.status(200).json({
        name: 'Radix Root Lookup API',
        version: '1.0',
        endpoints: {
            search: '/api/lookup?q={query}&lang={en|ko|vi}',
            byId: '/api/lookup?id={root_id}&related=true',
        },
        example: '/api/lookup?q=bene'
    });
}
