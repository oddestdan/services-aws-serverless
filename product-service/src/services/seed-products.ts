import { ISeparateProduct, ISeparateStock } from '../types/products.type';
import { createPool } from '../utils/poolCreator';

import mockProducts from './products-data.json';

export const seedProducts = async () => {
  const dbPool = createPool();
  await dbPool.connect();

  try {
    await dbPool.query('BEGIN');

    mockProducts.forEach(async (product) => {
      const productQuery = {
        text: `INSERT INTO products (title, description, price, image) VALUES ($1, $2, $3, $4) RETURNING *`,
        values: [
          product.title,
          product.description,
          product.price,
          product.image,
        ],
      };
      const productResult = await dbPool.query<ISeparateProduct>(productQuery);

      if (!productResult.rows[0]) {
        return;
      }

      const stockQuery = {
        text: `INSERT INTO stocks (product_id, count) VALUES ($1, $2) RETURNING *`,
        values: [productResult.rows[0].id, product.count],
      };
      await dbPool.query<ISeparateStock>(stockQuery);

      await dbPool.query('COMMIT');
    });
  } catch (error) {
    await dbPool.query('ROLLBACK');
    console.error(error);
  } finally {
    dbPool.end();
  }
};
