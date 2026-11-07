import "reflect-metadata";
import { Controller, Get, Injectable, Module, OnModuleDestroy, ServiceUnavailableException } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Pool } from "pg";

@Injectable()
class Database implements OnModuleDestroy {
  readonly pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 3000 });
  constructor() {
    this.pool.on("error", (error) => console.error("PostgreSQL connection error", error.message));
  }
  async onModuleDestroy() { await this.pool.end(); }
}

@Controller("api")
class HealthController {
  constructor(private readonly database: Database) {}
  @Get("health")
  async health() {
    try {
      await this.database.pool.query("SELECT 1");
      return { status: "ok", database: "connected" };
    } catch {
      throw new ServiceUnavailableException("Database unavailable");
    }
  }
}

@Module({ controllers: [HealthController], providers: [Database] })
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT ?? 3001), "0.0.0.0");
}
bootstrap().catch((error: unknown) => { console.error(error); process.exit(1); });
