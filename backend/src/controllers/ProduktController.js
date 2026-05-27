import { ProduktService }   from '../models/ProduktService.js';
import { ProduktFilter }    from '../filters/ProduktFilter.js';
import { ProduktValidator } from '../validators/ProduktValidator.js';
import { ProduktView }      from '../views/ProduktView.js';

const produktService = new ProduktService();

/**
 * ProduktController — Controller v MVC.
 *
 * Prijíma HTTP požiadavku, koordinuje Filter → Validator → Model → View
 * a odošle odpoveď. Neobsahuje SQL ani žiadnu logiku formátovania.
 */
export class ProduktController {

    /**
     * GET /api/produkty
     * GET /api/produkty?category=torty
     */
    async index(req, res, next) {
        try {
            const { category } = req.query;
            const produkty = category
                ? await produktService.findByCategory(category)
                : await produktService.findAll();
            ProduktView.list(res, produkty);
        } catch (err) {
            next(err);
        }
    }

    async indexAll(req, res, next) {
    try {
        const produkty = await produktService.findAllAdmin();
        ProduktView.list(res, produkty);
    } catch (err) {
        next(err);
    }
}
    /**
     * GET /api/produkty/:id
     */
    async show(req, res, next) {
        try {
            const produkt = await produktService.findById(Number(req.params.id));
            if (!produkt) return ProduktView.notFound(res);
            ProduktView.single(res, produkt);
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /api/produkty
     *
     * 1. Filter   — očistí surový vstup
     * 2. Validate — overí biznis pravidlá
     * 3. Model    — uloží do databázy
     * 4. View     — naformátuje a odošle odpoveď
     */
    async store(req, res, next) {
        try {
            const data   = ProduktFilter.forCreate(req.body);
            const errors = ProduktValidator.forCreate(data);
            if (errors.length) return ProduktView.validationError(res, errors);

            const produkt = await produktService.create(data);
            ProduktView.created(res, produkt);
        } catch (err) {
            next(err);
        }
    }

    /**
     * PUT /api/produkty/:id
     */
    async update(req, res, next) {
        try {
            const data   = ProduktFilter.forUpdate(req.body);
            const errors = ProduktValidator.forUpdate(data);
            if (errors.length) return ProduktView.validationError(res, errors);

            const produkt = await produktService.updateById(Number(req.params.id), data);
            if (!produkt) return ProduktView.notFound(res);
            ProduktView.updated(res, produkt);
        } catch (err) {
            next(err);
        }
    }

    /**
     * DELETE /api/produkty/:id
     */
    async destroy(req, res, next) {
        try {
            const deleted = await produktService.deleteById(Number(req.params.id));
            if (!deleted) return ProduktView.notFound(res);
            ProduktView.deleted(res);
        } catch (err) {
            next(err);
        }
    }
}
