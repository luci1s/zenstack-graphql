import { UnifiedGeneratorBase } from './unified-generator-base.js'
import { UnifiedGeneratorContext } from '../strategies/index.js'
import { Enum } from '@zenstackhq/sdk/ast'
import { OutputFormat } from '../../utils/constants.js'

export interface EnumGenerationResult {
	graphqlTypes: string[]
	typescriptTypes: string[]
}

export class UnifiedEnumGenerator extends UnifiedGeneratorBase {
	private format: OutputFormat

	constructor(context: UnifiedGeneratorContext, format: OutputFormat) {
		super(context)
		this.format = format
	}

	override generate(): string[] {
		if (!this.options.generateEnums) {
			return []
		}

		const results: string[] = []

		for (const enumObj of this.enums) {
			try {
				const enumName = this.typeFormatter.formatTypeName(enumObj.name)
				this.outputStrategy.createEnumType(enumObj)
				results.push(enumName)
			} catch (error) {
				console.warn(`Failed to process enum ${enumObj.name}:`, error)
			}
		}

		return results
	}

	protected generateForModel(): string | null {
		return null
	}
}
