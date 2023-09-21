import { httpRxControllerFactory } from "@shared/azure/functions/rxjs";
import * as controller from "../controllers";

httpRxControllerFactory('index', controller.index);
httpRxControllerFactory('users', controller.users, { route: 'internal/users', methods: ['GET'] });