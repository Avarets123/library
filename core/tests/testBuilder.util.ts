type TestDataType = Record<any, 'string' | 'number' | 'date'>

export class TestPropertiesBuilder {
  constructor(private readonly expect: jest.Expect) {}

  private data: TestDataType = {}

  setNumberField(field: string) {
    this.data[field] = 'number'

    return this
  }

  setStringField(field: string) {
    this.data[field] = 'string'

    return this
  }

  setDateField(field: string) {
    this.data[field] = 'date'

    return this
  }

  test(actual: unknown) {
    const mappedData = this.mapDataForTest()

    this.expect(actual).toMatchObject(mappedData)
  }

  mapDataForTest() {
    const properties = Object.entries(this.data)

    return properties.map(
      ([
        field,
        type,
      ]) => {
        switch (type) {
          case 'number':
            return { [field]: this.expect.any(Number) }

          case 'string':
            return { [field]: this.expect.any(String) }

          case 'date':
            return { [field]: this.expect.anything() }
        }
      },
    )
  }
}
