export interface IBaseBuilder<TDocument, TCreateDto> {
  setBaseData(dto: TCreateDto): this;
  build(): Promise<TDocument>;
}