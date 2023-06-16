const sinon = require('sinon');
const repositorio = require('../models/AseguramientosRepository');

describe('repositorio.actualizarVista', () => {
    test('Debe mostrar la vista de aseguramientos con el listado de los aseguramientos', () => {
        const req = {
            session: {
                autenticado: true,
                usuario: {
                    rol: 'admin'
                }
            },
            getConnection: sinon.stub().callsArgWith(0, null, {
                query: sinon.stub().callsArgWith(1, null, [
                    { id: 1, nombre: 'Aseguramiento 1' },
                    { id: 2, nombre: 'Aseguramiento 2' },
                    { id: 3, nombre: 'Aseguramiento 3' }
                ])
            })
        };
        const res = {
            render: jest.fn(),
            redirect: jest.fn()
        };

        repositorio.actualizarVista(req, res);

        expect(req.session.autenticado).toBe(true);
        expect(req.session.usuario.rol).toBe('admin');
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith('admin/aseguramientos', {
            usuario: req.session.usuario,
            aseguramientos: [
                { id: 1, nombre: 'Aseguramiento 1' },
                { id: 2, nombre: 'Aseguramiento 2' },
                { id: 3, nombre: 'Aseguramiento 3' }
            ]
        });
        expect(res.redirect).toHaveBeenCalledTimes(0);
    });

    test('Si el usuario no está autenticado debe redirigir a la página de inicio de sesión', () => {
        const req = {
            session: {
                autenticado: false
            }
        };
        const res = {
            render: jest.fn(),
            redirect: jest.fn()
        };

        repositorio.actualizarVista(req, res);
        expect(req.session.autenticado).toBe(false);
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith('/');
        expect(res.render).toHaveBeenCalledTimes(0);
    });

});

describe('repositorio.vistaNuevoAseguramiento', () => {
    test('Si la sesión está autenticada y el usuario es administrador, se debe renderizar la vista de nuevo aseguramiento', () => {
      const req = {
        session: {
          autenticado: true,
          usuario: { rol: 'admin' }
        }
      };
      const res = {
        render: jest.fn()
      };
  
      repositorio.vistaNuevoAseguramiento(req, res);
  
      expect(res.render).toHaveBeenCalledWith('admin/nuevoAseguramiento', {
        usuario: req.session.usuario
      });
    });
  
    test('Si el usuario no está autenticado o el usuario no es administrador, se debe redirigir a la página de inicio de sesión', () => {
      const req = {
        session: {
          autenticado: false,
          usuario: { rol: 'usuario' }
        }
      };
      const res = {
        redirect: jest.fn()
      };
  
      repositorio.vistaNuevoAseguramiento(req, res);
  
      expect(res.redirect).toHaveBeenCalledWith('/');
    });
  });



