import { GeneratorContext } from '../../core/types.js'
import { OutputFormat } from '../../utils/constants.js'
import {
	UnifiedSortInputGenerator,
	UnifiedFilterInputGenerator,
	UnifiedConnectionGenerator,
	UnifiedObjectTypeGenerator,
	UnifiedQueryArgsGenerator,
	UnifiedRelationGenerator,
	UnifiedEnumGenerator,
	UnifiedScalarGenerator,
	UnifiedContextFactory,
} from '../unified/index.js'

export class UnifiedGeneratorFactory {
	static createGraphQLGenerators(context: GeneratorContext, format: OutputFormat) {
		const unifiedContext = UnifiedContextFactory.createGraphQLContext(context)

		return {
			sortInputGenerator: new UnifiedSortInputGenerator(unifiedContext),
			filterInputGenerator: new UnifiedFilterInputGenerator(unifiedContext),
			connectionGenerator: new UnifiedConnectionGenerator(unifiedContext),
			objectTypeGenerator: new UnifiedObjectTypeGenerator(unifiedContext),
			queryArgsGenerator: new UnifiedQueryArgsGenerator(unifiedContext),
			enumGenerator: new UnifiedEnumGenerator(unifiedContext, format),
			scalarGenerator: new UnifiedScalarGenerator(context, format),
			relationGenerator: new UnifiedRelationGenerator(unifiedContext),
		}
	}
}
