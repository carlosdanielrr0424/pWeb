const express = require('express');
const session = require('express-session');
const request = require('supertest');
const repositorio = require('../models/AutenticarUsuarioRepository');

describe('repositorio.cerrarSesion', () => {
    test('El sistema debe destruir los datos del usuario y redireccionar a la página de inicio de sesión', (done) => {
      const app = express();
      app.use(session({ secret: 'secreto' }));
      app.get('/', (req, res) => {
        repositorio.cerrarSesion(req, res);
      });
      request(app)
        .get('/')
        .expect(302)
        .expect('Location', '/')
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
  });