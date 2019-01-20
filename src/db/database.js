import _ from 'lodash';
import sqlite from 'sqlite3';

export default function loadDatabase(dbPath) {
    return new Promise((resolve, reject) => {
        const db = new sqlite.Database(dbPath, (err) => {
            if (err) {
                reject(err);
            }

            db.execute = function (query) {
                return new Promise((resolve1, reject1) => {
                    db.exec(query, function (err, rows) {
                        if (err) {
                            reject1(err);
                            return;
                        }

                        resolve1(rows);
                    });
                });
            };

            db.select = function (query, args = []) {
                return new Promise((resolve1, reject1) => {
                    db.all(query, args, function (err, rows) {
                        if (err) {
                            reject1(err);
                            return;
                        }

                        resolve1(rows);
                    });
                });
            };

            db.single = function (query, args = []) {
                return new Promise((resolve1, reject1) => {
                    db.select(query, args)
                        .then(res => {
                            resolve1(_.head(res));
                        }).catch(reject1);
                })
            };

            resolve(db);
        });
    });
};
