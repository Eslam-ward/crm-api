import { Area } from "../schema/area.schema";

export interface IAreaRepository {
  create(data: Partial<Area>): Promise<Area>;
  findOne(filter: any): Promise<Area | null>;
  findById(id: string): Promise<Area | null>;
  findMany(query: any): Promise<Area[]>;
  update(id: string, data: any): Promise<Area | null>;
  delete(id: string): Promise<Area | null>;
}