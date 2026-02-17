import 'reflect-metadata'

export * from './generators/index.js'

import type { CliPlugin } from '@zenstackhq/sdk'
import {
	DataModel,
	Enum,
	isDataModel,
	isEnum,
	isTypeDef,
	type Model,
	TypeDef,
} from '@zenstackhq/sdk/ast'
import { ErrorCategory, PluginError } from './utils/error.js'
import { validateOptions, PluginOptions } from './utils/config.js'
import { GeneratorOrchestrator, OutputWriter } from './orchestrator/index.js'
import { BaseGeneratorContext } from './core/types.js'

function validateModel(model: Model): void {
	if (!model) {
		throw new PluginError(
			'Model is required',
			ErrorCategory.VALIDATION,
			{
				model: model ? 'Provided' : 'Missing',
			},
			['Ensure that the model is correctly passed to the plugin.', 'Check your ZModel schema for completeness.'],
		)
	}
}

function createGeneratorContext(model: Model, normalizedOptions: ReturnType<typeof validateOptions>): BaseGeneratorContext {
	const models = model.declarations.filter((x) => isDataModel(x)) as DataModel[]
	const enums = model.declarations.filter((x) => isEnum(x)) as Enum[]
	const types = model.declarations.filter((x) => isTypeDef(x)) as TypeDef[]

	return {
		options: normalizedOptions,
		models,
		enums,
		types,
	}
}

function handleGenerationError(error: unknown): never {
	if (error instanceof PluginError) {
		throw error
	}

	if (error instanceof Error && error.message.includes('validation')) {
		throw new PluginError('Invalid plugin options', ErrorCategory.VALIDATION, { originalError: error })
	}

	console.error('Error during GraphQL schema generation:', error)

	throw new PluginError('GraphQL schema generation failed', ErrorCategory.GENERATION, { originalError: error }, [
		'Check your ZModel schema for errors',
		'Verify plugin configuration options',
		'Ensure all required models and fields are properly defined',
	])
}

const cliPlugin: CliPlugin = {
	name: 'ZenStack GraphQL',

	statusText: 'Generating GraphQL schema...',

	async generate({ model, pluginOptions }) {
		validateModel(model)

		try {
			const normalizedOptions = validateOptions(pluginOptions as PluginOptions)
			const context = createGeneratorContext(model, normalizedOptions)

			const orchestrator = new GeneratorOrchestrator(context, normalizedOptions.outputFormat)
			const result = await orchestrator.generate()

			const outputWriter = new OutputWriter()
			await outputWriter.write(result, normalizedOptions.output)
		} catch (error) {
			handleGenerationError(error)
		}
	},
}

export default cliPlugin;