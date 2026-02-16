import { SchemaComposer } from 'graphql-compose'
import { DataModel, Enum, TypeDef } from '@zenstackhq/sdk/ast'
import { NormalizedOptions } from '../utils/config.js'
import { SchemaProcessor } from '../utils/schema/schema-processor.js'
import { GraphQLTypeFactories } from '../utils/schema/graphql-type-factories.js'
import { GraphQLRegistry } from '../utils/index.js'
import { TypeFormatter } from '../utils/schema/type-formatter.js'
import { UnifiedTypeMapper } from '../utils/type-mapping/unified-type-mapper.js'
import { OutputFormat } from '../utils/constants.js'

export type ComposerType = ReturnType<SchemaComposer['get']>

export interface BaseGeneratorContext {
	options: NormalizedOptions
	models: DataModel[]
	enums: Enum[]
	types: TypeDef[]
}

export interface GeneratorContext extends BaseGeneratorContext {
	schemaComposer: SchemaComposer<unknown>
	registry: GraphQLRegistry
	attributeProcessor: SchemaProcessor
	typeFormatter: TypeFormatter
	typeMapper: UnifiedTypeMapper
	typeFactories: GraphQLTypeFactories
}

export interface GenerationResult<T = string> {
	items: T[]
	count: number
	type: GenerationType
}

export enum GenerationType {
	SCALAR = 'scalar',
	ENUM = 'enum',
	OBJECT = 'object',
	INPUT = 'input',
	CONNECTION = 'connection',
	FILTER = 'filter',
	SORT = 'sort',
	RELATION = 'relation',
	HELPER = 'helper',
	TYPE = 'type',
}

export interface UnifiedGenerationResult {
	sdl?: string
	code?: string
	helperCode?: string
	results: GenerationResult[]
	stats: UnifiedGenerationStats
	outputFormat: OutputFormat
}

export interface UnifiedGenerationStats {
	objectTypes: number
	enumTypes: number
	scalarTypes: number
	inputTypes: number
	relationFields: number
	connectionTypes: number
	sortInputTypes: number
	filterInputTypes: number
	helperFiles: number
	totalTypes: number
	generationTimeMs: number
}

export interface PluginMetadata {
	stats: UnifiedGenerationStats
	outputPath: string
}
