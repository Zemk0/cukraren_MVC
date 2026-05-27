/**
 * ProduktView — View v MVC.
 *
 * Zodpovedá za formátovanie a odosielanie HTTP odpovedí pre produkty.
 * Controller nikdy nevolá res.json() priamo — deleguje to sem.
 */
export class ProduktView {

    static list(res, produkty) {
        res.json(produkty.map(ProduktView.#format));
    }

    static single(res, produkt) {
        res.json(ProduktView.#format(produkt));
    }

    static created(res, produkt) {
        res.status(201).json(ProduktView.#format(produkt));
    }

    static updated(res, produkt) {
        res.json(ProduktView.#format(produkt));
    }

    static deleted(res) {
        res.status(204).send();
    }

    static notFound(res) {
        res.status(404).json({ message: 'Produkt nebol nájdený.' });
    }

    static validationError(res, errors) {
        res.status(422).json({ errors });
    }

    // -------------------------------------------------------------------------

    static #format(produkt) {
        return {
            id:          produkt.id,
            name:        produkt.name,
            description: produkt.description,
            price:       produkt.price,
            category:    produkt.category,
            image:       produkt.image,
            isActive:    produkt.isActive,
            createdAt:   produkt.createdAt,
        };
    }
}
