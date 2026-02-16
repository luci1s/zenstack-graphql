import { DataModel, Enum, Reference, TypeDef } from '@zenstackhq/sdk/ast'
import { RelationField } from '../unified/unified-relation-generator.js'
import { NormalizedOptions } from '../../utils/config.js'
import { TypeFormatter } from '../../utils/schema/type-formatter.js'
import { SchemaProcessor } from '../../utils/schema/schema-processor.js'
import { UnifiedTypeMapper } from '../../utils/type-mapping/unified-type-mapper.js'
import type { ModelHelper, HelperGenerationContext } from '../unified/unified-helper-generator.js'
import { FieldConfig } from '../unified/index.js'

export interface OutputStrategy {
	createCommonTypes?(types: CommonTypeDefinition[]): void

	createSortInputType(typeName: string, fields: SortFieldDefinition[]): string

	createFilterInputType(typeName: string, fields: FilterFieldDefinition[]): string

	createEmptyFilterInputType(typeName: string): string

	createEnumFilterInputType(enumName: string): string

	createConnectionType(typeName: string): string

	createObjectType(typeName: string, fields: Record<string, FieldConfig>, mixins: Reference<TypeDef>[], description?: string): string

	createInputType(typeName: string, model: DataModel, inputType: 'create' | 'update', description?: string): string

	createQueryArgsInputType(typeName: string, model: DataModel, description?: string): string

	createEnumType(enumType: Enum): string

	createPaginationTypes(): void

	createCommonFilterTypes(): void

	createSortDirectionEnum(): void

	processRelation(relation: RelationField): void

	hasProcessedRelation?(relationKey: string): boolean

	getProcessedRelations?(): string[]

	hasType(typeName: string): boolean

	getGeneratedTypeNames(filter?: (name: string) => boolean): string[]

	getGeneratedCode?(): string

	generateHelpers?(helpers: ModelHelper[], context: HelperGenerationContext): string[]
}

export interface CommonTypeDefinition {
	name: string
	type: 'enum' | 'input' | 'object'
	definition: any
}

export interface SortFieldDefinition {
	name: string
	description?: string
}

export interface FilterFieldDefinition {
	name: string
	type: string
	nullable?: boolean
	description?: string
}

export interface UnifiedGeneratorContext {
	options: NormalizedOptions
	models: DataModel[]
	enums: Enum[]
	types: TypeDef[]
	typeFormatter: TypeFormatter
	attributeProcessor: SchemaProcessor
	typeMapper?: UnifiedTypeMapper

	outputStrategy: OutputStrategy
}
