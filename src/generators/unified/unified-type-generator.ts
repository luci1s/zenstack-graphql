import { UnifiedGeneratorBase } from './unified-generator-base.js'
import { UnifiedGeneratorContext } from '../strategies/index.js'
import { DataField, DataModel, TypeDef } from '@zenstackhq/sdk/ast'
import { RelationField } from './unified-relation-generator.js'
import { OutputFormat } from '../../utils/constants.js'
import { ErrorCategory, PluginError, warning } from '../../utils/index.js'
import { FieldConfig } from './unified-object-type-generator.js'

export interface TypeGenerationContext {
	types: TypeDef[]
	outputFormat: OutputFormat
	attributeProcessor: any
	output: string
}

export interface ModelType {
	modelName: string
	connectionBuilderName: string
	filterBuilderName: string
	sortBuilderName: string
	fieldSelectionName: string
	includesConstName: string
	relations: RelationField[]
}

export class UnifiedTypeGenerator extends UnifiedGeneratorBase {
	constructor(context: UnifiedGeneratorContext) {
		super(context)
	}

	protected override generateForModel(_model: DataModel): string | null {
		return null
	}

	override generate(): string[] {
		return this.types
			.map((type) => this.generateTypes(type))
			.filter((t) => t !== null)
			.flat()
	}

	private generateTypes(type: TypeDef): string | null {
		const typeName = this.attributeProcessor.type(type).getFormattedTypeName(this.typeFormatter)

		if (this.outputStrategy.hasType(typeName)) {
			return null
		}

		try {
			const fields = this.createObjectFields(type)

			return this.outputStrategy.createObjectType(typeName, fields, type.mixins)
		} catch (error) {
			if (error instanceof PluginError) {
				warning(`Failed to create object type for type ${type.name}: ${error.message}`, error.category, {
					modelName: type.name,
					error: error,
				})
			} else {
				warning(
					`Failed to create object type for type ${type.name}: ${error instanceof Error ? error.message : String(error)}`,
					ErrorCategory.GENERATION,
					{
						modelName: type.name,
						error: error,
					},
				)
			}
			return null
		}
	}

	private createObjectFields(type: TypeDef): Record<string, FieldConfig> {
		const fields: Record<string, FieldConfig> = {}

		for (const field of type.fields) {
			if (this.attributeProcessor.field(type, field.name).shouldInclude(this.options.includeRelations)) {
				const fieldName = this.attributeProcessor.field(type, field.name).getFormattedFieldName(this.typeFormatter)
				fields[fieldName] = this.createFieldConfig(field)
			}
		}

		return fields
	}

	private createFieldConfig(field: DataField): FieldConfig {
		const graphqlType = this.mapFieldType(field)

		const type = this.types.find((m) => m.fields.includes(field))
		if (!type) {
			throw new PluginError(`Could not find type for field ${field.name}`, ErrorCategory.SCHEMA, { fieldName: field.name })
		}

		const description = this.attributeProcessor.field(type, field.name).description()

		const isId = this.attributeProcessor.field(type, field.name).isId()

		return {
			type: graphqlType,
			description,
			isId,
		}
	}

	private mapFieldType(field: DataField): string {
		if (this.typeMapper && this.typeMapper.isRelationField(field)) {
			return this.typeMapper.getRelationFieldType(field)
		}

		const mappedType = this.typeMapper && this.typeMapper.mapFieldType(field)
		if (!mappedType) {
			throw new PluginError(`Unsupported field type: ${field.type}`, ErrorCategory.SCHEMA, { field: field.name, type: field.type })
		}

		return mappedType
	}
}