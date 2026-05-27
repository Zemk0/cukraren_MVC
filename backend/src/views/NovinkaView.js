/**
 * NovinkaView — View v MVC.
 */
export class NovinkaView {

    static list(res, novinky) {
        res.json(novinky.map(NovinkaView.#format));
    }

    static single(res, novinka) {
        res.json(NovinkaView.#format(novinka));
    }

    static created(res, novinka) {
        res.status(201).json(NovinkaView.#format(novinka));
    }

    static updated(res, novinka) {
        res.json(NovinkaView.#format(novinka));
    }

    static deleted(res) {
        res.status(204).send();
    }

    static notFound(res) {
        res.status(404).json({ message: 'Novinka nebola nájdená.' });
    }

    static validationError(res, errors) {
        res.status(422).json({ errors });
    }

    // -------------------------------------------------------------------------

    static #format(novinka) {
        return {
            id:        novinka.id,
            title:     novinka.title,
            excerpt:   novinka.excerpt,
            content:   novinka.content,
            image:     novinka.image,
            date:      novinka.date,
            createdAt: novinka.createdAt,
        };
    }
}
