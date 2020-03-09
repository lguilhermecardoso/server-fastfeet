import { Op } from 'sequelize';
import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class OrderController {
  async index(req, res) {
    const { product_name, page = 1 } = req.query;

    if (product_name) {
      const product = await Delivery.findAll({
        where: {
          product: {
            [Op.iLike]: `%${product_name}%`,
          },
        },
        limit: 10,
        offset: (page - 1) * 10,
        order: [['id', 'DESC']],
        attributes: [
          'id',
          'product',
          'canceled_at',
          'start_date',
          'end_date',
          'signature_id',
        ],
        include: [
          {
            model: File,
            as: 'signature',
            attributes: ['url', 'path'],
          },
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id', 'name'],
            include: [
              {
                model: File,
                as: 'avatar',
                attributes: ['url', 'path'],
              },
            ],
          },
          {
            model: Recipient,
            as: 'recipient',
            attributes: [
              'id',
              'name',
              'street',
              'city',
              'state',
              'number',
              'zip_code',
            ],
          },
        ],
      });

      return res.status(200).json(product);
    }

    const deliveries = await Delivery.findAll({
      limit: 10,
      offset: (page - 1) * 10,
      order: [['id', 'DESC']],
      attributes: [
        'id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
        'signature_id',
      ],
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['url', 'path'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['url', 'path'],
            },
          ],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'state',
            'city',
            'zip_code',
          ],
        },
      ],
    });

    return res.json(deliveries);
  }

  // Create delivery

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Check if recipient and deliveryman exist

    const { recipient_id, deliveryman_id } = req.body;

    const recipientExists = await Recipient.findOne({
      where: { id: recipient_id },
    });

    const deliverymanExists = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    if (!recipientExists && !deliverymanExists) {
      return res
        .status(400)
        .json({ error: 'Recipient and Deliveryman do not exist' });
    }

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient does not exist' });
    }

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman does not exist' });
    }

    const { id, product } = await Delivery.create(req.body);

    // Send email to deliveryman who is responsable for delivery

    return res.json({
      id,
      product,
      recipient_id,
      deliveryman_id,
    });
  }

  // Update delivery

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      product: Yup.string(),
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Check if delivery exists

    const { id, recipient_id, deliveryman_id } = req.body;

    const deliveryExists = await Delivery.findOne({
      where: { id },
    });

    if (!deliveryExists) {
      return res.status(400).json({ error: 'Delivery does not exist' });
    }

    // Check if recipient and deliveryman exist

    const recipientExists = await Recipient.findOne({
      where: { id: recipient_id },
    });

    const deliverymanExists = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    if (!recipientExists && !deliverymanExists) {
      return res
        .status(400)
        .json({ error: 'Recipient and Deliveryman do not exist' });
    }

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient does not exist' });
    }

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman does not exist' });
    }

    const { product } = await deliveryExists.update(req.body);

    return res.json({
      id,
      product,
      recipient_id,
      deliveryman_id,
    });
  }

  async delete(req, res) {
    // Check if delivery exists

    const { id } = req.params;

    const deliveryExists = await Delivery.findOne({
      where: { id },
    });

    if (!deliveryExists) {
      return res.status(400).json({ error: 'Delivery does not exist' });
    }

    await Delivery.destroy({ where: { id } });

    return res.json({ message: 'Product deleted' });
  }
}

export default new OrderController();
