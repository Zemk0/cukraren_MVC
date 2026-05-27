/**
 * NovinkaFilter — očistí surový vstup z požiadavky pred validáciou.
 */
export class NovinkaFilter {

    static forCreate(body) {
        return {
            title:   String(body.title   ?? '').trim(),
            excerpt: String(body.excerpt ?? '').trim(),
            content: String(body.content ?? '').trim(),
            image:   String(body.image   ?? '').trim(),
            date:    String(body.date    ?? '').trim(),
        };
    }

    static forUpdate(body) {
        const filtered = {};
        if (body.title   !== undefined) filtered.title   = String(body.title).trim();
        if (body.excerpt !== undefined) filtered.excerpt = String(body.excerpt).trim();
        if (body.content !== undefined) filtered.content = String(body.content).trim();
        if (body.image   !== undefined) filtered.image   = String(body.image).trim();
        if (body.date    !== undefined) filtered.date    = String(body.date).trim();
        return filtered;
    }
}
