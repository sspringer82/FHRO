import sqlite3 from 'sqlite3';

export default {
  db: new sqlite3.Database('./data/data.sqlite3'),
  persons: [
    {
      id: 1,
      firstname: 'Klaus',
      lastname: 'Müller',
      hobbies: 'Lesen, Schreiben, Rechnen',
    },
  ],

  async getOne(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM Person WHERE id = ?', id, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  },

  getAll() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT firstname, lastname, 
           (SELECT GROUP_CONCAT(title, ", ") FROM Hobby AS h 
              LEFT JOIN Person_Hobby AS ph ON h.id = ph.hobbyId 
              WHERE ph.personId = p.id) AS hobby 
        FROM Person AS p`,
        // `SELECT p.id, p.firstname, p.lastname, p.username, p.password, h.title as hobby FROM Person AS p
        //    LEFT JOIN Person_Hobby AS ph ON p.id = ph.personId
        //    LEFT JOIN Hobby AS h ON ph.hobbyId = h.id;`,
        (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
            // const result = [];
            // data.forEach((person) => {
            //   const pIndex = result.findIndex((p) => p.id === person.id);
            //   if (pIndex >= 0) {
            //     result[pIndex].hobby += ', ' + person.hobby;
            //   } else {
            //     result.push(person);
            //   }
            // });
            // resolve(result);
          }
        },
      );
    });
  },

  create(person) {
    const query =
      'INSERT INTO Person (firstname, lastname, hobbies) VALUES (?, ?, ?)';
    return new Promise((resolve, reject) => {
      this.db.run(
        query,
        [person.firstname, person.lastname, person.hobbies],
        function (error) {
          if (error) {
            reject(error);
          } else {
            resolve({ ...person, id: this.lastID });
          }
        },
      );
    });
  },

  update(person) {
    const query =
      'UPDATE Person SET firstname = ?, lastname = ?, hobbies = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
      this.db.run(
        query,
        [person.firstname, person.lastname, person.hobbies, person.id],
        function (error) {
          if (error) {
            reject(error);
          } else {
            resolve(person);
          }
        },
      );
    });
  },

  async delete(id) {
    const person = await this.getOne(id);
    const query = 'DELETE FROM Person WHERE id = ?';
    return new Promise((resolve, reject) => {
      this.db.run(query, person.id, function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(person);
        }
      });
    });
  },
};
