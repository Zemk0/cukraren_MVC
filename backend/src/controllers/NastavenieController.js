import { NastavenieService }   from '../models/NastavenieService.js';
import { NastavenieFilter }    from '../filters/NastavenieFilter.js';
import { NastavenieValidator } from '../validators/NastavenieValidator.js';
import { NastavenieView }      from '../views/NastavenieView.js';

const nastavenieService = new NastavenieService();

/**
 * NastavenieController — Controller v MVC.
 *
 * Prijíma HTTP požiadavku, koordinuje Filter → Validator → Model → View
 * a odošle odpoveď. Neobsahuje SQL ani žiadnu logiku formátovania.
 */
export class NastavenieController {

    /**
     * GET /api/nastavenia
     * Vráti všetky nastavenia ako jeden JSON objekt { key: value }.
     */
    async index(req, res, next) {
        try {
            const map = await nastavenieService.findAll();
            NastavenieView.map(res, map);
        } catch (err) {
            next(err);
        }
    }

    /**
     * GET /api/nastavenia/:key
     * Vráti hodnotu jedného kľúča.
     */
    async show(req, res, next) {
        try {
            const nastavenie = await nastavenieService.findByKey(req.params.key);
            if (!nastavenie) return NastavenieView.notFound(res);
            NastavenieView.single(res, nastavenie);
        } catch (err) {
            next(err);
        }
    }

    /**
     * PUT /api/nastavenia
     * Hromadný update viacerých nastavení naraz.
     *
     * Body: { shopName, address, city, phone, email,
     *         hoursWeekdays, hoursSaturday, hoursSunday }
     */
    async update(req, res, next) {
        try {
            const data   = NastavenieFilter.forUpdate(req.body);
            const errors = NastavenieValidator.forUpdate(data);
            if (errors.length) return NastavenieView.validationError(res, errors);

            const map = await nastavenieService.setMany(data);
            NastavenieView.updated(res, map);
        } catch (err) {
            next(err);
        }
    }

    /**
     * PATCH /api/nastavenia/:key
     * Aktualizuje hodnotu jedného kľúča.
     *
     * Body: { value: "nová hodnota" }
     */
    async patch(req, res, next) {
        try {
            const { key, value } = NastavenieFilter.forSingleUpdate(
                req.params.key,
                req.body.value
            );
            const errors = NastavenieValidator.forSingleUpdate(key, value);
            if (errors.length) return NastavenieView.validationError(res, errors);

            const nastavenie = await nastavenieService.setOne(key, value);
            if (!nastavenie) return NastavenieView.notFound(res);
            NastavenieView.updatedSingle(res, nastavenie);
        } catch (err) {
            next(err);
        }
    }
}
