import { Client } from 'pg';
import { ISeparateProduct, ISeparateStock } from '../types/products.type';

import mockProducts from './products-data.json';

export const seedProducts = (databaseClient: Client) => {
  try {
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

      const productResult = await databaseClient.query<ISeparateProduct>(
        productQuery
      );

      if (!productResult.rows[0]) {
        return;
      }

      const stockQuery = {
        text: `INSERT INTO stocks (product_id, count) VALUES ($1, $2) RETURNING *`,
        values: [productResult.rows[0].id, product.count],
      };

      await databaseClient.query<ISeparateStock>(stockQuery);
    });
  } catch (error) {
    console.error(error);
  }
};
