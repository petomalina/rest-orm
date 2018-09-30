import { readFileSync, writeFileSync} from 'fs'
import { join, dirname } from 'path'
import { inspect } from 'util'

import { Model } from './models'

import { generateFile } from './generator'

function parseFile(f: string): Model[] {
    const content = readFileSync(f).toString().split(/\r?\n/)

    const models: Model[] = []

    // get models from the file
    content.reduce((acc, line) => {
        // minimum is a:S
        if (line.trim().length <= 3) {
            return acc
        }

        const declaration = /export? ?interface ?(\w+)/.exec(line)
        if (declaration && declaration.length > 0) {
            acc.push({
                name: declaration[1],
                fields: [],
                relationships: [],
            })

            return acc
        }

        const field = /(\w+) ?\??: ?(.*);/.exec(line)
        if (field && field.length > 1) {
            acc[acc.length-1].fields.push({
                name: field[1],
                type: field[2],
            })
        }

        return acc
    }, models)

    // get relationships
    models.forEach((model) => {
        model.fields.forEach(f => {
            // plural only
            if (!f.name.endsWith('s')) {
                return
            }

            const matchedModel = models.find(m => {
                return f.name.toLowerCase().startsWith(m.name.toLowerCase())
            })

            if (!matchedModel) {
                return
            }

            model.relationships.push({
                modelName: matchedModel.name,
                form: "1:N",
            })
        })
    })

    console.log(inspect(models, false, null, true))

    return models
}

const file = './examples/bookstore/models.ts'

const models = parseFile(file)
const out = generateFile(models)

writeFileSync(join(dirname(file), 'orm.gen.ts'), out)
