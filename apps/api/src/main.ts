import './sentry'

import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BaseExceptionFilter, HttpAdapterHost, NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { ExpressAdapter } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as Sentry from '@sentry/node'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

import { AppModule } from './app.module'
import { VALIDATION_PIPE_OPTIONS } from './shared/constants'
import { RequestIdMiddleware } from './shared/middlewares/request-id/request-id.middleware'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  )
  app.setGlobalPrefix('api/v1')

  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS))
  app.use(RequestIdMiddleware)
  app.use(helmet())
  app.enable('trust proxy', 1) // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 100 requests per windowMs
      validate: {
        xForwardedForHeader: true,
        default: false,
      },
    }),
  )
  // app.use(compression())
  app.enableVersioning()
  app.enableCors()

  // Performance & Error monitoring
  const { httpAdapter } = app.get(HttpAdapterHost)
  Sentry.setupNestErrorHandler(app, new BaseExceptionFilter(httpAdapter))

  /** Swagger configuration*/
  const options = new DocumentBuilder()
    .setTitle('System Design Agent API')
    .setDescription(
      `### REST

Routes is following REST standard (Richardson level 3)

<details><summary>Detailed specification</summary>
<p>

**List:**
  - \`GET /<resources>/\`
    - Get the list of **<resources>** as admin
  - \`GET /user/<user_id>/<resources>/\`
    - Get the list of **<resources>** for a given **<user_id>**
    - Output a **403** if logged user is not **<user_id>**

**Detail:**
  - \`GET /<resources>/<resource_id>\`
    - Get the detail for **<resources>** of id **<resource_id>**
    - Output a **404** if not found
  - \`GET /user/<user_id>/<resources>/<resource_id>\`
    - Get the list of **<resources>** for a given **user_id**
    - Output a **404** if not found
    - Output a **403** if:
      - Logged user is not **<user_id>**
      - The **<user_id>** have no access to **<resource_id>**

**Creation / Edition / Replacement / Suppression:**
  - \`<METHOD>\` is:
    - **POST** for creation
    - **PATCH** for update (one or more fields)
    - **PUT** for replacement (all fields, not used)
    - **DELETE** for suppression (all fields, not used)
  - \`<METHOD> /<resources>/<resource_id>\`
    - Create **<resources>** with id **<resource_id>** as admin
    - Output a **400** if **<resource_id>** conflicts with existing **<resources>**
  - \`<METHOD> /user/<user_id>/<resources>/<resource_id>\`
    - Create **<resources>** with id **<resource_id>** as a given **user_id**
    - Output a **409** if **<resource_id>** conflicts with existing **<resources>**
    - Output a **403** if:
      - Logged user is not **<user_id>**
      - The **<user_id>** have no access to **<resource_id>**
</p>
</details>`,
    )
    .setVersion(process.env.npm_package_version ?? '1.0.0')
    .addBearerAuth()
    .setExternalDoc('Postman Collection', '/docs-json')
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('docs', app, document)

  const configService = app.get(ConfigService)
  const port = configService.get<number>('port')
  await app.listen(port ?? '5969')
}

void bootstrap()

// function compression(): any {
//   throw new Error('Function not implemented.')
// }
