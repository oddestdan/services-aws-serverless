import {
  IProductService,
  IProduct,
  ISeparateProduct,
  ISeparateStock,
} from '../types/products.type';
import { QueryConfig } from 'pg';
import { createPool } from '../utils/poolCreator';

class ProductService implements IProductService {
  private tableName = 'products';
  private connectedTableName = 'stocks';

  constructor() {}

  async getById(id: string): Promise<IProduct> {
    const dbPool = createPool();
    await dbPool.connect();

    try {
      await dbPool.query('BEGIN');

      const query = {
        text: `SELECT * FROM ${this.tableName}
      INNER JOIN ${this.connectedTableName} on ${this.tableName}.id = ${this.connectedTableName}.product_id
      WHERE ${this.tableName}.id = $1`,
        values: [id],
      } as QueryConfig;
      const result = await dbPool.query(query);

      await dbPool.query('COMMIT');

      return result.rows[0] ? result.rows[0] : null;
    } catch (e) {
      await dbPool.query('ROLLBACK');
      throw e;
    } finally {
      dbPool.end();
    }
  }

  async getAll(): Promise<IProduct[]> {
    const dbPool = createPool();
    await dbPool.connect();

    try {
      await dbPool.query('BEGIN');

      const query = {
        text: `SELECT * FROM ${this.tableName}
      INNER JOIN ${this.connectedTableName} on ${this.tableName}.id = ${this.connectedTableName}.product_id`,
      } as QueryConfig;
      const result = await dbPool.query(query);

      await dbPool.query('COMMIT');

      return result.rows ? result.rows : null;
    } catch (e) {
      await dbPool.query('ROLLBACK');
      throw e;
    } finally {
      dbPool.end();
    }
  }

  async create(
    product: Pick<
      IProduct,
      'title' | 'description' | 'price' | 'image' | 'count'
    >
  ) {
    const dbPool = createPool();
    await dbPool.connect();

    try {
      await dbPool.query('BEGIN');

      const productQuery = {
        text: `INSERT INTO ${this.tableName}(title, description, price, image) VALUES($1, $2, $3, $4) RETURNING *`,
        values: [
          product.title,
          product.description,
          product.price,
          product.image,
        ],
      } as QueryConfig;
      const productResult = await dbPool.query<ISeparateProduct>(productQuery);

      if (!productResult.rows[0]) {
        return null;
      }

      const stockQuery = {
        text: `INSERT INTO ${this.connectedTableName} (product_id, count) VALUES ($1, $2) RETURNING *`,
        values: [productResult.rows[0].id, product.count],
      } as QueryConfig;
      const stockResult = await dbPool.query<ISeparateStock>(stockQuery);

      await dbPool.query('COMMIT');

      return stockResult.rows[0]
        ? { ...productResult.rows[0], count: stockResult.rows[0].count }
        : null;
    } catch (e) {
      await dbPool.query('ROLLBACK');
      throw e;
    } finally {
      dbPool.end();
    }
  }
}

export { ProductService };
