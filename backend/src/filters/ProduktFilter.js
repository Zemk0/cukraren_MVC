/**
 * ProduktFilter — očistí surový vstup z požiadavky pred validáciou.
 */
export class ProduktFilter {

    /**
     * Filtruje telo POST/PUT požiadavky pre vytvorenie/aktualizáciu produktu.
     *
     * @param {object} body  surové req.body
     * @returns {{ name: string, description: string, price: string, category: string, image: string }}
     */
    static forCreate(body) {
        return {
            name:        String(body.name        ?? '').trim(),
            description: String(body.description ?? '').trim(),
            price:       String(body.price       ?? '').trim(),
            category:    String(body.category    ?? '').trim().toLowerCase(),
            isActive:    Boolean(body.isActive),
            image:       String(body.image       ?? '').trim(),
        };
    }

    static forUpdate(body) {
        const filtered = {};
        if (body.name        !== undefined) filtered.name        = String(body.name).trim();
        if (body.description !== undefined) filtered.description = String(body.description).trim();
        if (body.price       !== undefined) filtered.price       = String(body.price).trim();
        if (body.category    !== undefined) filtered.category    = String(body.category).trim().toLowerCase();
        if (body.isActive    !== undefined) filtered.isActive    = Boolean(body.isActive);
        if (body.image       !== undefined) filtered.image       = String(body.image).trim();
        return filtered;
    }
}
