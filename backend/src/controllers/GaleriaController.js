import { GaleriaService } from '../models/GaleriaService.js';
import { GaleriaView }    from '../views/GaleriaView.js';

const galeriaService = new GaleriaService();

/**
 * GaleriaController — Controller v MVC.
 */
export class GaleriaController {

    /** GET /api/galeria */
    async index(req, res, next) {
        try {
            const items = await galeriaService.findAll();
            GaleriaView.list(res, items);
        } catch (err) {
            next(err);
        }
    }

    /** GET /api/galeria/:id */
    async show(req, res, next) {
        try {
            const item = await galeriaService.findById(Number(req.params.id));
            if (!item) return GaleriaView.notFound(res);
            GaleriaView.single(res, item);
        } catch (err) {
            next(err);
        }
    }

    /** POST /api/galeria */
    async store(req, res, next) {
        try {
            const title = String(req.body.title ?? '').trim();
            const image = String(req.body.image ?? '').trim();

            if (!title) return GaleriaView.validationError(res, ['Názov obrázka je povinný.']);

            const item = await galeriaService.create({ title, image });
            GaleriaView.created(res, item);
        } catch (err) {
            next(err);
        }
    }

    /** DELETE /api/galeria/:id */
    async destroy(req, res, next) {
        try {
            const deleted = await galeriaService.deleteById(Number(req.params.id));
            if (!deleted) return GaleriaView.notFound(res);
            GaleriaView.deleted(res);
        } catch (err) {
            next(err);
        }
    }
}
