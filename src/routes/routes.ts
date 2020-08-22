/* tslint:disable */
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { usersController } from '../controllers/users.controller';
import { databaseController } from '../controllers/database.controller';
import { retriesController } from '../controllers/retries.controller';
import { summonerStatsController } from '../controllers/summonerStats.controller';
import * as express from 'express';
import { checkJwt } from '../middleware/jwtchecker.middleware';
import { summonersController } from '../controllers/summoners.controller';
import { checkRol } from '../middleware/checkrol.middleware';
import { usersProfileController } from '../controllers/usersProfile.controller';
import { matchNotesController } from '../controllers/matchNotes.controller';

const models: TsoaRoute.Models = {
};
const validationService = new ValidationService(models);

export function RegisterRoutes(app: express.Express) {
  app.get('/api/v1/users', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new usersController();


      const promise = controller.getAll.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.get('/api/v1/users/:id', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new usersController();


      const promise = controller.getOne.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/api/v1/users/login',
    function(request: any, response: any, next: any) {
      const args = {
        email: { "in": "body-prop", "name": "email", "required": true, "dataType": "string" },
        password: { "in": "body-prop", "name": "password", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new usersController();


      const promise = controller.login.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/api/v1/users', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        email: { "in": "body-prop", "name": "email", "required": true, "unique": true, "dataType": "string" },
        password: { "in": "body-prop", "name": "password", "required": true, "dataType": "string" },
        token: { "in": "body-prop", "name": "token", "required": false, "dataType": "string" },
        status: { "in": "body-prop", "name": "status", "required": false, "dataType": "double" },
        role: { "in": "body-prop", "name": "role", "required": false, "dataType": "string" }
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new usersController();


      const promise = controller.create.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.put('/api/v1/users/:id', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        status: { "in": "body-prop", "name": "status", "required": true, "dataType": "double" },
        role: { "in": "body-prop", "name": "role", "required": true, "dataType": "string" }
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new usersController();


      const promise = controller.update.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.delete('/api/v1/users/:id', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new usersController();


      const promise = controller.remove.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.delete('/api/v1/users/delete/:id', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new usersController();


      const promise = controller.trueRemove.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.get('/api/v1/profile', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new usersProfileController();


      const promise = controller.getAll.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.get('/api/v1/profile/:id', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new usersProfileController();


      const promise = controller.getOne.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.get('/api/v1/profile/user/:userId', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
      };
      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }
      const controller = new usersProfileController();


      const promise = controller.getByUserId.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/api/v1/profile', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        userId: { "in": "body-prop", "name": "userId", "unique": true, "required": true, "dataType": "string" },
        name: { "in": "body-prop", "name": "name", "required": true, "dataType": "string" },
        lastname: { "in": "body-prop", "name": "lastname", "required": false, "dataType": "string" },
        phone: { "in": "body-prop", "name": "phone", "required": false, "dataType": "string" },
        country: { "in": "body-prop", "name": "country", "required": false, "dataType": "string" },
        about: { "in": "body-prop", "name": "about", "required": false, "dataType": "string" }
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new usersProfileController();


      const promise = controller.create.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/api/v1/profile/image', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        userId: { "in": "body-prop", "name": "userId", "unique": true, "required": true, "dataType": "string" },
        data: { "in": "body-prop", "name": "data", "required": true, "dataType": "string" }
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new usersProfileController();


      const promise = controller.uploadImage.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.put('/api/v1/profile/:id', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        userId: { "in": "body-prop", "name": "userId", "unique": true, "required": true, "dataType": "string" },
        name: { "in": "body-prop", "name": "name", "required": true, "dataType": "string" },
        lastname: { "in": "body-prop", "name": "lastname", "required": false, "dataType": "string" },
        phone: { "in": "body-prop", "name": "phone", "required": false, "dataType": "string" },
        country: { "in": "body-prop", "name": "country", "required": false, "dataType": "string" },
        about: { "in": "body-prop", "name": "about", "required": false, "dataType": "string" }
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new usersProfileController();


      const promise = controller.update.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.delete('/api/v1/profile/:id', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new usersProfileController();


      const promise = controller.remove.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.get('/api/v1/summoners', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new summonersController();


      const promise = controller.getAll.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.get('/api/v1/summoners/:id', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new summonersController();


      const promise = controller.getOne.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/api/v1/summoners/match_history_paginate/:id', [checkJwt],
    function(request: any, response: any, next: any) {

      const controller = new summonersController();

      const promise = controller.getMatchHistoryPaginate(request);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/api/v1/summoners/stats/search', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        name: { "in": "body-prop", "name": "name", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new summonersController();


      const promise = controller.searchSummoner.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.get('/api/v1/summoners/match_history/:sumId/:userId', [checkJwt, checkRol],
    function(request: any, response: any, next: any) {
      const args = {
        sumId: { "in": "path", "name": "sumId", "required": true, "dataType": "string" },
        userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" }
      };
      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }
      const controller = new summonersController();

      const promise = controller.getMatchHistory.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/api/v1/summoners/leagueEntries_ext', [checkJwt, checkRol],
    function(request: any, response: any, next: any) {
      const args = {
      };

      let validatedArgs: any[] = [];

      const controller = new summonersController();


      const promise = controller.getEntriesCommonLeagues.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/api/v1/summoners/apexLeagues_ext', [checkJwt, checkRol],
    function(request: any, response: any, next: any) {
      const args = {
      };

      let validatedArgs: any[] = [];

      const controller = new summonersController();


      const promise = controller.getEntriesApexLeagues.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.get('/api/v1/summoners/entries/:id', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new summonersController();


      const promise = controller.getEntriesBySummoner.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/api/v1/summoners/stats', [checkJwt],
    function(request: any, response: any, next: any) {


      const controller = new summonersController();

      const promise = controller.getSummonerStats(request);
      promiseHandler(controller, promise, response, next);
    });
  app.get('/api/v1/summoners/users/:id', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new summonersController();


      const promise = controller.getAllByUserId.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.get('/api/v1/summoners/match/:id', [checkJwt],
    async function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new summonersController();


      const promise = controller.getMatchInfo.apply(controller, validatedArgs as any);
      await promiseHandler(controller, promise, response, next);
    });
  app.post('/api/v1/summoners', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        userId: { "in": "body-prop", "name": "userId", "required": true, "dataType": "string" },
        summonerName: { "in": "body-prop", "name": "summonerName", "required": true, "unique": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new summonersController();


      const promise = controller.create.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/api/v1/summoners/get_matches_ext', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        userId: { "in": "body-prop", "name": "userId", "required": true, "dataType": "string" },
        id: { "in": "body-prop", "name": "id", "required": true, "dataType": "string" }
      };
      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }
      const controller = new summonersController();


      const promise = controller.getMatchesExt.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/api/v1/summoners/match_info_ext', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        userId: { "in": "body-prop", "name": "userId", "required": true, "dataType": "string" },
        id: { "in": "body-prop", "name": "id", "required": true, "dataType": "string" }
      };
      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new summonersController();


      const promise = controller.setLastMatchInfoExt.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.put('/api/v1/summoners/:id', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        userId: { "in": "body-prop", "name": "userId", "required": true, "dataType": "string" },
        rank: { "in": "body-prop", "name": "rank", "required": true, "dataType": "string" },
        summonerName: { "in": "body-prop", "name": "summonerName", "required": true, "dataType": "string" },
        puuid: { "in": "body-prop", "name": "puuid", "required": true, "dataType": "string" },
        region: { "in": "body-prop", "name": "region", "required": true, "dataType": "string" },
        summonerLevel: { "in": "body-prop", "name": "summonerLevel", "required": true, "dataType": "double" },
        accountId: { "in": "body-prop", "name": "accountId", "required": true, "dataType": "string" },
        profileIconId: { "in": "body-prop", "name": "profileIconId", "required": true, "dataType": "double" },
        deletedAt: { "in": "body-prop", "name": "deletedAt", "required": true, "dataType": "any" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new summonersController();


      const promise = controller.update.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.put('/api/v1/summoners/main/:id', [checkJwt],
    function(request: any, response: any, next: any) {
      console.log('paco');
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        userId: { "in": "body-prop", "name": "userId", "required": true, "dataType": "string" },
        main: { "in": "body-prop", "name": "main", "required": true, "dataType": "boolean" }
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new summonersController();


      const promise = controller.setMain.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.delete('/api/v1/summoners/:id', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new summonersController();


      const promise = controller.remove.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.delete('/api/v1/summoners/delete/:id', [checkJwt, checkRol],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new summonersController();


      const promise = controller.trueRemove.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.get('/api/v1/database', [checkJwt, checkRol],
    function(request: any, response: any, next: any) {
      const args = {
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new databaseController();


      const promise = controller.getAll.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.get('/api/v1/database/:id', [checkJwt, checkRol],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new databaseController();


      const promise = controller.getOne.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/api/v1/database', [checkJwt, checkRol],
    function(request: any, response: any, next: any) {
      const args = {
        tag: { "in": "body-prop", "name": "tag", "required": true, "dataType": "string" },
        setTft: { "in": "body-prop", "name": "setTft", "required": true, "dataType": "string" },
        data: { "in": "body-prop", "name": "data", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new databaseController();


      const promise = controller.create.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.put('/api/v1/database/:id', [checkJwt, checkRol],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        tag: { "in": "body-prop", "name": "tag", "required": true, "dataType": "string" },
        setTft: { "in": "body-prop", "name": "setTft", "required": true, "dataType": "string" },
        data: { "in": "body-prop", "name": "data", "required": true, "dataType": "string" },
        deletedAt: { "in": "body-prop", "name": "deletedAt", "required": true, "dataType": "datetime" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new databaseController();


      const promise = controller.update.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.delete('/api/v1/database/:id', [checkJwt, checkRol],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new databaseController();


      const promise = controller.remove.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.get('/api/v1/retries', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new retriesController();


      const promise = controller.getAll.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.get('/api/v1/retries/:id', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new retriesController();


      const promise = controller.getOne.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/api/v1/retries', [checkJwt, checkRol],
    function(request: any, response: any, next: any) {
      const args = {
        userId: { "in": "body-prop", "name": "userId", "required": true, "dataType": "string" },
        action: { "in": "body-prop", "name": "action", "required": true, "dataType": "string" },
        retries: { "in": "body-prop", "name": "retries", "default": 0, "required": true, "dataType": "string" },
        first: { "in": "body-prop", "name": "first", "required": true, "dataType": "datetime" },
        last: { "in": "body-prop", "name": "last", "required": true, "dataType": "datetime" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new retriesController();


      const promise = controller.create.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.put('/api/v1/retries/:id', [checkJwt, checkRol],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        userId: { "in": "body-prop", "name": "userId", "required": true, "dataType": "string" },
        action: { "in": "body-prop", "name": "action", "required": true, "dataType": "string" },
        retries: { "in": "body-prop", "name": "retries", "required": true, "dataType": "double" },
        first: { "in": "body-prop", "name": "first", "required": true, "dataType": "datetime" },
        last: { "in": "body-prop", "name": "last", "required": true, "dataType": "datetime" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new retriesController();


      const promise = controller.update.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.delete('/api/v1/retries/:id', [checkJwt, checkRol],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new retriesController();


      const promise = controller.remove.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.get('/api/v1/summonerStats', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new summonerStatsController();


      const promise = controller.getAll.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.get('/api/v1/summonerStats/:summonerId', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        summonerId: { "in": "path", "name": "summonerId", "required": true, "dataType": "string" }
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new summonerStatsController();


      const promise = controller.getOne.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/api/v1/summonerStats', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        userId: { "in": "body-prop", "name": "userId", "required": true, "dataType": "string" },
        action: { "in": "body-prop", "name": "action", "required": true, "dataType": "string" },
        summonerStats: { "in": "body-prop", "name": "summonerStats", "required": true, "dataType": "string" },
        first: { "in": "body-prop", "name": "first", "required": true, "dataType": "datetime" },
        last: { "in": "body-prop", "name": "last", "required": true, "dataType": "datetime" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new summonerStatsController();


      const promise = controller.create.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.put('/api/v1/summonerStats/:id', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        userId: { "in": "body-prop", "name": "userId", "required": true, "dataType": "string" },
        action: { "in": "body-prop", "name": "action", "required": true, "dataType": "string" },
        summonerStats: { "in": "body-prop", "name": "summonerStats", "required": true, "dataType": "double" },
        first: { "in": "body-prop", "name": "first", "required": true, "dataType": "datetime" },
        last: { "in": "body-prop", "name": "last", "required": true, "dataType": "datetime" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new summonerStatsController();


      const promise = controller.update.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.delete('/api/v1/summonerStats/:id', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new summonerStatsController();


      const promise = controller.remove.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });

  app.get('/api/v1/match_notes/:entrieId', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        entrieId: { "in": "path", "name": "entrieId", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }
      const controller = new matchNotesController();


      const promise = controller.getAll.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.get('/api/v1/match_notesh/:entrieId/:userId', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        entrieId: { "in": "path", "name": "entrieId", "required": true, "dataType": "string" },
        userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" }
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }
      const controller = new matchNotesController();


      const promise = controller.getHiddenNotes.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/api/v1/match_notes', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        userId: { "in": "body-prop", "name": "userId", "required": true, "dataType": "string" },
        entrieId: { "in": "body-prop", "name": "entrieId", "required": true, "dataType": "string" },
        text: { "in": "body-prop", "name": "text", "required": true, "dataType": "string" },
        visible: { "in": "body-prop", "name": "visible", "required": true, "dataType": "boolean" }
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new matchNotesController();


      const promise = controller.create.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.put('/api/v1/match_notes/:id', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        userId: { "in": "body-prop", "name": "userId", "required": true, "dataType": "string" },
        entrieId: { "in": "body-prop", "name": "entrieId", "required": true, "dataType": "string" },
        text: { "in": "body-prop", "name": "text", "required": true, "dataType": "string" },
        visible: { "in": "body-prop", "name": "visible", "required": true, "dataType": "boolean" }
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new matchNotesController();


      const promise = controller.update.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.delete('/api/v1/match_notes/:id', [checkJwt],
    function(request: any, response: any, next: any) {
      const args = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        return next(err);
      }

      const controller = new matchNotesController();


      const promise = controller.remove.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });

  function isController(object: any): object is Controller {
    return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
  }

  function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
    return Promise.resolve(promise)
      .then((data: any) => {
        let statusCode;
        if (isController(controllerObj)) {
          const headers = controllerObj.getHeaders();
          Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
          });

          statusCode = controllerObj.getStatus();
        }

        if (data || data === false) { // === false allows boolean result
          response.status(statusCode || 200).json(data);
        } else {
          response.status(statusCode || 204).end();
        }
      })
      .catch((error: any) => next(error));
  }

  function getValidatedArgs(args: any, request: any): any[] {
    const fieldErrors: FieldErrors = {};
    const values = Object.keys(args).map((key) => {
      const name = args[key].name;
      switch (args[key].in) {
        case 'request':
          return request;
        case 'query':
          return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors);
        case 'path':
          return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors);
        case 'header':
          return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors);
        case 'body':
          return validationService.ValidateParam(args[key], request.body, name, fieldErrors, name + '.');
        case 'body-prop':
          return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.');
      }
    });
    if (Object.keys(fieldErrors).length > 0) {
      throw new ValidateError(fieldErrors, '');
    }
    return values;
  }
}
