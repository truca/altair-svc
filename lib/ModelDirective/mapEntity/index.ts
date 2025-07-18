export type EntityMapper = { [key: string]: (entity: any) => any };

export async function mapEntity(
  entity: any,
  type: string,
  entityMapper: EntityMapper
): Promise<any> {
  if (!entityMapper[type]) return entity;
  return await entityMapper[type](entity);
}
