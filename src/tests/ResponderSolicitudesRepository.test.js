const sinon = require('sinon');
const repositorio = require('../models/ResponderSolicitudesRepository');

describe('repositorio', () => {
    let req, res, connection;
  
    beforeEach(() => {
      req = {
        session: { autenticado: true, usuario: { rol: 'admin' } },
        params: { id: 1 },
      };
      res = { 
        redirect: jest.fn(),
        locals: { mensaje: jest.fn() } 
      };
      connection = { query: jest.fn() };
      req.getConnection = jest.fn().mockReturnValue(connection);
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    it('Si el usuario está autenticado y su rol es admin, debería aprobar una solicitud en estado pendiente', () => {
      repositorio.aprobarSolicitud(req, res);
      expect(connection.query).toHaveBeenCalledWith(
        'UPDATE solicitud set ? WHERE id = ?', 
        [{estado: 'aprobada'}, 1],
        expect.any(Function)
      );
      expect(res.redirect).not.toHaveBeenCalled();
    });
  
    it('Si el usuario no está autenticado debería redirigir a la página de inicio de sesión', () => {
      req.session.autenticado = false;
      repositorio.aprobarSolicitud(req, res);
      expect(connection.query).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/');
    });
  
    it('Si el rol del usuario no es admin debería redirigir a la página de inicio de sesión', () => {
      req.session.usuario.rol = 'user';
      repositorio.aprobarSolicitud(req, res);
      expect(connection.query).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/');
    });
});

describe('repositorio', () => {
  let req, res, connection;

  beforeEach(() => {
    req = {
      session: { autenticado: true, usuario: { rol: 'admin' } },
      params: { id: 2 },
    };
    res = { 
      redirect: jest.fn(),
      locals: { mensaje: jest.fn() } 
    };
    connection = { query: jest.fn() };
    req.getConnection = jest.fn().mockReturnValue(connection);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Si el usuario está autenticado y su rol es admin, debería denegar una solicitud en estado pendiente', () => {
    repositorio.aprobarSolicitud(req, res);
    expect(connection.query).toHaveBeenCalledWith(
      'UPDATE solicitud set ? WHERE id = ?', 
      [{estado: 'denegada'}, 1],
      expect.any(Function)
    );
    expect(res.redirect).not.toHaveBeenCalled();
  });

  it('Si el usuario no está autenticado debería redirigir a la página de inicio de sesión', () => {
    req.session.autenticado = false;
    repositorio.aprobarSolicitud(req, res);
    expect(connection.query).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  it('Si el rol del usuario no es admin debería redirigir a la página de inicio de sesión', () => {
    req.session.usuario.rol = 'user';
    repositorio.aprobarSolicitud(req, res);
    expect(connection.query).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/');
  });
});