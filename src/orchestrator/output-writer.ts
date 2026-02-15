import { UnifiedGenerationResult } from '../core/types.js'
import { FileWriter } from '../utils/file-writer.js'
import { OutputFormat } from '../utils/constants.js'
import { HelperFileWriter } from './helper-file-writer.js'
import path from 'path'

export class OutputWriter {
	private fileWriter = new FileWriter()
	private helperFileWriter = new HelperFileWriter()

	async write(result: UnifiedGenerationResult, outputPath: string): Promise<string> {
		const finalOutputPath = this.resolveOutputPath(result.outputFormat, outputPath)

		if (result.outputFormat === OutputFormat.TYPE_GRAPHQL) {
			if (!result.code) {
				throw new Error('TypeGraphQL code is required but missing')
			}
			await this.fileWriter.write(result.code, finalOutputPath, 'TypeGraphQL code')
		} else if (result.outputFormat === OutputFormat.NESTJS) {
			if (!result.code) {
				throw new Error('NestJS code is required but missing')
			}
			await this.fileWriter.write(result.code, finalOutputPath, 'NestJS code')
		} else {
			if (!result.sdl) {
				throw new Error('GraphQL SDL is required but missing')
			}
			await this.fileWriter.write(result.sdl, finalOutputPath, 'GraphQL schema')
		}

		if (result.helperCode) {
			await this.helperFileWriter.writeHelperFiles(result.outputFormat, outputPath, result.helperCode)
		}

		return finalOutputPath
	}

	private resolveOutputPath(outputFormat: OutputFormat, basePath: string): string {
		if (outputFormat === OutputFormat.TYPE_GRAPHQL || outputFormat === OutputFormat.NESTJS) {
			return path.join(path.dirname(basePath), path.basename(basePath, path.extname(basePath)) + '.ts')
		}
		return basePath
	}
}
