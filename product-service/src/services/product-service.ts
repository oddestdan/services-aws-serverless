import {
  IProductService,
  IProduct,
  ISeparateProduct,
  ISeparateStock,
} from '../types/products.type';
import { Client, QueryConfig } from 'pg';

class ProductService implements IProductService {
  private tableName = 'products';
  private connectedTableName = 'stocks';

  constructor(private databaseClient: Client) {}

  async getById(id: string): Promise<IProduct> {
    const query = {
      text: `SELECT * FROM ${this.tableName}
      INNER JOIN ${this.connectedTableName} on ${this.tableName}.id = ${this.connectedTableName}.product_id
      WHERE ${this.tableName}.id = $1`,
      values: [id],
    } as QueryConfig;

    const result = await this.databaseClient.query(query);
    return result.rows[0] ? result.rows[0] : null;
  }

  async getAll(): Promise<IProduct[]> {
    const query = {
      text: `SELECT * FROM ${this.tableName}
      INNER JOIN ${this.connectedTableName} on ${this.tableName}.id = ${this.connectedTableName}.product_id`,
    } as QueryConfig;

    const result = await this.databaseClient.query(query);
    return result.rows ? result.rows : null;
  }

  async create(
    product: Pick<
      IProduct,
      'title' | 'description' | 'price' | 'image' | 'count'
    >
  ) {
    const productQuery = {
      text: `INSERT INTO ${this.tableName}(title, description, price, image) VALUES($1, $2, $3, $4) RETURNING *`,
      values: [
        product.title,
        product.description,
        product.price,
        product.image,
      ],
    };

    const productResult = await this.databaseClient.query<ISeparateProduct>(
      productQuery
    );

    if (!productResult.rows[0]) {
      return null;
    }

    const stockQuery = {
      text: `INSERT INTO ${this.connectedTableName} (product_id, count) VALUES ($1, $2) RETURNING *`,
      values: [productResult.rows[0].id, product.count],
    };

    const stockResult = await this.databaseClient.query<ISeparateStock>(
      stockQuery
    );

    return stockResult.rows[0]
      ? { ...productResult.rows[0], count: stockResult.rows[0].count }
      : null;
  }
}

export { ProductService };
