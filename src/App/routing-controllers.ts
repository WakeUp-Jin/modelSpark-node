import { RoutingControllersOptions } from "routing-controllers";
import { LoggingMiddleware } from "./middleware/loggingMiddleware";
import { customCors } from "./middleware/customCors";
import { VoiceController } from "./controller";

export const routingConfig: RoutingControllersOptions = {
    cors: customCors,
    controllers: [VoiceController],
    middlewares: [LoggingMiddleware]
}