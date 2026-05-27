/**
 * GaleriaView — View v MVC.
 */
export class GaleriaView {

    static list(res, items) {
        res.json(items.map(GaleriaView.#format));
    }

    static single(res, item) {
        res.json(GaleriaView.#format(item));
    }

    static created(res, item) {
        res.status(201).json(GaleriaView.#format(item));
    }

    static deleted(res) {
        res.status(204).send();
    }

    static notFound(res) {
        res.status(404).json({ message: 'Obrázok nebol nájdený.' });
    }

    static validationError(res, errors) {
        res.status(422).json({ errors });
    }

    // -------------------------------------------------------------------------

    static #format(item) {
        return {
            id:        item.id,
            title:     item.title,
            image:     item.image,
            createdAt: item.createdAt,
        };
    }
}
