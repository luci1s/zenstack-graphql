import { ModelHelper, HelperGenerationContext } from '../unified/unified-helper-generator.js'
import { TypeScriptHelperStrategy } from './typescript-helper-strategy.js'

export class GraphQLHelperStrategy extends TypeScriptHelperStrategy {
	override generateHelpers(helpers: ModelHelper[], context: HelperGenerationContext): string[] {
		return super.generateHelpers(helpers, context)
	}
}
