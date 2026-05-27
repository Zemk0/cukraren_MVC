import { NovinkaService }   from '../models/NovinkaService.js';
import { NovinkaFilter }    from '../filters/NovinkaFilter.js';
import { NovinkaValidator } from '../validators/NovinkaValidator.js';
import { NovinkaView }      from '../views/NovinkaView.js';

const novinkaService = new NovinkaService();

/**
 * NovinkaController — Controller v MVC.
 */
export class NovinkaController {

    /** GET /api/novinky */
    async index(req, res, next) {
        try {
            const novinky = await novinkaService.findAll();
            NovinkaView.list(res, novinky);
        } catch (err) {
            next(err);
        }
    }

    /** GET /api/novinky/:id */
    async show(req, res, next) {
        try {
            const novinka = await novinkaService.findById(Number(req.params.id));
            if (!novinka) return NovinkaView.notFound(res);
            NovinkaView.single(res, novinka);
        } catch (err) {
            next(err);
        }
    }

    /** POST /api/novinky */
    async store(req, res, next) {
        try {
            const data   = NovinkaFilter.forCreate(req.body);
            const errors = NovinkaValidator.forCreate(data);
            if (errors.length) return NovinkaView.validationError(res, errors);

            const novinka = await novinkaService.create(data);
            NovinkaView.created(res, novinka);
        } catch (err) {
            next(err);
        }
    }

    /** PUT /api/novinky/:id */
    async update(req, res, next) {
        try {
            const data   = NovinkaFilter.forUpdate(req.body);
            const errors = NovinkaValidator.forUpdate(data);
            if (errors.length) return NovinkaView.validationError(res, errors);

            const novinka = await novinkaService.updateById(Number(req.params.id), data);
            if (!novinka) return NovinkaView.notFound(res);
            NovinkaView.updated(res, novinka);
        } catch (err) {
            next(err);
        }
    }

    /** DELETE /api/novinky/:id */
    async destroy(req, res, next) {
        try {
            const deleted = await novinkaService.deleteById(Number(req.params.id));
            if (!deleted) return NovinkaView.notFound(res);
            NovinkaView.deleted(res);
        } catch (err) {
            next(err);
        }
    }
}
