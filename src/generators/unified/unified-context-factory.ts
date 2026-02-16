import { BaseGeneratorContext, GeneratorContext } from '../../core/types.js'
import { UnifiedGeneratorContext } from '../strategies/index.js'
import { GraphQLOutputStrategy } from '../strategies/graphql-output-strategy.js'
import { TypeScriptOutputStrategy } from '../strategies/typescript-output-strategy.js'
import { TypeScriptASTFactory } from '../../utils/typescript/ast-factory.js'
import { TypeFormatter } from '../../utils/schema/type-formatter.js'
import { SchemaProcessor } from '../../utils/schema/schema-processor.js'
import { UnifiedTypeMapper } from '../../utils/type-mapping/unified-type-mapper.js'
import { OutputFormat } from '../../utils/index.js'

export class UnifiedContextFactory {
	static createGraphQLContext(graphqlContext: GeneratorContext): UnifiedGeneratorContext {
		const outputStrategy = new GraphQLOutputStrategy(
			graphqlContext.registry,
			graphqlContext.schemaComposer,
			graphqlContext.typeFactories,
			graphqlContext.options,
		)

		return {
			options: graphqlContext.options,
			models: graphqlContext.models,
			enums: graphqlContext.enums,
			types: graphqlContext.types,
			typeFormatter: graphqlContext.typeFormatter,
			attributeProcessor: graphqlContext.attributeProcessor,
			typeMapper: graphqlContext.typeMapper,
			outputStrategy,
		}
	}

	static createTypeScriptContext(factoryContext: BaseGeneratorContext, format: OutputFormat): UnifiedGeneratorContext {
		const typeFormatter = new TypeFormatter(factoryContext.options.typeNaming, factoryContext.options.fieldNaming)
		const attributeProcessor = new SchemaProcessor()
		const typeMapper = new UnifiedTypeMapper(typeFormatter, factoryContext.models, factoryContext.enums, factoryContext.options)
		const astFactory = new TypeScriptASTFactory(typeFormatter, format, typeMapper, attributeProcessor)
		const outputStrategy = new TypeScriptOutputStrategy(astFactory)

		return {
			options: factoryContext.options,
			models: factoryContext.models,
			enums: factoryContext.enums,
			types: factoryContext.types,
			typeFormatter,
			attributeProcessor,
			typeMapper,
			outputStrategy,
		}
	}
}
