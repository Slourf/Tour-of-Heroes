var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pkg from "pg";
import { dbInfo } from "../../helper";
const { Client } = pkg;
export const getHeroesById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new Client(dbInfo);
    client.connect();
    const resp = (yield client.query(`SELECT * FROM heroes WHERE id = ${id}`)).rows[0];
    client.end();
    return resp;
});
export const getHeroes = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new Client(dbInfo);
    client.connect();
    const resp = (yield client.query('SELECT * FROM heroes')).rows;
    client.end();
    return resp;
});
export const addHero = (name, description) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new Client(dbInfo);
    client.connect();
    yield client.query(`INSERT INTO heroes (name) VALUES ('${name}')`);
    client.end();
});
//# sourceMappingURL=queries.js.map