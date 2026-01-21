// Radix Word Decomposition API
// Vercel Serverless Function

import { readFileSync } from 'fs';
import { join } from 'path';

// Load data at cold start
let wordsData = null;
let fragmentsMap = null;

function loadData() {
    if (wordsData && fragmentsMap) return { wordsData, fragmentsMap };

    const dataDir = join(process.cwd(), 'data');

    // Load words index
    try {
        wordsData = JSON.parse(readFileSync(join(dataDir, 'words-academic.json'), 'utf8'));
    } catch (e) {
        console.error('Failed to load words-academic.json:', e.message);
        wordsData = { words: {} };
    }

    // Load all fragments into a map by ID
    fragmentsMap = new Map();
    const corpusFiles = [
        'corpus-elements.json',
        'corpus-testprep.json',
        'corpus-medical.json',
        'corpus-legal.json',
        'corpus-science.json',
        'corpus-suneung.json'
    ];

    for (const file of corpusFiles) {
        try {
            const data = JSON.parse(readFileSync(join(dataDir, file), 'utf8'));
            for (const fragment of data.fragments || []) {
                if (!fragmentsMap.has(fragment.id)) {
                    fragmentsMap.set(fragment.id, fragment);
                }
            }
        } catch (e) {
            console.error(`Failed to load ${file}:`, e.message);
        }
    }

    return { wordsData, fragmentsMap };
}

function decomposeWord(word, lang = 'en') {
    const { wordsData, fragmentsMap } = loadData();
    const w = word.toLowerCase().trim();

    const wordEntry = wordsData.words[w];
    if (!wordEntry) {
        return null;
    }

    // Build decomposition with full fragment details
    const roots = (wordEntry.roots || []).map(root => {
        const fragment = fragmentsMap.get(root.fragment_id);
        if (!fragment) {
            return {
                morpheme: root.morpheme,
                type: root.type,
                position: root.position,
                meaning: 'unknown'
            };
        }

        const result = {
            morpheme: root.morpheme,
            type: root.type,
            position: root.position,
            fragment_id: root.fragment_id,
            meaning: fragment.meaning,
            origin: fragment.origin,
            forms: fragment.forms,
            examples: (fragment.examples || []).slice(0, 5)
        };

        // Add translation if requested
        if (lang !== 'en' && fragment.translations && fragment.translations[lang]) {
            result.translation = fragment.translations[lang].meaning;
        }

        return result;
    });

    return {
        word: w,
        morpheme_count: wordEntry.morpheme_count,
        roots
    };
}

function buildASCIITree(decomposition) {
    if (!decomposition || !decomposition.roots.length) {
        return `[${decomposition?.word || 'unknown'}] - No roots found`;
    }

    const roots = decomposition.roots;
    const lines = [];

    // Build visual breakdown
    lines.push(`Word: ${decomposition.word.toUpperCase()}`);
    lines.push('');
    lines.push('Morpheme Breakdown:');

    // Sort by position
    const sorted = [...roots].sort((a, b) => a.position - b.position);

    // Build the visual chain
    const morphemes = sorted.map(r => `[${r.morpheme.toUpperCase()}]`).join(' + ');
    const meanings = sorted.map(r => r.meaning).join(' + ');

    lines.push(`  ${morphemes}`);
    lines.push(`  ${meanings}`);
    lines.push('');

    // Detail each root
    lines.push('Root Details:');
    for (const root of sorted) {
        const typeIcon = root.type === 'prefix' ? '>' : root.type === 'suffix' ? '<' : '|';
        lines.push(`  ${typeIcon} ${root.morpheme.toUpperCase()} (${root.origin || 'Latin/Greek'})`);
        lines.push(`    Meaning: "${root.meaning}"`);
        if (root.examples && root.examples.length > 0) {
            lines.push(`    Also in: ${root.examples.slice(0, 3).join(', ')}`);
        }
    }

    return lines.join('\n');
}

function searchWords(query) {
    const { wordsData } = loadData();
    const q = query.toLowerCase().trim();

    // Find words that start with or contain the query
    const matches = Object.keys(wordsData.words)
        .filter(word => word.startsWith(q) || word.includes(q))
        .slice(0, 20);

    return matches;
}

export default function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { q, lang = 'en', format = 'json', search } = req.query;

    // Search for words
    if (search) {
        const matches = searchWords(search);
        return res.status(200).json({
            query: search,
            count: matches.length,
            words: matches
        });
    }

    // Decompose a word
    if (q) {
        const decomposition = decomposeWord(q, lang);

        if (!decomposition) {
            return res.status(404).json({
                error: 'Word not found in academic vocabulary',
                word: q,
                suggestion: 'Try /api/lookup?q=' + q + ' to search for roots directly'
            });
        }

        // Return ASCII format if requested
        if (format === 'ascii') {
            res.setHeader('Content-Type', 'text/plain');
            return res.status(200).send(buildASCIITree(decomposition));
        }

        // Add ASCII tree to JSON response
        decomposition.ascii = buildASCIITree(decomposition);

        return res.status(200).json(decomposition);
    }

    // No query - return API info
    return res.status(200).json({
        name: 'Radix Word Decomposition API',
        version: '1.0',
        word_count: loadData().wordsData.word_count || 'unknown',
        endpoints: {
            decompose: '/api/word?q={word}&lang={en|ko|vi}',
            ascii: '/api/word?q={word}&format=ascii',
            search: '/api/word?search={prefix}'
        },
        example: '/api/word?q=beneficial'
    });
}
